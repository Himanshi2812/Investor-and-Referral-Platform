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
        backgroundColor: currentTheme.sidebar + 'EE',
        borderColor: currentTheme.border
      }}
      className="h-18 px-8 backdrop-blur-md border-b flex items-center justify-between sticky top-0 z-20 transition-colors duration-300"
    >
      {/* Search Input */}
      <div className="relative w-72 hidden md:block">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search contracts, users, payouts..."
          className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Action Badges */}
      <div className="flex items-center space-x-3.5 ml-auto">
        {/* Dynamic Theme Palette Switcher */}
        <ThemeSwitcher />

        {/* Copy Referral Code */}
        <button
          onClick={copyReferral}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 text-xs font-medium text-gray-300 transition shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-gray-400 text-[11px]">Sponsor:</span>
              <span className="font-mono text-indigo-300 font-bold">{user?.referralCode}</span>
            </>
          )}
        </button>

        {/* Wallet Balance Pill */}
        <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-950/40 via-gray-900 to-gray-900 border border-emerald-500/30 rounded-xl px-3 py-1.5 shadow-sm">
          <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
              Available Wallet
            </span>
            <span className="text-xs font-extrabold text-emerald-400 font-mono">
              ${Number(user?.walletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={onOpenDeposit}
            title="Top up wallet balance"
            className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary CTA: New Investment */}
        <button
          onClick={onOpenInvest}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
        >
          <TrendingUp className="w-4 h-4" />
          <span>New Investment</span>
        </button>
      </div>
    </header>
  );
};
