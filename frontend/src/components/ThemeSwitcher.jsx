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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition text-xs font-semibold shadow-sm"
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border
        }}
      >
        <Palette className="w-3.5 h-3.5 text-gray-400" />
        <span className="hidden sm:inline text-gray-300">Theme:</span>
        <span className="flex items-center space-x-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${currentTheme.dot}`}></span>
          <span className="text-white">{currentTheme.name.split(' (')[0]}</span>
        </span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-2xl border p-2 shadow-2xl z-50 animate-fade-in backdrop-blur-2xl"
          style={{
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border
          }}
        >
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-800/80 mb-1">
            Choose Executive Theme Palette
          </div>

          <div className="space-y-1">
            {themes.map((t) => {
              const isSelected = t.id === currentTheme.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    changeTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                    isSelected ? 'bg-gray-800/80 border border-indigo-500/40 text-white font-bold' : 'hover:bg-gray-800/40 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Color Swatch Dot */}
                    <div
                      className="w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 shadow-inner"
                      style={{ backgroundColor: t.bg, borderColor: t.border }}
                    >
                      <span className={`w-2 h-2 rounded-full ${t.dot}`}></span>
                    </div>

                    <div>
                      <div className="font-semibold text-xs text-white">{t.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">Accent: {t.accent}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
