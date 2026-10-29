import React from 'react';
import { Landmark, TrendingUp, Users, Wallet, ArrowUpRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DashboardCards = ({ cards, onInvestClick, onDepositClick }) => {
  const { currentTheme } = useTheme();
  const metricList = [
    {
      title: 'Total Active Investments',
      value: `$${Number(cards?.totalInvestments || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      badge: `${cards?.activeInvestmentsCount || 0} Active Plans`,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      icon: Landmark,
      glow: 'from-blue-600/20 to-indigo-600/10',
      iconBg: 'bg-indigo-600',
      action: onInvestClick,
      actionLabel: '+ Invest More'
    },
    {
      title: 'Daily ROI Yield',
      value: `$${Number(cards?.dailyRoiEstimate || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / day`,
      badge: `Total Paid: $${Number(cards?.totalRoiEarned || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: TrendingUp,
      glow: 'from-emerald-600/20 to-teal-600/10',
      iconBg: 'bg-emerald-600'
    },
    {
      title: 'Total Level Referral Income',
      value: `$${Number(cards?.totalLevelIncomeEarned || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      badge: `${cards?.directReferralsCount || 0} Direct Sponsors`,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: Users,
      glow: 'from-purple-600/20 to-pink-600/10',
      iconBg: 'bg-purple-600'
    },
    {
      title: 'Liquid Wallet Balance',
      value: `$${Number(cards?.walletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      badge: 'Available Now',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: Wallet,
      glow: 'from-amber-600/20 to-orange-600/10',
      iconBg: 'bg-amber-600',
      action: onDepositClick,
      actionLabel: '+ Quick Top Up'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metricList.map((metric, idx) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: currentTheme.card,
              borderColor: currentTheme.border
            }}
            className="relative overflow-hidden border rounded-2xl p-5 shadow-lg transition-all duration-200 group hover:scale-[1.01]"
          >
            {/* Ambient Background Gradient Flare */}
            <div
              className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-tr ${metric.glow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-300 opacity-40`}
            />

            {/* Header: Title & Icon */}
            <div className="flex items-center justify-between mb-3">
              <span
                style={{ color: currentTheme.textSecondary }}
                className="text-[11px] font-bold tracking-wider uppercase"
              >
                {metric.title}
              </span>
              <div
                style={{ backgroundColor: currentTheme.accent }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition"
              >
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            {/* Metric Value */}
            <div
              style={{ color: currentTheme.textPrimary }}
              className="text-2xl font-black font-mono tracking-tight my-1"
            >
              {metric.value}
            </div>

            {/* Footer: Badge & Action */}
            <div
              style={{ borderColor: currentTheme.border }}
              className="flex items-center justify-between pt-2 border-t mt-3"
            >
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${metric.badgeColor}`}
              >
                {metric.badge}
              </span>
              {metric.action && (
                <button
                  onClick={metric.action}
                  style={{ color: currentTheme.accent }}
                  className="inline-flex items-center text-[11px] font-bold hover:opacity-80 transition"
                >
                  <span>{metric.actionLabel}</span>
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
