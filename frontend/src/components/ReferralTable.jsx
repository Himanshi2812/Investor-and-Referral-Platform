import React from 'react';
import { Users, CheckCircle, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { exportToCSV } from '../utils/csvExport';

export const ReferralTable = ({ referralHistory = [], loading = false }) => {
  const { currentTheme } = useTheme();

  const handleExportCSV = () => {
    const rows = referralHistory.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      downlineMember: item.sourceUser?.fullName || 'Downline Member',
      downlineEmail: item.sourceUser?.email || '',
      level: `Level ${item.referralLevel}`,
      contractSize: `$${Number(item.investment?.investmentAmount || 0).toLocaleString()}`,
      commissionRate: `${item.commissionPercentage}%`,
      earnedAmount: `$${Number(item.incomeAmount).toFixed(2)}`
    }));

    exportToCSV('Nexachain_Referral_Commission_Ledger', rows, {
      date: 'Credit Date',
      downlineMember: 'Downline Member',
      downlineEmail: 'Downline Email',
      level: 'Referral Tier',
      contractSize: 'Contract Size',
      commissionRate: 'Commission Rate',
      earnedAmount: 'Commission Earned'
    });
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Referral & Level Income History
            </h3>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
              Multi-level network commissions credited into your wallet ({referralHistory.length} records)
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            backgroundColor: currentTheme.bg,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold hover:opacity-85 transition"
          title="Download CSV Spreadsheet"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
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
                <td colSpan="6" className="text-center py-10" style={{ color: currentTheme.textSecondary }}>
                  Loading referral income records...
                </td>
              </tr>
            ) : referralHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12" style={{ color: currentTheme.textSecondary }}>
                  <p className="text-sm font-semibold">No referral commissions recorded yet.</p>
                  <p className="text-xs mt-1">Earn commissions instantly when direct and indirect referrals activate plans.</p>
                </td>
              </tr>
            ) : (
              referralHistory.map((item) => (
                <tr key={item._id} className="hover:opacity-85 transition">
                  <td className="px-5 py-4 font-mono font-medium" style={{ color: currentTheme.textSecondary }}>
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-bold" style={{ color: currentTheme.textPrimary }}>
                    {item.sourceUser?.fullName || 'Downline Member'}
                    <span className="block text-[10px] font-normal" style={{ color: currentTheme.textSecondary }}>
                      {item.sourceUser?.email}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      style={{
                        backgroundColor: currentTheme.accent + '15',
                        borderColor: currentTheme.accent + '30',
                        color: currentTheme.accent
                      }}
                      className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                    >
                      Level {item.referralLevel}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold" style={{ color: currentTheme.textPrimary }}>
                    ${Number(item.investment?.investmentAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold" style={{ color: currentTheme.accent }}>
                    {item.commissionPercentage}%
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-sm text-right text-emerald-600 dark:text-emerald-400">
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
