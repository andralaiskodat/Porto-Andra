// src/components/ProjectSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaExternalLinkAlt, FaReact, FaNodeJs, FaHtml5, FaCss3Alt, 
  FaJsSquare, FaTools, FaFigma, FaGithub, FaTimes, FaDownload, FaDatabase, FaLayerGroup
} from 'react-icons/fa';
import { 
  SiTailwindcss, SiNextdotjs, SiVercel, SiMongodb, 
  SiExpress, SiPostgresql, SiTypescript, SiPrisma, SiPusher, SiRedis, SiPython, SiFlask
} from 'react-icons/si';
import { PiCodeBold } from "react-icons/pi";
import { LuBadge } from "react-icons/lu";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { useNavbar } from '../../contexts/NavbarContext';
import { fetchProjects } from '../../lib/supabase';

// ===================================
// DATA SERTIFIKAT Fransisko Andrade Laiskodat
// ===================================
const userCertificates = [
    {
        title: "Asisten Praktikum Komunikasi Data",
        issuer: "Universitas Amikom Yogyakarta",
        date: "Feb 2025",
        link: "/certificates/KOMDAT_Asisten.pdf",
        image: "/certificate-images/KOMDAT_Asisten.jpg",
    },
    {
        title: "Asisten Praktikum Komputer Grafis",
        issuer: "Universitas Amikom Yogyakarta",
        date: "Feb 2025",
        link: "/certificates/KOMGRAF_Asisten.pdf",
        image: "/certificate-images/KOMGRAF_Asisten.jpg",
    },
    {
        title: "Asisten Praktikum Multi Media",
        issuer: "Universitas Amikom Yogyakarta",
        date: "Feb 2025",
        link: "/certificates/MULMED_Asisten.pdf",
        image: "/certificate-images/MULMED_Asisten.jpg",
    },
    {
        title: "Final Project Terbaik #2",
        issuer: "PIBITI UPN JAWA TIMUR",
        date: "Jun 2024",
        link: "/certificates/Piagam Juara 2 FP_Fransisko Andrade Laiskodat.pdf",
        image: "/certificate-images/Piagam Juara 2 FP_Fransisko Andrade Laiskodat.jpg",
    },
    {
        title: "Belajar react Zero to Hero",
        issuer: "PIBITI UPN JAWA TIMUR",
        date: "Jul 2025",
        link: "/certificates/Fransisko Andrade Laiskodat.pdf",
        image: "/certificate-images/Pelatihan React_Fransisko Andrade Laiskodat.jpg",
    },
    {
        title: "Partisipasi Lomba Data Mining #7",
        issuer: "IT TODAY IPB",
        date: "Agu 2025",
        link: "/certificates/Fransisko Andrade Laiskodat_IT TODAY.pdf",
        image: "/certificate-images/IT TODAY.jpg",
    },
];

const techStack = {
    frontend: [
    { name: "React", icon: <FaReact className="text-[#61DAFB]" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
    { name: "JavaScript", icon: <FaJsSquare className="text-[#F7DF1E]" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#38B2AC]" /> },
    { name: "HTML5", icon: <FaHtml5 className="text-[#E34F26]" /> },
    { name: "CSS3", icon: <FaCss3Alt className="text-[#1572B6]" /> },
  ],
  backend: [
    { name: "Node.js", icon: <FaNodeJs className="text-[#339933]" /> },
    { name: "Express", icon: <SiExpress className="text-white" /> },
  ],
  database: [
    { name: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
    { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791]" /> },
  ],
  tools: [
    { name: "Git & GitHub", icon: <FaGithub className="text-white" /> },
    { name: "Vercel", icon: <SiVercel className="text-white" /> },
    { name: "Figma", icon: <FaFigma className="text-[#F24E1E]" /> },
    { name: "Tools Lain", icon: <FaTools className="text-gray-400" /> },
  ],
};

// ===================================
// HELPER & ANIMATION COMPONENTS
// ===================================
const LineShadowText = ({ children, className, shadowColor = "#4079ff", ...props }) => {
    return (
        <motion.span
            style={{ "--shadow-color": shadowColor }}
            className={`relative z-0 line-shadow-effect ${className}`}
            data-text={children}
            {...props}
        >
            {children}
        </motion.span>
    );
};

// ===================================
// KOMPONEN KARTU SERTIFIKAT
// ===================================
const CertificateCard = ({ cert, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative cursor-pointer"
            whileHover={{ y: -8 }}
            onClick={() => onClick(cert)}
        >
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-500">
                <div className="absolute inset-0">
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30 group-hover:from-slate-900/95 transition-all duration-500"></div>
                </div>
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex-1 flex items-start justify-between">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">{cert.issuer}</span>
                        </div>
                        <div className="bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-400/30">
                            <span className="text-xs font-bold text-emerald-300">{cert.date}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 leading-tight">{cert.title}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-slate-300">
                                <FaDownload className="text-sm" />
                                <span className="text-sm font-medium">View Certificate</span>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-cyan-500/20 backdrop-blur-md p-2 rounded-full border border-cyan-400/30">
                                    <FaExternalLinkAlt className="text-cyan-300 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-transparent to-emerald-500/0 group-hover:from-cyan-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
            </div>
        </motion.div>
    );
};

// ===================================
// KOMPONEN PREVIEW MODAL SERTIFIKAT
// ===================================
const CertificatePreviewModal = ({ certificate, onClose }) => {
    if (!certificate) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative max-w-4xl w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md p-3 rounded-full border border-red-400/30 transition-all duration-300 group">
                        <FaTimes className="text-red-300 group-hover:text-red-200" />
                    </button>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{certificate.title}</h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="bg-cyan-500/20 px-4 py-2 rounded-full text-cyan-300 font-semibold border border-cyan-400/30">{certificate.issuer}</span>
                                    <span className="bg-emerald-500/20 px-4 py-2 rounded-full text-emerald-300 font-semibold border border-emerald-400/30">{certificate.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        <img src={certificate.image} alt={certificate.title} className="w-full h-auto max-h-[60vh] object-contain" />
                    </div>
                    <div className="mt-6 flex justify-center">
                        <a href={certificate.link} target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/25">
                            <FaDownload className="group-hover:scale-110 transition-transform duration-300" />
                            <span>Download Certificate</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ===================================
// KOMPONEN SKELETON LOADER PROYEK
// ===================================
const ProjectSkeleton = () => {
  return (
    <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between animate-pulse">
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-slate-800/80 rounded-lg"></div>
        <div className="h-4 w-full bg-slate-800/60 rounded-md"></div>
        <div className="h-4 w-2/3 bg-slate-800/60 rounded-md"></div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-slate-800/80 rounded-full"></div>
          <div className="h-6 w-16 bg-slate-800/80 rounded-full"></div>
        </div>
        <div className="h-8 w-8 bg-slate-800/80 rounded-full"></div>
      </div>
    </div>
  );
};

// ===================================
// KOMPONEN KARTU PROYEK (SMOOTH BLUR RENDER)
// ===================================
const ProjectCard = ({ project, index = 0 }) => {
  const techIcons = {
    "Next.js": <SiNextdotjs />, "React": <FaReact />, "TailwindCSS": <SiTailwindcss />,
    "Framer Motion": "⚡", "Node.js": <FaNodeJs />, "Express": <SiExpress />, 
    "MongoDB": <SiMongodb />, "PostgreSQL": <SiPostgresql />, "TypeScript": <SiTypescript />,
    "Prisma": <SiPrisma />, "Pusher": <SiPusher />, "Redis": <SiRedis />,
    "Python": <SiPython />, "Flask": <SiFlask />, "Figma": <FaFigma />, "Photoshop": "🎨"
  };

  return (
    <motion.a
      href={project.link || '#'}
      target={project.link ? "_blank" : "_self"}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,220,0.25)] border border-slate-800/80 hover:border-cyan-400/50 block cursor-pointer bg-slate-950"
    >
      {/* Background Image with smooth progressive zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400/060010/00ffdc?text=' + encodeURIComponent(project.title);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40 group-hover:from-slate-950/95 group-hover:via-slate-950/75 transition-all duration-300"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-between p-5 sm:p-6 z-10">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-cyan-300 group-hover:text-white transition-colors duration-300 line-clamp-1">
              {project.title}
            </h3>
            {project.category && (
              <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 flex-shrink-0">
                {project.category}
              </span>
            )}
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 group-hover:text-slate-200 transition-colors">
            {project.description}
          </p>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-slate-700/30">
          <div className="flex flex-wrap gap-1.5 max-w-[80%]">
            {Array.isArray(project.tech) && project.tech.map((t, i) => (
              <span 
                key={i} 
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-200 border border-cyan-800/40 backdrop-blur-sm shadow-sm"
              >
                {techIcons?.[t] || t}
              </span>
            ))}
          </div>
          {project.link ? (
            <div className="p-2.5 rounded-full bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300 border border-cyan-400/40 shadow-lg group-hover:scale-110">
              <FaExternalLinkAlt className="text-xs" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Ambient glass highlight glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </motion.a>
  );
};

// ===================================
// KOMPONEN UTAMA SECTION PROJECT
// ===================================
function ProjectSection() {
  const [activeTab, setActiveTab] = useState('Projects');
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectCategory, setProjectCategory] = useState('Web/Apps');
  const [previewCertificate, setPreviewCertificate] = useState(null);
  const { hideNavbar, showNavbar } = useNavbar();

  // Load Projects from Supabase / Local Fallback
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoadingProjects(true);
      try {
        const data = await fetchProjects();
        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Error fetching projects in section:', err);
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      }
    };

    loadData();

    // Listen for storage changes from Admin operations
    const handleStorageUpdate = () => {
      fetchProjects().then(data => {
        if (isMounted) setProjects(data);
      });
    };
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // === State dan konstanta untuk Show More/Less Sertifikat ===
  const INITIAL_CERTIFICATES_TO_SHOW = 6;
  const [visibleCertificatesCount, setVisibleCertificatesCount] = useState(INITIAL_CERTIFICATES_TO_SHOW);

  useEffect(() => {
    if (previewCertificate) {
      hideNavbar();
    } else {
      showNavbar();
    }
  }, [previewCertificate, hideNavbar, showNavbar]);

  useEffect(() => {
    return () => {
      showNavbar();
    };
  }, [showNavbar]);

  const tabs = [
    { id: 'Projects', label: 'Projects', icon: <PiCodeBold className="text-[1.7em] mb-1" /> },
    { id: 'Certificate', label: 'Certificates', icon: <LuBadge className="text-[1.5em] mb-1" /> },
    { id: 'Tech Stack', label: 'Tech Stack', icon: <LiaLayerGroupSolid className="text-[1.5em] mb-1" /> },
  ];

  // Dynamic Categories extracted from live projects
  const availableCategories = React.useMemo(() => {
    const defaultCats = ['Web/Apps', 'Graphic Design'];
    const projectCats = projects.map(p => p.category).filter(Boolean);
    const combined = Array.from(new Set([...defaultCats, ...projectCats]));
    return combined;
  }, [projects]);

  const filteredProjects = projects.filter(
    (p) => p.category === projectCategory
  );

  const handleShowMore = () => {
    setVisibleCertificatesCount(userCertificates.length);
  };

  const handleShowLess = () => {
    setVisibleCertificatesCount(INITIAL_CERTIFICATES_TO_SHOW);
  };

  return (
    <section id="project" className="py-20">
      
      <style>{`
        @keyframes line-shadow-anim { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }
        .line-shadow-effect::after { content: attr(data-text); position: absolute; z-index: -1; left: 0.04em; top: 0.04em; background-image: linear-gradient(45deg, transparent 45%, var(--shadow-color) 45%, var(--shadow-color) 55%, transparent 0); background-size: 0.06em 0.06em; -webkit-background-clip: text; background-clip: text; color: transparent; animation: line-shadow-anim 30s linear infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl font-bold font-moderniz">
            <span style={{color: "#00ffdc"}}><LineShadowText shadowColor="#00b3a4">PORTFOLIO</LineShadowText></span>
            {' '}
            <span style={{ color: "#fff" }}><LineShadowText shadowColor="#bbbbbb">SHOWCASE</LineShadowText></span>
        </h2>
      </motion.div>

      <div className="w-full">
        <div className="flex justify-center mb-12">
          <motion.div
            layout
            className="inline-flex w-full max-w-4xl rounded-3xl p-2 shadow-lg border border-slate-800 bg-gradient-to-r from-[#101624] via-[#0a1627] to-[#0a223a] backdrop-blur-md"
            style={{ background: "linear-gradient(90deg, #101624 0%, #0a1627 50%, #0a223a 100%)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 flex-col items-center justify-center px-2 py-7 rounded-2xl font-semibold text-base transition-colors duration-300 outline-none ${activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-cyan-300"}`}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ zIndex: 1, minWidth: 0 }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-0 bg-gradient-to-br from-[#0a223a] to-[#101624] rounded-2xl"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    style={{ zIndex: -1, opacity: 0.96 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-2">
                  {tab.icon}
                  <span className="font-bold">{tab.label}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div
          className="rounded-3xl p-0 md:p-6 shadow-xl border border-slate-800/60 mx-auto max-w-7xl bg-clip-padding"
          style={{ background: "rgba(17, 24, 39, 0.55)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 15, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -15, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-6 md:p-10"
            >
              {activeTab === 'Projects' && (
                <>
                  {/* Category Buttons with smooth indicator */}
                  <div className="flex justify-center flex-wrap gap-3 mb-10">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border ${
                          projectCategory === cat
                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-cyan-400 shadow-[0_0_20px_rgba(0,255,220,0.35)] scale-105'
                            : 'bg-slate-900/60 text-cyan-200/80 border-slate-700 hover:bg-cyan-900/30 hover:text-white'
                        }`}
                        onClick={() => setProjectCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Projects Grid with Skeleton & Smooth Blur Reveal */}
                  {isLoadingProjects ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <ProjectSkeleton key={n} />
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((p, i) => (
                            <ProjectCard key={p.id || i} project={p} index={i} />
                          ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center text-slate-400 py-16"
                          >
                            <FaLayerGroup className="mx-auto text-4xl mb-3 opacity-30" />
                            <p className="text-base">Belum ada proyek dalam kategori ini.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </>
              )}
              {activeTab === 'Certificate' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* === CHANGE: Menggunakan slice untuk menampilkan sertifikat yang terlihat === */}
                    <AnimatePresence>
                      {userCertificates.slice(0, visibleCertificatesCount).map((cert, i) => (
                        <CertificateCard key={i} cert={cert} onClick={setPreviewCertificate} />
                      ))}
                    </AnimatePresence>
                  </div>
                  {/* === CHANGE START: Menambahkan tombol Show More/Less secara kondisional === */}
                  {userCertificates.length > INITIAL_CERTIFICATES_TO_SHOW && (
                    <div className="flex justify-center mt-12">
                      {visibleCertificatesCount < userCertificates.length ? (
                        <motion.button
                          onClick={handleShowMore}
                          className="group bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Show More
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={handleShowLess}
                          className="group bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Show Less
                        </motion.button>
                      )}
                    </div>
                  )}
                  {/* === CHANGE END === */}
                </div>
              )}
              {activeTab === 'Tech Stack' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  {Object.entries(techStack).map(([category, techs]) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold text-cyan-300 capitalize mb-4 border-b-2 border-slate-800 pb-2">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {techs.map((tech, i) => (
                          <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:bg-slate-800/50 hover:border-cyan-500/30">
                            <div className="text-4xl">{tech.icon}</div>
                            <p className="text-sm text-slate-300">{tech.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <AnimatePresence>
        {previewCertificate && (
          <CertificatePreviewModal 
            certificate={previewCertificate}
            onClose={() => setPreviewCertificate(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProjectSection;
