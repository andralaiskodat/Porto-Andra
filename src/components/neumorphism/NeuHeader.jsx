import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaBars, FaTimes, FaEnvelope } from 'react-icons/fa';
import bangzenLogo from '../../assets/images/LogoAndra.png';
import { useAdmin } from '../../contexts/AdminContext';
import { useNavbar } from '../../contexts/NavbarContext';
import NeuButton from '../ui/neumorphism/NeuButton';
import AdminLogin from '../admin/AdminLogin';
import AdminProjects from '../admin/AdminProjects';
import AdminMessages from '../admin/AdminMessages';
import AdminComments from '../admin/AdminComments';

export const NeuHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminView, setAdminView] = useState('projects');

  const { isNavbarVisible, hideNavbar, showNavbar } = useNavbar();
  const { isAuthenticated, logout } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setShowAdminDashboard(true);
      hideNavbar();
    } else {
      setShowAdminLogin(true);
      hideNavbar();
    }
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
    hideNavbar();
  };

  const handleCloseAdminDashboard = () => {
    setShowAdminDashboard(false);
    showNavbar();
  };

  const handleCloseAdminLogin = () => {
    setShowAdminLogin(false);
    showNavbar();
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-4 pb-2 pointer-events-none"
          >
            <nav
              className={`
                max-w-6xl mx-auto flex items-center justify-between px-5 py-3 rounded-full pointer-events-auto
                transition-all duration-300 backdrop-blur-md border border-white/70
                ${isScrolled
                  ? 'bg-[#E8ECF1]/90 shadow-neu-flat-lg'
                  : 'bg-[#ECF0F3]/80 shadow-neu-flat'
                }
              `}
            >
              {/* Brand Logo & Name */}
              <a href="#home" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-neu-flat-sm flex items-center justify-center overflow-hidden border border-white/80 p-0.5 group-hover:shadow-neu-hover transition-all duration-200">
                  <img src={bangzenLogo} alt="Andra Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-poppins font-bold text-sm sm:text-base text-neu-primary tracking-tight group-hover:text-neu-accent transition-colors">
                    ANDRA
                  </span>
                  <span className="text-[10px] text-neu-secondary font-medium tracking-wider uppercase -mt-0.5 hidden sm:block">
                    Portfolio
                  </span>
                </div>
              </a>

              {/* Desktop Nav Items */}
              <ul className="hidden md:flex items-center gap-1 lg:gap-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-neu-primary hover:text-neu-accent hover:shadow-neu-inset transition-all duration-200 font-poppins select-none"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Right Action Controls */}
              <div className="hidden sm:flex items-center gap-2.5">
                {/* Admin Button */}
                <button
                  onClick={handleAdminAccess}
                  title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                  className="w-8 h-8 rounded-full bg-[#ECF0F3] shadow-neu-flat-sm flex items-center justify-center text-neu-secondary hover:text-neu-accent hover:shadow-neu-hover transition-all duration-200"
                >
                  <FaShieldAlt className={`text-xs ${isAuthenticated ? 'text-emerald-500' : ''}`} />
                </button>

                {/* Contact CTA */}
                <NeuButton
                  as="a"
                  href="#contact"
                  variant="gradient"
                  size="sm"
                  className="rounded-full shadow-sm text-xs font-semibold px-4"
                >
                  <FaEnvelope className="text-xs" />
                  <span>Contact</span>
                </NeuButton>
              </div>

              {/* Mobile Right Controls: Hamburger */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle Menu"
                  className="w-9 h-9 rounded-full bg-[#ECF0F3] shadow-neu-flat-sm flex items-center justify-center text-neu-primary hover:shadow-neu-hover active:shadow-neu-pressed transition-all"
                >
                  {isMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
                </button>
              </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-md mx-auto mt-3 p-5 rounded-3xl bg-[#ECF0F3]/95 backdrop-blur-lg shadow-neu-flat-lg border border-white/80 pointer-events-auto md:hidden"
                >
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-neu-primary hover:text-neu-accent hover:bg-[#E8ECF1] hover:shadow-neu-inset transition-all duration-150 font-poppins"
                      >
                        {link.name}
                      </a>
                    ))}
                    <div className="pt-3 border-t border-slate-300/60 flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleAdminAccess();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#E8ECF1] shadow-neu-flat text-xs font-semibold text-neu-primary"
                      >
                        <FaShieldAlt className={isAuthenticated ? 'text-emerald-500' : ''} />
                        <span>Admin Area</span>
                      </button>
                      <NeuButton
                        as="a"
                        href="#contact"
                        variant="gradient"
                        size="sm"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 rounded-xl text-xs py-2"
                      >
                        Contact Me
                      </NeuButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Admin Modals */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={handleCloseAdminLogin}
        onSuccess={handleLoginSuccess}
      />

      {adminView === 'projects' && (
        <AdminProjects
          isOpen={showAdminDashboard}
          onClose={handleCloseAdminDashboard}
          onNavigate={(view) => setAdminView(view)}
        />
      )}

      {adminView === 'messages' && (
        <AdminMessages
          isOpen={showAdminDashboard}
          onClose={handleCloseAdminDashboard}
          onNavigate={(view) => setAdminView(view)}
        />
      )}

      {adminView === 'comments' && (
        <AdminComments
          isOpen={showAdminDashboard}
          onClose={handleCloseAdminDashboard}
          onNavigate={(view) => setAdminView(view)}
        />
      )}
    </>
  );
};

export default NeuHeader;
