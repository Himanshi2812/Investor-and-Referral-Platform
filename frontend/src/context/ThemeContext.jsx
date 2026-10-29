import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'olive-cream',
    name: 'Olive Green & Cream (Luxury Earth)',
    type: 'light',
    bg: '#F5F2EB',
    sidebar: '#EDE8DE',
    card: '#FFFFFF',
    border: '#DDD6C8',
    accent: '#3D5538', // Deep Olive
    accentHover: '#2E412A',
    accentGradient: 'from-[#3D5538] to-[#2E412A]',
    accentText: 'text-[#3D5538]',
    textPrimary: '#1E291C',
    textSecondary: '#5A6E55',
    dot: 'bg-[#3D5538]',
    badgeBg: 'bg-[#3D5538]/10 text-[#3D5538] border-[#3D5538]/20'
  },
  {
    id: 'orange-cream',
    name: 'Sunset Orange & Warm Cream (Hermès)',
    type: 'light',
    bg: '#FFF8F0',
    sidebar: '#FFF0DE',
    card: '#FFFFFF',
    border: '#FCE0C2',
    accent: '#EA580C', // Orange
    accentHover: '#C2410C',
    accentGradient: 'from-orange-600 to-amber-600',
    accentText: 'text-orange-600',
    textPrimary: '#2B1705',
    textSecondary: '#8C5627',
    dot: 'bg-orange-500',
    badgeBg: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  },
  {
    id: 'pure-white',
    name: 'Pure White (Clean Corporate)',
    type: 'light',
    bg: '#F8FAFC',
    sidebar: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E2E8F0',
    accent: '#2563EB', // Royal Blue
    accentHover: '#1D4ED8',
    accentGradient: 'from-blue-600 to-indigo-600',
    accentText: 'text-blue-600',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    dot: 'bg-blue-600',
    badgeBg: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  },
  {
    id: 'midnight-dark',
    name: 'Obsidian Midnight (Dark Mode)',
    type: 'dark',
    bg: '#090D16',
    sidebar: '#0E1320',
    card: '#131929',
    border: '#1E2638',
    accent: '#6366F1', // Neon Indigo
    accentHover: '#4F46E5',
    accentGradient: 'from-indigo-600 to-purple-600',
    accentText: 'text-indigo-400',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    dot: 'bg-indigo-500',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  },
  {
    id: 'cyber-emerald',
    name: 'Emerald Onyx (Bloomberg Dark)',
    type: 'dark',
    bg: '#050D0A',
    sidebar: '#091610',
    card: '#0E2018',
    border: '#153326',
    accent: '#10B981', // Emerald
    accentHover: '#059669',
    accentGradient: 'from-emerald-600 to-teal-600',
    accentText: 'text-emerald-400',
    textPrimary: '#FFFFFF',
    textSecondary: '#86A79C',
    dot: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  }
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('nexachain_theme') || 'olive-cream';
  });

  const currentTheme = THEMES.find((t) => t.id === currentThemeId) || THEMES[0];

  useEffect(() => {
    localStorage.setItem('nexachain_theme', currentTheme.id);

    const root = document.documentElement;
    root.style.setProperty('--color-bg', currentTheme.bg);
    root.style.setProperty('--color-sidebar', currentTheme.sidebar);
    root.style.setProperty('--color-card', currentTheme.card);
    root.style.setProperty('--color-border', currentTheme.border);
    root.style.setProperty('--color-accent', currentTheme.accent);
    root.style.setProperty('--color-text', currentTheme.textPrimary);
    root.style.setProperty('--color-text-muted', currentTheme.textSecondary);

    document.body.style.backgroundColor = currentTheme.bg;
    document.body.style.color = currentTheme.textPrimary;

    if (currentTheme.type === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    setCurrentThemeId(themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes: THEMES }}>
      <div
        style={{
          backgroundColor: currentTheme.bg,
          color: currentTheme.textPrimary
        }}
        className="min-h-screen transition-colors duration-300"
      >
        {children}
      </div>
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
