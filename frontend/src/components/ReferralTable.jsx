import React from 'react';
import { Users, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ReferralTable = ({ referralHistory = [], loading = false }) => {
  const { currentTheme } = useTheme();

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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Referral & Level Income History
            </h3>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
              Multi-level network commissions credited into your wallet
            </p>
          </div>
        </div>
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
              <th className="px-5 py-3.5">Credit Date</th>
              <th className="px-5 py-3.5">Downline Member</th>
              <th className="px-5 py-3.5">Referral Tier</th>
              <th className="px-5 py-3.5">Contract Size</th>
              <th className="px-5 py-3.5">Commission Rate</th>
              <th className="px-5 py-3.5 text-right">Commission Earned</th>
            </tr>
          </thead>
          <tbody
            style={{ color: currentTheme.textPrimary }}
            className="divide-y divide-gray-500/10 font-sans"
          >
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  Loading referral income records...
                </td>
              </tr>
            ) : referralHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  <p className="text-sm">No referral commissions recorded yet.</p>
                  <p className="text-xs mt-1">Earn commissions instantly when direct and indirect referrals activate plans.</p>
                </td>
              </tr>
            ) : (
              referralHistory.map((item) => (
                <tr key={item._id} className="hover:bg-gray-800/40 transition">
                  <td className="px-5 py-4 font-mono text-gray-400">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-200">
                    {item.sourceUser?.fullName || 'Downline Member'}
                    <span className="block text-[10px] text-gray-400">{item.sourceUser?.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getLevelBadge(item.referralLevel)}`}>
                      Level {item.referralLevel}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-gray-300">
                    ${Number(item.investment?.investmentAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-purple-400">
                    {item.commissionPercentage}%
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-400 text-sm text-right">
                    +${Number(item.incomeAmount).toFixed(2)}
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
