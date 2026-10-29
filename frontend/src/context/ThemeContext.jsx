import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'slate',
    name: 'Slate Minimal (Stripe/Linear)',
    bg: '#090D16',
    sidebar: '#0E1320',
    card: '#131929',
    border: '#1E2638',
    accent: '#4F46E5', // Indigo
    accentGradient: 'from-indigo-600 to-indigo-700',
    accentText: 'text-indigo-400',
    dot: 'bg-indigo-500'
  },
  {
    id: 'navy',
    name: 'Executive Navy (Goldman Sachs)',
    bg: '#050B17',
    sidebar: '#0A1224',
    card: '#0F1B35',
    border: '#1B2C52',
    accent: '#2563EB', // Blue
    accentGradient: 'from-blue-600 to-cyan-600',
    accentText: 'text-blue-400',
    dot: 'bg-blue-500'
  },
  {
    id: 'emerald',
    name: 'Emerald Wealth (Private Banking)',
    bg: '#050D0A',
    sidebar: '#0A1712',
    card: '#0E221A',
    border: '#163629',
    accent: '#10B981', // Emerald
    accentGradient: 'from-emerald-600 to-teal-700',
    accentText: 'text-emerald-400',
    dot: 'bg-emerald-500'
  },
  {
    id: 'monochrome',
    name: 'Titanium Obsidian (Apple/Tesla)',
    bg: '#0A0A0B',
    sidebar: '#121214',
    card: '#18181B',
    border: '#27272A',
    accent: '#71717A', // Neutral Zinc
    accentGradient: 'from-zinc-700 to-zinc-900',
    accentText: 'text-zinc-300',
    dot: 'bg-zinc-400'
  }
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('nexachain_theme') || 'slate';
  });

  const currentTheme = THEMES.find((t) => t.id === currentThemeId) || THEMES[0];

  useEffect(() => {
    localStorage.setItem('nexachain_theme', currentTheme.id);
    
    // Set dynamic CSS properties on document root
    const root = document.documentElement;
    root.style.setProperty('--color-bg', currentTheme.bg);
    root.style.setProperty('--color-sidebar', currentTheme.sidebar);
    root.style.setProperty('--color-card', currentTheme.card);
    root.style.setProperty('--color-border', currentTheme.border);
    root.style.setProperty('--color-accent', currentTheme.accent);
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    setCurrentThemeId(themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes: THEMES }}>
      <div
        style={{
          backgroundColor: currentTheme.bg,
          color: '#F8FAFC'
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
