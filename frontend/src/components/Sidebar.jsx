import React from 'react';
import {
  LayoutDashboard,
  Landmark,
  TrendingUp,
  GitBranch,
  Clock,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { currentTheme } = useTheme();

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'investments', label: 'Investment Portfolio', icon: Landmark },
    { id: 'roi', label: 'Daily ROI Payouts', icon: TrendingUp },
    { id: 'network', label: 'Referral Network', icon: GitBranch },
    { id: 'cron', label: 'Scheduler Console', icon: Clock }
  ];

  return (
    <aside
      style={{
        backgroundColor: currentTheme.sidebar,
        borderColor: currentTheme.border
      }}
      className="w-64 border-r flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none transition-colors duration-300"
    >
      {/* Brand Header */}
      <div>
        <div
          className="p-6 pb-5 flex items-center space-x-3 border-b"
          style={{ borderColor: currentTheme.border }}
        >
          <div
            className="w-10 h-10 rounded-2xl p-0.5 shadow-md flex items-center justify-center"
            style={{ backgroundColor: currentTheme.accent }}
          >
            <div
              className="w-full h-full rounded-[14px] flex items-center justify-center"
              style={{ backgroundColor: currentTheme.card }}
            >
              <Sparkles className="w-5 h-5" style={{ color: currentTheme.accent }} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span
                className="font-extrabold text-base tracking-tight font-sans"
                style={{ color: currentTheme.textPrimary }}
              >
                NEXACHAIN
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
                style={{ backgroundColor: currentTheme.accent + '20', color: currentTheme.accent }}
              >
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium" style={{ color: currentTheme.textSecondary }}>
              Fintech Platform
            </p>
          </div>
        </div>

        {/* Live Network Pill */}
        <div className="px-5 py-3">
          <div
            className="border rounded-xl px-3 py-2 flex items-center justify-between"
            style={{
              backgroundColor: currentTheme.card,
              borderColor: currentTheme.border
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold" style={{ color: currentTheme.textPrimary }}>
                Atlas Cloud Live
              </span>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          <div
            className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider"
            style={{ color: currentTheme.textSecondary }}
          >
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  backgroundColor: isActive ? currentTheme.accent : 'transparent',
                  color: isActive ? '#FFFFFF' : currentTheme.textSecondary
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group shadow-sm`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Card & Logout */}
      <div className="p-4 border-t" style={{ borderColor: currentTheme.border }}>
        <div
          className="border rounded-2xl p-3 flex items-center justify-between"
          style={{
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border
          }}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md"
              style={{ backgroundColor: currentTheme.accent }}
            >
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate" style={{ color: currentTheme.textPrimary }}>
                {user?.fullName}
              </p>
              <p className="text-[10px] truncate" style={{ color: currentTheme.textSecondary }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
