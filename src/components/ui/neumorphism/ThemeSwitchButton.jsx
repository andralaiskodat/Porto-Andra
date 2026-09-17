import React from 'react';
import { motion } from 'framer-motion';
import { FaBolt, FaPalette, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme, THEMES } from '../../../contexts/ThemeContext';

/**
 * ThemeSwitchButton - Interactive theme switcher between Cyberpunk and Neumorphism
 * @param {'header' | 'floating' | 'inline'} variant
 */
export const ThemeSwitchButton = ({ variant = 'header', className = '' }) => {
  const { theme, toggleTheme, isNeumorphism } = useTheme();

  // Floating button with rich badge & tactile feel
  if (variant === 'floating') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        title={isNeumorphism ? 'Beralih ke Tema Cyberpunk (Dark Neon)' : 'Beralih ke Tema Neumorphism (Soft UI)'}
        aria-label="Switch Portfolio Theme"
        className={`
          flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md cursor-pointer
          transition-all duration-300 font-poppins text-xs font-semibold select-none
          ${isNeumorphism
            ? 'bg-[#ECF0F3]/90 text-neu-primary shadow-neu-flat border border-white/80 hover:shadow-neu-hover'
            : 'bg-slate-900/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_16px_rgba(0,255,220,0.3)] hover:shadow-[0_0_24px_rgba(0,255,220,0.5)]'
          }
          ${className}
        `}
      >
        {isNeumorphism ? (
          <>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#7C6EF2] to-[#F2739E] text-white shadow-sm text-xs">
              <FaPalette className="w-3 h-3" />
            </span>
            <span className="hidden sm:inline text-neu-primary font-medium">Soft UI</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#E8ECF1] shadow-neu-inset text-neu-accent">
              Neumorphic
            </span>
          </>
        ) : (
          <>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-[0_0_8px_#00ffdc] text-xs">
              <FaBolt className="w-3 h-3" />
            </span>
            <span className="hidden sm:inline text-cyan-300 font-medium">Neon</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
              Cyberpunk
            </span>
          </>
        )}
      </motion.button>
    );
  }

  // Header button (compact & refined)
  if (variant === 'header') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        title={isNeumorphism ? 'Ganti ke Tema Cyberpunk' : 'Ganti ke Tema Neumorphism'}
        aria-label="Switch Theme"
        className={`
          relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer
          transition-all duration-300 select-none
          ${isNeumorphism
            ? 'bg-[#E8ECF1] text-neu-primary shadow-neu-flat-sm hover:shadow-neu-hover border border-white/60'
            : 'bg-slate-900/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,255,220,0.25)] hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(0,255,220,0.4)]'
          }
          ${className}
        `}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse ${isNeumorphism ? 'bg-[#7C6EF2]' : 'bg-[#00ffdc]'}`} />
        <span className="flex items-center gap-1.5 font-poppins">
          {isNeumorphism ? (
            <>
              <FaPalette className="text-[#7C6EF2] text-xs" />
              <span>Tema: Soft Neu</span>
            </>
          ) : (
            <>
              <FaBolt className="text-[#00ffdc] text-xs" />
              <span>Tema: Cyberpunk</span>
            </>
          )}
        </span>
      </motion.button>
    );
  }

  // Inline / mobile full variant
  return (
    <button
      onClick={toggleTheme}
      className={`
        w-full flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer
        transition-all duration-200 font-poppins text-sm font-medium
        ${isNeumorphism
          ? 'bg-[#E8ECF1] text-neu-primary shadow-neu-flat'
          : 'bg-slate-800/80 text-cyan-300 border border-cyan-500/30'
        }
        ${className}
      `}
    >
      <span className="flex items-center gap-2">
        {isNeumorphism ? <FaPalette className="text-[#7C6EF2]" /> : <FaBolt className="text-[#00ffdc]" />}
        <span>Ganti Tema ({isNeumorphism ? 'Soft UI' : 'Cyberpunk'})</span>
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${isNeumorphism ? 'bg-[#ECF0F3] shadow-neu-inset text-[#7C6EF2]' : 'bg-cyan-950 text-cyan-300 border border-cyan-400/40'}`}>
        Klik untuk Ganti
      </span>
    </button>
  );
};

export default ThemeSwitchButton;
