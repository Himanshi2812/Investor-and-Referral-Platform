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
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition text-xs font-bold shadow-sm"
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border,
          color: currentTheme.textPrimary
        }}
      >
        <Palette className="w-3.5 h-3.5 opacity-70" style={{ color: currentTheme.accent }} />
        <span className="hidden sm:inline opacity-75 font-medium">Theme:</span>
        <span className="flex items-center space-x-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${currentTheme.dot}`}></span>
          <span>{currentTheme.name.split(' (')[0]}</span>
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-2xl border p-2 shadow-2xl z-50 animate-fade-in backdrop-blur-2xl"
          style={{
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
        >
          <div
            className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider border-b mb-1 opacity-70"
            style={{ borderColor: currentTheme.border }}
          >
            Select Color Palette
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
                    isSelected
                      ? 'border font-extrabold shadow-sm'
                      : 'hover:opacity-80 font-medium'
                  }`}
                  style={{
                    backgroundColor: isSelected ? t.bg : 'transparent',
                    borderColor: isSelected ? t.accent : 'transparent',
                    color: t.textPrimary
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {/* Swatch */}
                    <div
                      className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: t.bg, borderColor: t.border }}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`}></span>
                    </div>

                    <div>
                      <div className="font-bold text-xs">{t.name.split(' (')[0]}</div>
                      <div className="text-[10px] opacity-70">
                        {t.name.includes('(') ? t.name.split('(')[1].replace(')', '') : ''}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
