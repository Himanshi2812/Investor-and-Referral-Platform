import React from 'react';
import { TrendingUp, CheckCircle, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { exportToCSV } from '../utils/csvExport';

export const RoiTable = ({ roiHistory = [], loading = false }) => {
  const { currentTheme } = useTheme();

  const handleExportCSV = () => {
    const rows = roiHistory.map(item => ({
      date: item.dateString || new Date(item.date).toLocaleDateString(),
      plan: item.investment?.planDetails?.planName || 'Active Investment',
      investedAmount: `$${Number(item.investment?.investmentAmount || 0).toLocaleString()}`,
      rate: `${item.roiPercentage}%`,
      creditedAmount: `$${Number(item.roiAmount).toFixed(2)}`,
      status: item.status || 'Credited'
    }));

    exportToCSV('Nexachain_Daily_ROI_Ledger', rows, {
      date: 'Execution Date',
      plan: 'Plan Name',
      investedAmount: 'Capital Invested',
      rate: 'ROI Rate',
      creditedAmount: 'Credited Amount',
      status: 'Status'
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
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Daily ROI Payout Ledger
            </h3>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
              Automated daily returns credited from active investments ({roiHistory.length} records)
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
              <th className="px-5 py-3.5">Execution Date</th>
              <th className="px-5 py-3.5">Associated Plan</th>
              <th className="px-5 py-3.5">ROI Rate</th>
              <th className="px-5 py-3.5">Credited Amount</th>
              <th className="px-5 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody
            style={{ color: currentTheme.textPrimary }}
            className="divide-y divide-gray-500/10 font-sans"
          >
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10" style={{ color: currentTheme.textSecondary }}>
                  Loading daily ROI records...
                </td>
              </tr>
            ) : roiHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12" style={{ color: currentTheme.textSecondary }}>
                  <p className="text-sm font-semibold">No ROI payouts recorded yet.</p>
                  <p className="text-xs mt-1">Daily returns are processed automatically at midnight (or via the Cron Simulator).</p>
                </td>
              </tr>
            ) : (
              roiHistory.map((item) => (
                <tr key={item._id} className="hover:opacity-85 transition">
                  <td className="px-5 py-4 font-mono font-medium" style={{ color: currentTheme.textSecondary }}>
                    {item.dateString || new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-bold" style={{ color: currentTheme.textPrimary }}>
                    {item.investment?.planDetails?.planName || 'Active Investment'} (${Number(item.investment?.investmentAmount || 0).toLocaleString()})
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.roiPercentage}%
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                    +${Number(item.roiAmount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> {item.status || 'Credited'}
                    </span>
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
