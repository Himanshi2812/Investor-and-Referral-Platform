import React from 'react';
import { Landmark, TrendingUp, Users, Wallet, ArrowUpRight } from 'lucide-react';

export const DashboardCards = ({ cards, onInvestClick, onDepositClick }) => {
  const metricList = [
    {
      title: 'Total Investments',
      value: `$${Number(cards?.totalInvestments || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${cards?.activeInvestmentsCount || 0} Active / ${cards?.totalInvestmentsCount || 0} Total Plans`,
      icon: Landmark,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
      action: onInvestClick,
      actionLabel: 'Invest More'
    },
    {
      title: 'Daily ROI',
      value: `$${Number(cards?.dailyRoiEstimate || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / day`,
      subtitle: `Total Paid: $${Number(cards?.totalRoiEarned || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400'
    },
    {
      title: 'Total Level Income',
      value: `$${Number(cards?.totalLevelIncomeEarned || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${cards?.directReferralsCount || 0} Direct Network Referrals`,
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400'
    },
    {
      title: 'Wallet Balance',
      value: `$${Number(cards?.walletBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Liquid available capital',
      icon: Wallet,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      action: onDepositClick,
      actionLabel: 'Top Up'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricList.map((metric, idx) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl hover:border-gray-700 transition duration-200"
          >
            {/* Ambient background glow */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-tr ${metric.color} opacity-10 blur-xl pointer-events-none`} />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">
                {metric.title}
              </span>
              <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${metric.color} shadow-lg shadow-black/40`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight text-white">
                {metric.value}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-400">{metric.subtitle}</span>
                {metric.action && (
                  <button
                    onClick={metric.action}
                    className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    {metric.actionLabel}
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
