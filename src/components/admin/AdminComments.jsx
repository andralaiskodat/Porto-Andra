import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaComment,
  FaComments,
  FaUser,
  FaCalendar,
  FaTrash,
  FaThumbsUp,
  FaTimes,
  FaSignOutAlt,
  FaClock,
  FaShieldAlt,
  FaEdit,
  FaCheck,
  FaPlus,
  FaSearch,
  FaFilter,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';

const AdminComments = ({ isOpen, onClose, onNavigate }) => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'With Likes', 'Recent'
  const [sessionTime, setSessionTime] = useState('');
  
  // Edit & Add Modal state
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [newComment, setNewComment] = useState({
    name: '',
    message: ''
  });

  const { logout, getSessionTimeRemaining, extendSession } = useAdmin();

  // Load comments from localStorage and fallback to JSON
  useEffect(() => {
    const loadComments = async () => {
      try {
        const savedComments = localStorage.getItem('portfolioComments');
        if (savedComments) {
          const parsed = JSON.parse(savedComments);
          setComments(parsed);
          setFilteredComments(parsed);
          if (parsed.length > 0) setSelectedComment(parsed[0]);
        } else {
          const response = await fetch('/comments.json');
          if (response.ok) {
            const data = await response.json();
            setComments(data);
            setFilteredComments(data);
            if (data.length > 0) setSelectedComment(data[0]);
            localStorage.setItem('portfolioComments', JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        setComments([]);
      }
    };

    if (isOpen) {
      loadComments();
    }
  }, [isOpen]);

  // Filter & Search comments
  useEffect(() => {
    let result = [...comments];
    
    if (filterType === 'With Likes') {
      result = result.filter(c => c.likes > 0);
    } else if (filterType === 'Recent') {
      result = result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.message && c.message.toLowerCase().includes(q))
      );
    }

    setFilteredComments(result);
  }, [searchQuery, filterType, comments]);

  // Session timer
  useEffect(() => {
    const updateSessionTime = () => {
      const remaining = getSessionTimeRemaining();
      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setSessionTime(`${minutes}:${String(seconds).padStart(2, '0')}`);

      if (remaining <= 0) {
        handleLogout();
      }
    };

    if (isOpen) {
      updateSessionTime();
      const timer = setInterval(updateSessionTime, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, getSessionTimeRemaining]);

  const showToast = (type, message) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage({ type: '', message: '' }), 4000);
  };

  // Save comments to localStorage
  const saveComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem('portfolioComments', JSON.stringify(updatedComments));
  };

  // Delete comment
  const confirmDeleteComment = () => {
    if (!deletingCommentId) return;
    const updatedComments = comments.filter(comment => comment.id !== deletingCommentId);
    saveComments(updatedComments);
    if (selectedComment?.id === deletingCommentId) {
      setSelectedComment(updatedComments[0] || null);
    }
    setDeletingCommentId(null);
    showToast('success', 'Komentar berhasil dihapus');
  };

  // Edit comment
  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.message);
  };

  const saveEdit = () => {
    const updatedComments = comments.map(comment =>
      comment.id === editingComment
        ? { ...comment, message: editText, edited: true }
        : comment
    );
    saveComments(updatedComments);
    setEditingComment(null);
    setEditText('');

    if (selectedComment && selectedComment.id === editingComment) {
      setSelectedComment({ ...selectedComment, message: editText, edited: true });
    }
    showToast('success', 'Komentar berhasil diperbarui');
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  // Add new comment
  const handleAddComment = () => {
    if (!newComment.name.trim() || !newComment.message.trim()) return;

    const comment = {
      id: Date.now(),
      name: newComment.name.trim(),
      message: newComment.message.trim(),
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newComment.name)}&background=00ffdc&color=000754&size=100`,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    const updatedComments = [comment, ...comments];
    saveComments(updatedComments);
    setSelectedComment(comment);
    setNewComment({ name: '', message: '' });
    setIsAddingComment(false);
    showToast('success', 'Komentar baru berhasil ditambahkan');
  };

  // Update likes
  const updateLikes = (commentId, increment) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: Math.max(0, comment.likes + increment) }
        : comment
    );
    saveComments(updatedComments);

    if (selectedComment && selectedComment.id === commentId) {
      setSelectedComment({
        ...selectedComment,
        likes: Math.max(0, selectedComment.likes + increment)
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-6xl w-full bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-semibold shadow-2xl flex items-center gap-2 ${
                toastMessage.type === 'error'
                  ? 'bg-red-500/90 text-white border border-red-400'
                  : 'bg-emerald-500/90 text-white border border-emerald-400'
              }`}
            >
              {toastMessage.type === 'error' ? <FaExclamationTriangle /> : <FaCheck />}
              <span>{toastMessage.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= HEADER ADMIN (CONSISTENT ROW) ================= */}
        <div className="p-4 sm:p-6 border-b border-slate-700/50 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/20">
              <FaComments className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-moderniz">
                  COMMENTS MANAGER
                </h2>
                <span className="hidden sm:inline-flex bg-purple-500/20 text-purple-300 text-xs px-2.5 py-0.5 rounded-full border border-purple-400/30">
                  {comments.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola dan moderasi komentar pengunjung portofolio
              </p>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onNavigate && onNavigate('projects')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
            >
              🚀 Projects
            </button>
            <button
              onClick={() => onNavigate && onNavigate('messages')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
            >
              📧 Messages
            </button>
            <button
              onClick={() => onNavigate && onNavigate('comments')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-sm transition-all"
            >
              💬 Comments
            </button>
          </div>

          {/* Controls: Timer, Logout, Close */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 text-xs">
              <FaClock className="text-slate-400" />
              <span className="text-slate-300 font-mono">{sessionTime}</span>
              <button
                onClick={extendSession}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
                title="Perpanjang sesi 15 menit"
              >
                +15m
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="bg-orange-500/20 hover:bg-orange-500/30 p-2.5 rounded-xl border border-orange-400/30 text-orange-300 transition-all"
              title="Logout Admin"
            >
              <FaSignOutAlt />
            </button>

            <button
              onClick={onClose}
              className="bg-red-500/20 hover:bg-red-500/30 p-2.5 rounded-xl border border-red-400/30 text-red-300 transition-all"
              title="Tutup Modal"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* ================= ACTIONS BAR (SEARCH, FILTER, ADD) ================= */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari nama atau isi komentar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 text-sm focus:border-purple-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              {['All', 'With Likes', 'Recent'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterType === f
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Add New Comment Button */}
          <button
            onClick={() => setIsAddingComment(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <FaPlus className="text-xs" />
            <span>Tambah Komentar</span>
          </button>
        </div>

        {/* ================= MAIN SPLIT CONTENT ================= */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-[60vh] sm:h-[65vh]">
          {/* Left Panel: Comments List */}
          <div className="w-full md:w-1/2 border-r border-slate-800 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
                <FaComment className="text-5xl opacity-30 mb-3" />
                <p className="text-base font-medium text-slate-300">Tidak ada komentar ditemukan</p>
                <p className="text-xs text-slate-500 mt-1">Coba reset pencarian atau buat komentar baru</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedComment(comment)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    selectedComment?.id === comment.id
                      ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=00ffdc&color=000754&size=100`}
                      alt={comment.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=00ffdc&color=000754&size=100`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm truncate">
                          {comment.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-full border border-slate-800">
                          <FaThumbsUp className="text-purple-400 text-[10px]" />
                          <span>{comment.likes}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed mb-2">
                        {comment.message}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>
                          {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''}
                        </span>
                        {comment.edited && (
                          <span className="text-amber-400 italic">(diedit)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Right Panel: Selected Comment Details */}
          <div className="w-full md:w-1/2 flex flex-col bg-slate-900/30 overflow-y-auto custom-scrollbar">
            {selectedComment ? (
              <div className="p-6 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Comment Author Header */}
                  <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedComment.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedComment.name)}&background=00ffdc&color=000754&size=100`}
                        alt={selectedComment.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/40 shadow-lg"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">
                            {selectedComment.name}
                          </h3>
                          {selectedComment.edited && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                              Diedit
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {selectedComment.timestamp ? new Date(selectedComment.timestamp).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Likes Counter & Quick Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateLikes(selectedComment.id, 1)}
                        className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl border border-emerald-400/30 transition-all"
                        title="Tambah 1 Like"
                      >
                        <FaThumbsUp className="text-xs" />
                      </button>
                      <button
                        onClick={() => updateLikes(selectedComment.id, -1)}
                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-400/30 transition-all"
                        title="Kurangi 1 Like"
                      >
                        <FaThumbsUp className="text-xs rotate-180" />
                      </button>
                      <button
                        onClick={() => startEdit(selectedComment)}
                        className="p-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl border border-cyan-400/30 transition-all"
                        title="Edit Teks Komentar"
                      >
                        <FaEdit className="text-xs" />
                      </button>
                      <button
                        onClick={() => setDeletingCommentId(selectedComment.id)}
                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-400/30 transition-all"
                        title="Hapus Komentar"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Message Content / Inline Edit */}
                  <div className="mt-6">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Isi Komentar
                    </label>
                    {editingComment === selectedComment.id ? (
                      <div className="space-y-4">
                        <textarea
                          rows="4"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-4 bg-slate-800/80 border border-purple-500/50 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/20 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                          >
                            <FaCheck /> Simpan
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 shadow-inner">
                        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-cascadia">
                          {selectedComment.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Info Box */}
                <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FaThumbsUp className="text-purple-400" />
                    <span>Total Likes: <strong className="text-white">{selectedComment.likes}</strong></span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">ID: {selectedComment.id}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8">
                <FaComment className="text-5xl opacity-20 mb-3" />
                <p className="text-base font-medium text-slate-300">Pilih komentar untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= MODAL ADD COMMENT ================= */}
        <AnimatePresence>
          {isAddingComment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-[10000] p-4"
              onClick={() => setIsAddingComment(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                      <FaPlus className="text-white text-base" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Tambah Komentar Baru</h3>
                  </div>
                  <button
                    onClick={() => setIsAddingComment(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Nama Pengirim
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={newComment.name}
                      onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Pesan Komentar
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Tulis isi komentar..."
                      value={newComment.message}
                      onChange={(e) => setNewComment(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-purple-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.name.trim() || !newComment.message.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 text-sm"
                    >
                      <FaCheck /> Tambah
                    </button>
                    <button
                      onClick={() => setIsAddingComment(false)}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= MODAL CONFIRM DELETE ================= */}
        <AnimatePresence>
          {deletingCommentId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[10001] p-4"
              onClick={() => setDeletingCommentId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <FaTrash className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Hapus Komentar Ini?</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Tindakan ini permanen dan akan menghapus komentar dari tampilan website.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={confirmDeleteComment}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Ya, Hapus
                  </button>
                  <button
                    onClick={() => setDeletingCommentId(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-all"
                  >
                    Batal
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AdminComments;
