import React, { useState } from 'react';
import { GitBranch, ChevronRight, ChevronDown, User, ShieldCheck, DollarSign, Calendar, Sparkles } from 'lucide-react';

const TreeNode = ({ node, level = 0, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = node.children && node.children.length > 0;

  const getLevelBadgeColor = (lvl) => {
    switch (lvl) {
      case 0:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 1:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 2:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 3:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 my-2 rounded-xl border transition-all duration-150 ${
          level === 0
            ? 'bg-indigo-950/30 border-indigo-500/40 shadow-md shadow-indigo-950/50'
            : 'bg-gray-850/60 bg-gray-900/60 border-gray-800 hover:border-gray-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          {/* Toggle Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
              title={isOpen ? 'Collapse branch' : 'Expand branch'}
            >
              {isOpen ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-gray-700"></span>
            </div>
          )}

          {/* User Avatar & Level Tag */}
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${level === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-gray-100">{node.fullName}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadgeColor(level)}`}>
                  {level === 0 ? 'Root Sponsor' : `Level ${level}`}
                </span>
                {node.accountStatus === 'Active' && (
                  <span className="hidden sm:inline-flex items-center text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Active
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono">{node.email}</span>
            </div>
          </div>
        </div>

        {/* Financial & Hierarchy Info */}
        <div className="flex items-center space-x-4 mt-2 sm:mt-0 pl-9 sm:pl-0">
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-gray-400">Code:</span>
            <span className="font-mono font-semibold text-indigo-300 bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700/60">
              {node.referralCode}
            </span>
          </div>

          {level > 0 && (
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-gray-400">Invested:</span>
              <span className="font-mono font-bold text-emerald-400">
                ${Number(node.totalInvested || 0).toLocaleString()}
              </span>
            </div>
          )}

          {hasChildren && (
            <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
              {node.children.length} {node.children.length === 1 ? 'downline' : 'downlines'}
            </span>
          )}
        </div>
      </div>

      {/* Recursive Children Container */}
      {hasChildren && isOpen && (
        <div className="pl-6 sm:pl-8 ml-3 sm:ml-4 border-l-2 border-indigo-500/20 space-y-1 my-1">
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode._id}
              node={childNode}
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
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
        <GitBranch className="w-10 h-10 mx-auto text-gray-600 mb-2 animate-pulse" />
        <p>Loading referral network tree...</p>
      </div>
    );
  }

  const directCount = treeData.children ? treeData.children.length : 0;

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Multi-Tier Referral Network Tree</h3>
            <p className="text-xs text-gray-400">
              Interactive upline and downline hierarchy with recursive commission distribution
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            L1 (5%) • L2 (3%) • L3 (1%)
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
            >
              Refresh Tree
            </button>
          )}
        </div>
      </div>

      {directCount === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-800">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-semibold text-gray-200">No Referrals Registered Yet</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Share your referral code <span className="font-mono text-indigo-400 font-bold">{treeData.referralCode}</span> with partners to earn up to 3 levels of recursive commission!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <TreeNode node={treeData} level={0} defaultOpen={true} />
        </div>
      )}
    </div>
  );
};
