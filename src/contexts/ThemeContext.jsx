import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  CYBERPUNK: 'cyberpunk',
  NEUMORPHISM: 'neumorphism'
};

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
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isNeumorphism, isCyberpunk }}>
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
