import React from 'react';
import { Users, CheckCircle } from 'lucide-react';

export const ReferralTable = ({ referralHistory = [], loading = false }) => {
  const getLevelBadge = (level) => {
    switch (level) {
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
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Referral & Level Income History</h3>
            <p className="text-xs text-gray-400">Multi-level network commissions credited into your wallet</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-950/50 text-gray-400 border-b border-gray-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Credit Date</th>
              <th className="px-5 py-3.5">Downline Member</th>
              <th className="px-5 py-3.5">Referral Tier</th>
              <th className="px-5 py-3.5">Contract Size</th>
              <th className="px-5 py-3.5">Commission Rate</th>
              <th className="px-5 py-3.5 text-right">Commission Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 font-sans">
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
