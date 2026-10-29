import React from 'react';
import { Landmark, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const InvestmentTable = ({ investments = [], loading = false, onInvestClick }) => {
  const { currentTheme } = useTheme();
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <Clock className="w-3 h-3 mr-1" /> Active
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
      default:
        return <span className="text-xs font-bold" style={{ color: currentTheme.textSecondary }}>{status}</span>;
    }
  };

  return (
    <div
      style={{
        backgroundColor: currentTheme.card,
        borderColor: currentTheme.border
      }}
      className="border rounded-2xl shadow-lg overflow-hidden transition-colors"
    >
      <div
        style={{ borderColor: currentTheme.border }}
        className="p-5 border-b flex items-center justify-between"
      >
        <div className="flex items-center space-x-2.5">
          <div
            style={{ backgroundColor: currentTheme.accent + '15', color: currentTheme.accent }}
            className="p-2 rounded-xl"
          >
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Investment Portfolio
            </h3>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
              All active and historical investment contracts
            </p>
          </div>
        </div>

        {onInvestClick && (
          <button
            onClick={onInvestClick}
            style={{ backgroundColor: currentTheme.accent }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition hover:opacity-90"
          >
            <span>New Plan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead
            style={{
              backgroundColor: currentTheme.bg,
              borderColor: currentTheme.border,
              color: currentTheme.textSecondary
            }}
            className="border-b uppercase tracking-wider text-[10px] font-bold"
          >
            <tr>
              <th className="px-5 py-3.5">Plan Name</th>
              <th className="px-5 py-3.5">Capital Invested</th>
              <th className="px-5 py-3.5">Daily ROI Rate</th>
              <th className="px-5 py-3.5">Total Paid</th>
              <th className="px-5 py-3.5">Start Date</th>
              <th className="px-5 py-3.5">Maturity Date</th>
              <th className="px-5 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody
            style={{ color: currentTheme.textPrimary }}
            className="divide-y divide-gray-500/10 font-sans"
          >
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10" style={{ color: currentTheme.textSecondary }}>
                  Loading investments...
                </td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12" style={{ color: currentTheme.textSecondary }}>
                  <p className="text-sm font-semibold">No investment contracts found.</p>
                  <p className="text-xs mt-1">Activate an investment plan to start receiving daily ROI.</p>
                </td>
              </tr>
            ) : (
              investments.map((inv) => (
                <tr key={inv._id} className="hover:opacity-85 transition">
                  <td className="px-5 py-4 font-bold" style={{ color: currentTheme.textPrimary }}>
                    {inv.planDetails?.planName || 'Standard Plan'}
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-sm" style={{ color: currentTheme.textPrimary }}>
                    ${Number(inv.investmentAmount).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{inv.dailyRoiPercentage}% / day
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold" style={{ color: currentTheme.textPrimary }}>
                    ${Number(inv.totalRoiPaid || 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 font-medium" style={{ color: currentTheme.textSecondary }}>
                    {new Date(inv.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-medium" style={{ color: currentTheme.textSecondary }}>
                    {new Date(inv.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {getStatusBadge(inv.investmentStatus)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
