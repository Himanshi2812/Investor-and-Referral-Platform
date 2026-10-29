import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Check, ChevronDown } from 'lucide-react';

export const ThemeSwitcher = () => {
  const { currentTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLight = currentTheme.type === 'light';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition text-xs font-bold shadow-md hover:scale-105"
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border,
          color: currentTheme.textPrimary
        }}
      >
        <Palette className="w-4 h-4" style={{ color: currentTheme.accent }} />
        <span className="hidden sm:inline opacity-70 font-medium">Palette:</span>
        <span className="flex items-center space-x-1.5">
          <span className={`w-3 h-3 rounded-full border border-black/10 shadow-sm ${currentTheme.dot}`}></span>
          <span className="font-extrabold">{currentTheme.name.split(' (')[0]}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-2xl border p-2.5 shadow-2xl z-50 animate-fade-in backdrop-blur-2xl"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#111726',
            borderColor: isLight ? '#DDD6C8' : '#2A364F',
            color: isLight ? '#1A2315' : '#FFFFFF'
          }}
        >
          <div
            className="px-3 py-2 text-[11px] font-black uppercase tracking-wider border-b mb-2 flex items-center justify-between"
            style={{
              borderColor: isLight ? '#E5E0D8' : '#1E293D',
              color: isLight ? '#5A6E55' : '#94A3B8'
            }}
          >
            <span>Select Color Palette</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
              5 Themes
            </span>
          </div>

          <div className="space-y-1.5">
            {themes.map((t) => {
              const isSelected = t.id === currentTheme.id;
              const isOptionLight = t.type === 'light';

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    changeTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition duration-150 border ${
                    isSelected
                      ? 'shadow-md font-black ring-2'
                      : 'hover:opacity-90 font-medium opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: t.card,
                    borderColor: isSelected ? t.accent : t.border,
                    color: t.textPrimary,
                    ringColor: isSelected ? t.accent : 'transparent'
                  }}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Visual Color Preview Capsule */}
                    <div
                      className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: t.bg, borderColor: t.border }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-inner"
                        style={{ backgroundColor: t.accent }}
                      ></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate">
                        {t.name.split(' (')[0]}
                      </div>
                      <div
                        className="text-[10px] font-semibold opacity-75 truncate"
                        style={{ color: t.accent }}
                      >
                        {t.name.includes('(') ? t.name.split('(')[1].replace(')', '') : ''}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ml-2 shadow"
                      style={{ backgroundColor: t.accent }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
