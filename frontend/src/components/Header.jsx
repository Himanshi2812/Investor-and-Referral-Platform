import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Plus,
  TrendingUp,
  Share2,
  Check,
  Search,
  Bell,
  Sparkles
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ onOpenDeposit, onOpenInvest }) => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyReferral = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/register?ref=${user.referralCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      style={{
        backgroundColor: currentTheme.sidebar,
        borderColor: currentTheme.border
      }}
      className="h-18 px-8 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-20 transition-colors duration-300"
    >
      {/* Search Input */}
      <div className="relative w-72 hidden md:block">
        <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-3" style={{ color: currentTheme.textSecondary }} />
        <input
          type="text"
          placeholder="Search contracts, users, payouts..."
          style={{
            backgroundColor: currentTheme.bg,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
          className="w-full border rounded-xl pl-10 pr-4 py-2 text-xs placeholder-opacity-60 focus:outline-none transition"
        />
      </div>

      {/* Action Badges */}
      <div className="flex items-center space-x-3.5 ml-auto">
        {/* Dynamic Theme Palette Switcher */}
        <ThemeSwitcher />

        {/* Copy Referral Code */}
        <button
          onClick={copyReferral}
          style={{
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border hover:opacity-80 text-xs font-semibold transition shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
              <span className="text-[11px] opacity-70">Sponsor:</span>
              <span className="font-mono font-bold" style={{ color: currentTheme.accent }}>
                {user?.referralCode}
              </span>
            </>
          )}
        </button>

        {/* Wallet Balance Pill */}
        <div
          style={{
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border
          }}
          className="flex items-center space-x-2 border rounded-xl px-3 py-1.5 shadow-sm"
        >
          <div
            className="p-1 rounded-lg"
            style={{ backgroundColor: currentTheme.accent + '20', color: currentTheme.accent }}
          >
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-70" style={{ color: currentTheme.textSecondary }}>
              Wallet
            </span>
            <span className="text-xs font-black font-mono" style={{ color: currentTheme.accent }}>
              ${Number(user?.walletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={onOpenDeposit}
            title="Top up wallet balance"
            style={{ backgroundColor: currentTheme.accent + '15', color: currentTheme.accent }}
            className="p-1 rounded-lg hover:opacity-80 transition ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary CTA: New Investment */}
        <button
          onClick={onOpenInvest}
          style={{ backgroundColor: currentTheme.accent }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:opacity-90 text-white text-xs font-bold shadow-lg transition transform active:scale-95"
        >
          <TrendingUp className="w-4 h-4" />
          <span>New Investment</span>
        </button>
      </div>
    </header>
  );
};
