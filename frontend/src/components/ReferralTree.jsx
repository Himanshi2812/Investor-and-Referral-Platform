import React, { useState } from 'react';
import {
  GitBranch,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Share2,
  Check,
  TrendingUp,
  User,
  Sparkles
} from 'lucide-react';

const TreeCard = ({ node, level = 0, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const copyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(node.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierConfig = (lvl) => {
    switch (lvl) {
      case 0:
        return {
          title: 'Root Sponsor',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          avatarBg: 'from-amber-500 to-orange-600',
          border: 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-gray-900 to-gray-900'
        };
      case 1:
        return {
          title: 'Level 1 (5% Comm.)',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          avatarBg: 'from-emerald-500 to-teal-600',
          border: 'border-emerald-500/30 bg-gray-900/90'
        };
      case 2:
        return {
          title: 'Level 2 (3% Comm.)',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          avatarBg: 'from-blue-500 to-indigo-600',
          border: 'border-blue-500/30 bg-gray-900/90'
        };
      case 3:
        return {
          title: 'Level 3 (1% Comm.)',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          avatarBg: 'from-purple-500 to-pink-600',
          border: 'border-purple-500/30 bg-gray-900/90'
        };
      default:
        return {
          title: `Level ${lvl}`,
          badge: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
          avatarBg: 'from-gray-600 to-gray-800',
          border: 'border-gray-800 bg-gray-900'
        };
    }
  };

  const tier = getTierConfig(level);

  return (
    <div className="relative my-2 select-none">
      {/* Node Card */}
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`p-4 rounded-2xl border ${tier.border} shadow-lg transition-all duration-150 ${
          hasChildren ? 'cursor-pointer hover:border-indigo-500/50' : ''
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Avatar, Name & Level */}
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${tier.avatarBg} p-0.5 shadow-md flex items-center justify-center shrink-0`}
            >
              <div className="w-full h-full bg-gray-950/80 rounded-[14px] flex items-center justify-center text-white font-extrabold text-sm">
                {node.fullName?.charAt(0) || 'U'}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">{node.fullName}</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${tier.badge}`}
                >
                  {tier.title}
                </span>
                {node.accountStatus === 'Active' && (
                  <span className="flex items-center text-[10px] font-medium text-emerald-400">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{node.email}</p>
            </div>
          </div>

          {/* Right: Code, Capital & Downlines count */}
          <div className="flex items-center space-x-3 pl-14 sm:pl-0">
            {/* Referral Code Badge with Copy */}
            <button
              onClick={copyCode}
              title="Copy referral code"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700/80 text-xs font-mono transition"
            >
              <span className="text-[10px] text-gray-400">Code:</span>
              <span className="font-bold text-indigo-300">{node.referralCode}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400 ml-1" />
              ) : (
                <Share2 className="w-3 h-3 text-gray-400 ml-1" />
              )}
            </button>

            {/* Total Invested */}
            {level > 0 && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-gray-800/80 border border-gray-700/60">
                <span className="text-[10px] text-gray-400">Invested:</span>
                <span className="text-xs font-bold font-mono text-emerald-400">
                  ${Number(node.totalInvested || 0).toLocaleString()}
                </span>
              </div>
            )}

            {/* Downlines Toggle */}
            {hasChildren && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-indigo-600/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                <span>{node.children.length} {node.children.length === 1 ? 'downline' : 'downlines'}</span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recursive Children with Connecting Visual Lines */}
      {hasChildren && isOpen && (
        <div className="pl-6 sm:pl-10 ml-4 border-l-2 border-indigo-500/25 space-y-2 mt-2 pt-1 transition-all">
          {node.children.map((child) => (
            <TreeCard
              key={child._id}
              node={child}
              level={level + 1}
              defaultOpen={level < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ReferralTree = ({ treeData, onRefresh }) => {
  if (!treeData) {
    return (
      <div className="bg-[#111726]/90 border border-gray-800 rounded-3xl p-10 text-center text-gray-400">
        <GitBranch className="w-10 h-10 mx-auto text-indigo-400 animate-pulse mb-3" />
        <p className="font-semibold text-sm">Loading multi-tier hierarchy...</p>
      </div>
    );
  }

  const directCount = treeData.children ? treeData.children.length : 0;

  return (
    <div className="bg-[#111726]/90 border border-gray-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-800/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Multi-Tier Referral Network Tree</h3>
            <p className="text-xs text-gray-400">
              Interactive upline and downline organization chart with automatic recursive commission distribution
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-2 text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              L1: 5%
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              L2: 3%
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              L3: 1%
            </span>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 border border-gray-700 transition"
            >
              Refresh Tree
            </button>
          )}
        </div>
      </div>

      {/* Tree Visualization */}
      {directCount === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-gray-800">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3 opacity-80" />
          <h4 className="text-base font-bold text-gray-200">No Referrals Registered Yet</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Share your sponsor link with your code <span className="font-mono text-indigo-400 font-bold">{treeData.referralCode}</span> to start building your multi-level earnings network!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pt-2">
          <TreeCard node={treeData} level={0} defaultOpen={true} />
        </div>
      )}
    </div>
  );
};
