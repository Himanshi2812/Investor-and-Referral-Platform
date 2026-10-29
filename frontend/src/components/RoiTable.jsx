import React from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';

export const RoiTable = ({ roiHistory = [], loading = false }) => {
  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Daily ROI Payout Ledger</h3>
            <p className="text-xs text-gray-400">Automated daily returns credited from active investments</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-950/50 text-gray-400 border-b border-gray-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Execution Date</th>
              <th className="px-5 py-3.5">Associated Plan</th>
              <th className="px-5 py-3.5">ROI Rate</th>
              <th className="px-5 py-3.5">Credited Amount</th>
              <th className="px-5 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  Loading daily ROI records...
                </td>
              </tr>
            ) : roiHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  <p className="text-sm">No ROI payouts recorded yet.</p>
                  <p className="text-xs mt-1">Daily returns are processed automatically at midnight (or via the Cron Simulator).</p>
                </td>
              </tr>
            ) : (
              roiHistory.map((item) => (
                <tr key={item._id} className="hover:bg-gray-800/40 transition">
                  <td className="px-5 py-4 font-mono text-gray-300">
                    {item.dateString || new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-200">
                    {item.investment?.planDetails?.planName || 'Active Investment'} (${Number(item.investment?.investmentAmount || 0).toLocaleString()})
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-emerald-400">
                    {item.roiPercentage}%
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-400 text-sm">
                    +${Number(item.roiAmount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
