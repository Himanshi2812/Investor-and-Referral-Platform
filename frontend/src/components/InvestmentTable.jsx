import React from 'react';
import { Landmark, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';

export const InvestmentTable = ({ investments = [], loading = false, onInvestClick }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Clock className="w-3 h-3 mr-1" /> Active
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
      default:
        return <span className="text-gray-400 text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Investment Portfolio</h3>
            <p className="text-xs text-gray-400">All active and historical investment contracts</p>
          </div>
        </div>

        {onInvestClick && (
          <button
            onClick={onInvestClick}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            <span>New Plan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-950/50 text-gray-400 border-b border-gray-800 uppercase tracking-wider text-[10px]">
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
          <tbody className="divide-y divide-gray-800/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400">
                  Loading investments...
                </td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-500">
                  <p className="text-sm">No investment contracts found.</p>
                  <p className="text-xs mt-1">Activate an investment plan to start receiving daily ROI.</p>
                </td>
              </tr>
            ) : (
              investments.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-800/40 transition">
                  <td className="px-5 py-4 font-semibold text-gray-200">
                    {inv.planDetails?.planName || 'Standard Plan'}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-white text-sm">
                    ${Number(inv.investmentAmount).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-emerald-400">
                    +{inv.dailyRoiPercentage}% / day
                  </td>
                  <td className="px-5 py-4 font-mono text-gray-300">
                    ${Number(inv.totalRoiPaid || 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(inv.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-gray-400">
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
