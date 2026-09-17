import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  CYBERPUNK: 'cyberpunk',
  NEUMORPHISM: 'neumorphism'
};

export const THEME_OPTIONS = [
  {
    id: THEMES.CYBERPUNK,
    name: 'Cyberpunk Neon',
    tagline: 'Futuristic dark mode with neon glow & 3D Spline',
    colors: ['#060010', '#00ffdc', '#4079ff'],
    badge: 'Available',
    icon: 'cyberpunk',
    isAvailable: true,
  },
  {
    id: THEMES.NEUMORPHISM,
    name: 'Neumorphism Soft UI',
    tagline: 'Tactile dual-shadows with pastel accents',
    colors: ['#E8ECF1', '#7C6EF2', '#F2739E'],
    badge: 'Available',
    icon: 'neumorphism',
    isAvailable: true,
  },
  {
    id: 'minimalist',
    name: 'Minimalist Editorial',
    tagline: 'Clean typography, monochrome contrast & sharp grid',
    colors: ['#FFFFFF', '#18181B', '#71717A'],
    badge: 'Coming Soon',
    icon: 'minimalist',
    isAvailable: false,
  },
  {
    id: 'retro',
    name: 'Retro 8-Bit Arcade',
    tagline: 'Playful pixel fonts & nostalgic vibrant palettes',
    colors: ['#212529', '#FFD166', '#06D6A0'],
    badge: 'Coming Soon',
    icon: 'retro',
    isAvailable: false,
  },
  {
    id: 'glassmorphism',
    name: 'Aero Glassmorphism',
    tagline: 'Frosted translucent layers with dynamic mesh glow',
    colors: ['#0F172A', '#38BDF8', '#C084FC'],
    badge: 'Coming Soon',
    icon: 'glassmorphism',
    isAvailable: false,
  },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('portfolioTheme');
      if (savedTheme === THEMES.NEUMORPHISM || savedTheme === THEMES.CYBERPUNK) {
        return savedTheme;
      }
    } catch (e) {
      console.warn('Failed to access localStorage for theme:', e);
    }
    return THEMES.CYBERPUNK; // default theme
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('portfolioTheme', newTheme);
    } catch (e) {
      console.warn('Failed to write theme to localStorage:', e);
    }
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      const nextTheme = prev === THEMES.CYBERPUNK ? THEMES.NEUMORPHISM : THEMES.CYBERPUNK;
      try {
        localStorage.setItem('portfolioTheme', nextTheme);
      } catch (e) {}
      return nextTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (theme === THEMES.NEUMORPHISM) {
      document.body.classList.add('theme-neumorphism');
    } else {
      document.body.classList.remove('theme-neumorphism');
    }
  }, [theme]);

  const isNeumorphism = theme === THEMES.NEUMORPHISM;
  const isCyberpunk = theme === THEMES.CYBERPUNK;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isNeumorphism, isCyberpunk, themeOptions: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
