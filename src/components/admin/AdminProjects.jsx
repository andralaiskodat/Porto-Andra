import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFolderPlus, 
  FaEdit, 
  FaTrash, 
  FaExternalLinkAlt, 
  FaImage, 
  FaTimes, 
  FaCheck, 
  FaSearch, 
  FaFilter, 
  FaCloudUploadAlt, 
  FaExclamationTriangle,
  FaClock,
  FaSignOutAlt,
  FaShieldAlt,
  FaLayerGroup,
  FaDatabase,
  FaPlus,
  FaTag
} from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  validateImageSize, 
  isSupabaseConfigured,
  MAX_FILE_SIZE_MB
} from '../../lib/supabase';

const POPULAR_TECHS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 
  'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Python', 
  'Flask', 'Prisma', 'Figma', 'Photoshop', 'Illustrator', 'Vite'
];

const CATEGORIES = ['Web/Apps', 'Graphic Design', 'UI/UX Design', 'Mobile Apps', 'AI / Machine Learning'];

const AdminProjects = ({ isOpen, onClose, onNavigate }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast & Error states
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [fileError, setFileError] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  
  // Form input states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web/Apps',
    tech: [],
    link: '',
    image: '',
  });
  const [customTechInput, setCustomTechInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fileSizeInfo, setFileSizeInfo] = useState({ sizeMB: '0.00', valid: true });
  
  const fileInputRef = useRef(null);
  const { logout, getSessionTimeRemaining, extendSession } = useAdmin();

  // Load Projects
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
      showToast('error', 'Gagal memuat daftar proyek');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  // Filter projects by search and category
  useEffect(() => {
    let result = [...projects];
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (Array.isArray(p.tech) && p.tech.some(t => t.toLowerCase().includes(q)))
      );
    }
    setFilteredProjects(result);
  }, [searchQuery, selectedCategory, projects]);

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

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Handle open Form (Create or Edit)
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: 'Web/Apps',
      tech: ['React', 'TailwindCSS'],
      link: '',
      image: '',
    });
    setImageFile(null);
    setImagePreview('');
    setFileSizeInfo({ sizeMB: '0.00', valid: true });
    setFileError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Web/Apps',
      tech: Array.isArray(project.tech) ? project.tech : [],
      link: project.link || '',
      image: project.image || '',
    });
    setImageFile(null);
    setImagePreview(project.image || '');
    setFileSizeInfo({ sizeMB: '0.00', valid: true });
    setFileError('');
    setIsFormModalOpen(true);
  };

  // Handle Image Selection with strict 5MB limit
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate 5MB limit
    const validation = validateImageSize(file);
    setFileSizeInfo({ sizeMB: validation.sizeMB, valid: validation.valid });

    if (!validation.valid) {
      setFileError(validation.message);
      setImageFile(null);
      setImagePreview('');
      return;
    }

    setFileError('');
    setImageFile(file);

    // Generate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Tech stack tag helpers
  const handleAddTech = (techName) => {
    const trimmed = techName.trim();
    if (trimmed && !formData.tech.includes(trimmed)) {
      setFormData(prev => ({ ...prev, tech: [...prev.tech, trimmed] }));
    }
    setCustomTechInput('');
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter(t => t !== techToRemove)
    }));
  };

  // Form Submit (Create / Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Judul proyek wajib diisi');
      return;
    }
    if (!editingProject && !imageFile && !formData.image) {
      showToast('error', 'Foto proyek wajib dipilih (Maksimal 5 MB)');
      return;
    }
    if (imageFile) {
      const validation = validateImageSize(imageFile);
      if (!validation.valid) {
        showToast('error', validation.message);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (editingProject) {
        // UPDATE
        await updateProject(editingProject.id, formData, imageFile);
        showToast('success', `Proyek "${formData.title}" berhasil diperbarui!`);
      } else {
        // CREATE
        await createProject(formData, imageFile);
        showToast('success', `Proyek "${formData.title}" berhasil ditambahkan!`);
      }

      setIsFormModalOpen(false);
      await loadProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      showToast('error', err.message || 'Gagal menyimpan proyek');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!deletingProjectId) return;
    setIsSubmitting(true);
    try {
      const project = projects.find(p => p.id === deletingProjectId);
      await deleteProject(deletingProjectId, project?.image);
      showToast('success', 'Proyek berhasil dihapus');
      setDeletingProjectId(null);
      await loadProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      showToast('error', 'Gagal menghapus proyek');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* ================= HEADER ADMIN ================= */}
        <div className="p-4 sm:p-6 border-b border-slate-700/50 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-2xl shadow-lg shadow-cyan-500/20">
              <FaLayerGroup className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-moderniz">
                  PROJECT MANAGER
                </h2>
                <span className="hidden sm:inline-flex bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                  {projects.length} Total
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {isSupabaseConfigured() ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Supabase Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-300" title="Koneksi Supabase belum diatur di .env. Menggunakan Local Storage fallback.">
                    <FaDatabase className="text-[10px]" /> Local Storage Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onNavigate && onNavigate('projects')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-sm transition-all"
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
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
            >
              💬 Comments
            </button>
          </div>

          {/* Controls: Timer, Add Button, Logout, Close */}
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
                placeholder="Cari judul, deskripsi, atau tech..."
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

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Add New Project Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <FaPlus className="text-xs" />
            <span>Tambah Proyek</span>
          </button>
        </div>

        {/* ================= PROJECTS LIST / GRID ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-slate-800/40 border border-slate-700/30 animate-pulse p-4 flex flex-col justify-between">
                  <div className="h-32 rounded-xl bg-slate-700/50"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700/50 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
              <FaLayerGroup className="text-5xl opacity-30 mb-3" />
              <p className="text-lg font-medium text-slate-300">Belum ada proyek yang sesuai</p>
              <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau tambah proyek baru</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-slate-800/40 hover:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:border-cyan-500/40 overflow-hidden transition-all duration-300 shadow-xl flex flex-col"
                >
                  {/* Project Image Preview */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400/0f172a/00ffdc?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/80 backdrop-blur-md text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-400/30 font-medium">
                        {project.category}
                      </span>
                    </div>

                    {/* External Link Pill */}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-full border border-slate-700 transition-all"
                        title="Buka Link Proyek"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                      </a>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {Array.isArray(project.tech) && project.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/60 text-slate-300 border border-slate-700/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-700/40">
                      <span className="text-[10px] text-slate-500">
                        {project.created_at ? new Date(project.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : ''}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(project)}
                          className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-400/30 text-xs font-semibold transition-all hover:scale-105"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingProjectId(project.id)}
                          className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg border border-red-400/30 text-xs font-semibold transition-all hover:scale-105"
                        >
                          <FaTrash /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ================= MODAL FORM: CREATE / EDIT ================= */}
        <AnimatePresence>
          {isFormModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-[10000] p-3 sm:p-4 overflow-y-auto"
              onClick={() => !isSubmitting && setIsFormModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-900 border border-slate-700/70 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Form Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-xl">
                      {editingProject ? <FaEdit className="text-white text-lg" /> : <FaFolderPlus className="text-white text-lg" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Isi detail proyek dan upload 1 foto (maksimal 5 MB)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFormModalOpen(false)}
                    disabled={isSubmitting}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmitForm} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Judul Proyek <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RestoPOS - QR Based Ordering"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Category & Link Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Kategori <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="bg-slate-900 text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Link Proyek (Website / Demo / Repo)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={formData.link}
                          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                          className="w-full pl-4 pr-10 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none"
                        />
                        {formData.link && (
                          <a
                            href={formData.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
                            title="Test Link"
                          >
                            <FaExternalLinkAlt className="text-xs" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Deskripsi Proyek <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Jelaskan secara singkat fitur, tujuan, dan arsitektur proyek ini..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none resize-none"
                      required
                    ></textarea>
                  </div>

                  {/* Tech Stack Tag Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Tech Stack (Teknologi yang Digunakan)
                    </label>
                    
                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2 bg-slate-800/30 rounded-xl border border-slate-700/50">
                      {formData.tech.length === 0 ? (
                        <span className="text-xs text-slate-500 italic p-1">Belum ada tech stack yang dipilih</span>
                      ) : (
                        formData.tech.map((t) => (
                          <span
                            key={t}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-medium"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(t)}
                              className="hover:text-red-300"
                            >
                              <FaTimes className="text-[10px]" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Quick Add Pills & Input */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tambah teknologi kustom (e.g. Supabase, GraphQL)..."
                          value={customTechInput}
                          onChange={(e) => setCustomTechInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTech(customTechInput);
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white text-xs focus:border-cyan-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTech(customTechInput)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-600 rounded-lg text-xs font-semibold"
                        >
                          + Tambah
                        </button>
                      </div>

                      {/* Popular suggestions */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                          <FaTag className="text-[10px]" /> Populer:
                        </span>
                        {POPULAR_TECHS.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => handleAddTech(tech)}
                            className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                              formData.tech.includes(tech)
                                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            + {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ================= PHOTO UPLOAD SECTION (5MB LIMIT) ================= */}
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Foto Proyek (Maksimal 5 MB) <span className="text-red-400">*</span>
                      </label>
                      {fileSizeInfo.sizeMB !== '0.00' && (
                        <span className={`text-xs font-mono font-semibold ${
                          fileSizeInfo.valid ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {fileSizeInfo.sizeMB} MB / {MAX_FILE_SIZE_MB}.00 MB
                        </span>
                      )}
                    </div>

                    {/* Drag and drop / file input box */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-700 group max-h-56 bg-slate-950">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg"
                          >
                            <FaCloudUploadAlt /> Ganti Foto
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview('');
                              setFormData(prev => ({ ...prev, image: '' }));
                              setFileSizeInfo({ sizeMB: '0.00', valid: true });
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg"
                          >
                            <FaTrash /> Hapus Foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-slate-600 hover:border-cyan-400 rounded-xl p-6 text-center transition-all bg-slate-800/20 hover:bg-slate-800/40 group"
                      >
                        <FaCloudUploadAlt className="mx-auto text-4xl text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                        <p className="text-sm font-semibold text-white group-hover:text-cyan-300">
                          Klik untuk memilih foto proyek
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Format PNG, JPG, JPEG, WebP (Batas ukuran file maksimal <strong className="text-cyan-300">5 MB</strong>)
                        </p>
                      </div>
                    )}

                    {/* File Size Error Alert */}
                    {fileError && (
                      <div className="p-3 bg-red-500/20 border border-red-400/40 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                        <FaExclamationTriangle className="flex-shrink-0 text-sm" />
                        <span>{fileError}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="submit"
                      disabled={isSubmitting || !fileSizeInfo.valid}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaCheck />
                          <span>{editingProject ? 'Simpan Perubahan' : 'Tambah Proyek'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= MODAL CONFIRM DELETE ================= */}
        <AnimatePresence>
          {deletingProjectId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[10001] p-4"
              onClick={() => !isSubmitting && setDeletingProjectId(null)}
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
                <h3 className="text-xl font-bold text-white mb-2">Hapus Proyek Ini?</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Tindakan ini permanen dan akan menghapus data proyek serta fotonya dari database Supabase / Local Storage.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Ya, Hapus'
                    )}
                  </button>
                  <button
                    onClick={() => setDeletingProjectId(null)}
                    disabled={isSubmitting}
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

export default AdminProjects;
