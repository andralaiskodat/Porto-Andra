import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBolt, FaPalette, FaChevronDown, FaCheck, FaTimes, FaLock, FaLayerGroup 
} from 'react-icons/fa';
import { useTheme, THEMES } from '../../../contexts/ThemeContext';

/**
 * ThemeSwitchButton - Interactive Dropdown / Popup Theme Selector
 * Supports currently active themes and upcoming theme slots
 */
export const ThemeSwitchButton = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { theme, setTheme, isNeumorphism, isCyberpunk, themeOptions } = useTheme();

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const handleSelectTheme = (themeId, isAvailable) => {
    if (!isAvailable) return;
    setTheme(themeId);
    setIsOpen(false);
  };

  const currentThemeData = themeOptions?.find(t => t.id === theme) || themeOptions?.[0];

  return (
    <div ref={dropdownRef} className={`relative select-none font-poppins ${className}`}>
      {/* TRIGGER BUTTON */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-label="Open Theme Selection Menu"
        className={`
          flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md cursor-pointer
          transition-all duration-300 text-xs font-semibold
          ${isNeumorphism
            ? 'bg-[#ECF0F3]/90 text-neu-primary shadow-neu-flat border border-white/80 hover:shadow-neu-hover'
            : 'bg-slate-900/90 text-cyan-300 border border-cyan-500/40 shadow-[0_0_16px_rgba(0,255,220,0.25)] hover:shadow-[0_0_24px_rgba(0,255,220,0.45)] hover:border-cyan-400'
          }
        `}
      >
        {isNeumorphism ? (
          <>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#7C6EF2] to-[#F2739E] text-white shadow-sm text-xs flex-shrink-0">
              <FaPalette className="w-3 h-3" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-neu-secondary font-medium -mb-0.5">
                Theme
              </span>
              <span className="text-neu-primary font-bold text-xs">
                Soft UI
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-[0_0_8px_#00ffdc] text-xs flex-shrink-0">
              <FaBolt className="w-3 h-3" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-cyan-300/70 font-medium -mb-0.5">
                Theme
              </span>
              <span className="text-cyan-300 font-bold text-xs">
                Cyberpunk
              </span>
            </div>
          </>
        )}

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="ml-1"
        >
          <FaChevronDown className={`text-[10px] ${isNeumorphism ? 'text-neu-secondary' : 'text-cyan-400'}`} />
        </motion.div>
      </motion.button>

      {/* DROPDOWN / POPUP PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              absolute top-full right-0 mt-3 w-80 sm:w-96 rounded-3xl p-5 shadow-2xl z-50
              ${isNeumorphism
                ? 'bg-[#ECF0F3]/95 backdrop-blur-xl border border-white/90 shadow-neu-flat-lg text-neu-primary'
                : 'bg-[#080214]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(0,255,220,0.2)] text-white'
              }
            `}
          >
            {/* Header Popup */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-300/40 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-sm tracking-tight flex items-center gap-2">
                  <FaPalette className={isNeumorphism ? 'text-neu-accent' : 'text-cyan-400'} />
                  <span>Choose Theme</span>
                </h4>
                <p className={`text-[11px] mt-0.5 ${isNeumorphism ? 'text-neu-secondary' : 'text-slate-400'}`}>
                  Switch portfolio style & aesthetics
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
                  isNeumorphism
                    ? 'bg-[#E8ECF1] shadow-neu-flat-sm text-neu-secondary hover:text-neu-primary'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FaTimes />
              </button>
            </div>

            {/* List of Theme Options */}
            <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
              {themeOptions?.map((item) => {
                const isActive = item.id === theme;
                const isAvailable = item.isAvailable;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectTheme(item.id, isAvailable)}
                    className={`
                      relative rounded-2xl p-3.5 transition-all duration-200 flex items-start justify-between gap-3
                      ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                      ${isNeumorphism
                        ? isActive
                          ? 'bg-[#E8ECF1] shadow-neu-inset border border-neu-accent/30'
                          : 'bg-[#ECF0F3] shadow-neu-flat-sm hover:shadow-neu-hover border border-white/60'
                        : isActive
                          ? 'bg-cyan-950/50 border border-cyan-400 shadow-[0_0_16px_rgba(0,255,220,0.25)]'
                          : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                      }
                    `}
                  >
                    {/* Left: Icon & Theme Details */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Theme Icon Badge */}
                      <div className={`
                        w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5
                        ${item.id === THEMES.CYBERPUNK
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : item.id === THEMES.NEUMORPHISM
                            ? 'bg-gradient-to-tr from-[#7C6EF2] to-[#F2739E] text-white shadow-sm'
                            : 'bg-slate-800/60 text-slate-400 border border-slate-700'
                        }
                      `}>
                        {item.id === THEMES.CYBERPUNK && <FaBolt />}
                        {item.id === THEMES.NEUMORPHISM && <FaPalette />}
                        {!isAvailable && <FaLock className="text-xs text-slate-500" />}
                      </div>

                      {/* Text & description */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs truncate ${isActive ? (isNeumorphism ? 'text-neu-accent' : 'text-cyan-300') : ''}`}>
                            {item.name}
                          </span>
                          {!isAvailable && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] leading-snug mt-0.5 line-clamp-2 ${isNeumorphism ? 'text-neu-secondary' : 'text-slate-400'}`}>
                          {item.tagline}
                        </p>

                        {/* Color Swatch Dots */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {item.colors.map((c, i) => (
                            <span
                              key={i}
                              style={{ backgroundColor: c }}
                              className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Active Checkmark */}
                    {isActive && (
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0
                        ${isNeumorphism
                          ? 'bg-[#7C6EF2] text-white shadow-sm'
                          : 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_#00ffdc]'
                        }
                      `}>
                        <FaCheck className="text-[10px]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="mt-3 pt-3 border-t border-slate-300/30 dark:border-slate-800/80 text-center">
              <span className={`text-[10px] font-medium ${isNeumorphism ? 'text-neu-secondary' : 'text-slate-500'}`}>
                ✦ 3 more custom themes coming soon
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitchButton;
