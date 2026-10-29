import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, PlusCircle, TrendingUp, LogOut, Share2, Check, UserCheck } from 'lucide-react';

export const Navbar = ({ onOpenDeposit, onOpenInvest }) => {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyReferralLink = () => {
    if (!user?.referralCode) return;
    const link = `${window.location.origin}/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent">
              NEXACHAIN AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              MERN Platform
            </span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Wallet Balance Pill */}
          <div className="flex items-center space-x-2 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 shadow-inner">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 font-medium leading-none">Wallet Balance</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                ${Number(user?.walletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={onOpenDeposit}
              title="Deposit funds"
              className="ml-1 p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {/* New Investment Button */}
          <button
            onClick={onOpenInvest}
            className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition transform active:scale-95"
          >
            <TrendingUp className="w-4 h-4" />
            <span>New Investment</span>
          </button>

          {/* Share Referral Link */}
          <button
            onClick={copyReferralLink}
            title="Copy Sponsor Referral Link"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-medium text-gray-200 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Ref:</span>
                <span className="font-mono text-indigo-300 font-semibold">{user?.referralCode}</span>
              </>
            )}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-gray-200">{user?.fullName}</span>
              <span className="text-[10px] text-gray-400">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition border border-gray-700/50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
