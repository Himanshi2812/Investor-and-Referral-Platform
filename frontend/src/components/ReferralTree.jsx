import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
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
  const { currentTheme } = useTheme();
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
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          avatarBg: 'from-amber-500 to-orange-600',
        };
      case 1:
        return {
          title: 'Level 1 (5% Comm.)',
          badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          avatarBg: 'from-emerald-500 to-teal-600',
        };
      case 2:
        return {
          title: 'Level 2 (3% Comm.)',
          badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
          avatarBg: 'from-blue-500 to-indigo-600',
        };
      case 3:
        return {
          title: 'Level 3 (1% Comm.)',
          badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
          avatarBg: 'from-purple-500 to-pink-600',
        };
      default:
        return {
          title: `Level ${lvl}`,
          badge: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
          avatarBg: 'from-gray-600 to-gray-800',
        };
    }
  };

  const tier = getTierConfig(level);

  return (
    <div className="relative my-2 select-none">
      {/* Node Card */}
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{
          backgroundColor: currentTheme.card,
          borderColor: level === 0 ? currentTheme.accent : currentTheme.border
        }}
        className={`p-4 rounded-2xl border shadow-md transition-all duration-150 ${
          hasChildren ? 'cursor-pointer hover:opacity-90' : ''
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Avatar, Name & Level */}
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${tier.avatarBg} p-0.5 shadow-md flex items-center justify-center shrink-0`}
            >
              <div
                style={{ backgroundColor: currentTheme.card }}
                className="w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-sm"
              >
                <span style={{ color: currentTheme.textPrimary }}>{node.fullName?.charAt(0) || 'U'}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm" style={{ color: currentTheme.textPrimary }}>
                  {node.fullName}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${tier.badge}`}
                >
                  {tier.title}
                </span>
                {node.accountStatus === 'Active' && (
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-mono mt-0.5" style={{ color: currentTheme.textSecondary }}>
                {node.email}
              </p>
            </div>
          </div>

          {/* Right: Code, Capital & Downlines count */}
          <div className="flex items-center space-x-3 pl-14 sm:pl-0">
            {/* Referral Code Badge with Copy */}
            <button
              onClick={copyCode}
              title="Copy referral code"
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono transition"
            >
              <span className="text-[10px] opacity-70">Code:</span>
              <span className="font-bold" style={{ color: currentTheme.accent }}>{node.referralCode}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-500 ml-1" />
              ) : (
                <Share2 className="w-3 h-3 opacity-60 ml-1" />
              )}
            </button>

            {/* Total Invested */}
            {level > 0 && (
              <div
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border
                }}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-xl border"
              >
                <span className="text-[10px] opacity-70" style={{ color: currentTheme.textSecondary }}>Invested:</span>
                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${Number(node.totalInvested || 0).toLocaleString()}
                </span>
              </div>
            )}

            {/* Downlines Toggle */}
            {hasChildren && (
              <div
                style={{
                  backgroundColor: currentTheme.accent + '15',
                  borderColor: currentTheme.accent + '30',
                  color: currentTheme.accent
                }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-xs font-bold"
              >
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
  const { currentTheme } = useTheme();

  if (!treeData) {
    return (
      <div
        style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
        className="border rounded-3xl p-10 text-center text-gray-400"
      >
        <GitBranch className="w-10 h-10 mx-auto text-indigo-400 animate-pulse mb-3" />
        <p className="font-semibold text-sm">Loading multi-tier hierarchy...</p>
      </div>
    );
  }

  const directCount = treeData.children ? treeData.children.length : 0;

  return (
    <div
      style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}
      className="border rounded-3xl p-6 shadow-xl space-y-6 transition-colors"
    >
      {/* Header */}
      <div
        style={{ borderColor: currentTheme.border }}
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b gap-3"
      >
        <div className="flex items-center space-x-3">
          <div
            style={{ backgroundColor: currentTheme.accent + '15', color: currentTheme.accent }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
          >
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold" style={{ color: currentTheme.textPrimary }}>
              Multi-Tier Referral Network Tree
            </h3>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
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
