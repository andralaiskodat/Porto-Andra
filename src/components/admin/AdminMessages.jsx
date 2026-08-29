import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaUser, 
  FaCalendar, 
  FaTrash, 
  FaTimes, 
  FaSignOutAlt, 
  FaClock, 
  FaShieldAlt,
  FaSearch,
  FaExclamationTriangle,
  FaCheck
} from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';

const AdminMessages = ({ isOpen, onClose, onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Unread', 'Read'
  const [sessionTime, setSessionTime] = useState('');
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  
  const { logout, getSessionTimeRemaining, extendSession } = useAdmin();

  // Load messages from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedMessages = localStorage.getItem('portfolioContactMessages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
        setFilteredMessages(parsed);
        if (parsed.length > 0) setSelectedMessage(parsed[0]);
      }
    }
  }, [isOpen]);

  // Filter & Search messages
  useEffect(() => {
    let result = [...messages];

    if (filterType === 'Unread') {
      result = result.filter(m => m.status === 'unread');
    } else if (filterType === 'Read') {
      result = result.filter(m => m.status === 'read');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        (m.name && m.name.toLowerCase().includes(q)) || 
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.message && m.message.toLowerCase().includes(q))
      );
    }

    setFilteredMessages(result);
  }, [searchQuery, filterType, messages]);

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

  // Mark message as read
  const markAsRead = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('portfolioContactMessages', JSON.stringify(updatedMessages));
  };

  // Delete message
  const confirmDeleteMessage = () => {
    if (!deletingMessageId) return;
    const updatedMessages = messages.filter(msg => msg.id !== deletingMessageId);
    setMessages(updatedMessages);
    localStorage.setItem('portfolioContactMessages', JSON.stringify(updatedMessages));
    if (selectedMessage?.id === deletingMessageId) {
      setSelectedMessage(updatedMessages[0] || null);
    }
    setDeletingMessageId(null);
    showToast('success', 'Pesan berhasil dihapus');
  };

  // Open message details
  const openMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    onClose();
  };

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

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
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/20">
              <FaEnvelope className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-moderniz">
                  MESSAGES INBOX
                </h2>
                <span className="hidden sm:inline-flex bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                  {messages.length} Total ({unreadCount} Belum Dibaca)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pesan masuk dari pengunjung melalui formulir kontak
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
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-sm transition-all"
            >
              📧 Messages
            </button>
            <button
              onClick={() => onNavigate && onNavigate('comments')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
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

        {/* ================= ACTIONS BAR (SEARCH & FILTER) ================= */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari nama, email, atau isi pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 text-sm focus:border-cyan-400 focus:outline-none transition-all"
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
              {['All', 'Unread', 'Read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterType === f
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {f} {f === 'Unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= MAIN SPLIT CONTENT ================= */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-[60vh] sm:h-[65vh]">
          {/* Left Panel: Messages List */}
          <div className="w-full md:w-1/2 border-r border-slate-800 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
                <FaEnvelope className="text-5xl opacity-30 mb-3" />
                <p className="text-base font-medium text-slate-300">Tidak ada pesan ditemukan</p>
                <p className="text-xs text-slate-500 mt-1">Kotak masuk Anda saat ini bersih</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openMessage(message)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    selectedMessage?.id === message.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : message.status === 'unread'
                      ? 'bg-slate-800/70 border-cyan-500/30'
                      : 'bg-slate-800/30 hover:bg-slate-800/60 border-slate-700/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {message.status === 'unread' ? (
                          <FaEnvelope className="text-cyan-400 text-xs flex-shrink-0" />
                        ) : (
                          <FaEnvelopeOpen className="text-slate-500 text-xs flex-shrink-0" />
                        )}
                        <h4 className={`text-sm font-semibold truncate ${
                          message.status === 'unread' ? 'text-white' : 'text-slate-300'
                        }`}>
                          {message.name}
                        </h4>
                        {message.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mb-1">{message.email}</p>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {message.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        {message.timestamp ? new Date(message.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Right Panel: Selected Message Details */}
          <div className="w-full md:w-1/2 flex flex-col bg-slate-900/30 overflow-y-auto custom-scrollbar">
            {selectedMessage ? (
              <div className="p-6 flex flex-col h-full justify-between space-y-6">
                <div>
                  {/* Message Author Header */}
                  <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                        {selectedMessage.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {selectedMessage.name}
                        </h3>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-xs text-cyan-400 hover:underline block"
                        >
                          {selectedMessage.email}
                        </a>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {selectedMessage.timestamp ? new Date(selectedMessage.timestamp).toLocaleDateString('id-ID', {
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeletingMessageId(selectedMessage.id)}
                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-400/30 transition-all"
                        title="Hapus Pesan"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="mt-6">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Isi Pesan
                    </label>
                    <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 shadow-inner">
                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-cascadia">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reply action button */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Kontak Portofolio&body=Halo ${selectedMessage.name},%0D%0A%0D%0ATerima kasih telah menghubungi saya.`}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <FaEnvelope /> Balas via Email
                  </a>
                  <span className="font-mono text-[10px] text-slate-500">ID: {selectedMessage.id}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8">
                <FaEnvelopeOpen className="text-5xl opacity-20 mb-3" />
                <p className="text-base font-medium text-slate-300">Pilih pesan untuk membaca isi lengkap</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= MODAL CONFIRM DELETE ================= */}
        <AnimatePresence>
          {deletingMessageId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[10001] p-4"
              onClick={() => setDeletingMessageId(null)}
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
                <h3 className="text-xl font-bold text-white mb-2">Hapus Pesan Ini?</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Pesan ini akan dihapus secara permanen dari daftar kontak inbox.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={confirmDeleteMessage}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Ya, Hapus
                  </button>
                  <button
                    onClick={() => setDeletingMessageId(null)}
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

export default AdminMessages;
