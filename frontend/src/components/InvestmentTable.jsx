import React, { useState, useMemo } from 'react';
import { Landmark, CheckCircle, Clock, XCircle, ArrowUpRight, Download, Search, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { exportToCSV } from '../utils/csvExport';

export const InvestmentTable = ({ investments = [], loading = false, onInvestClick }) => {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInvestments = useMemo(() => {
    return investments.filter(inv => {
      const matchesSearch = (inv.planDetails?.planName || 'Standard Plan')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || inv.investmentStatus?.toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [investments, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    const rows = filteredInvestments.map(inv => ({
      id: inv._id,
      planName: inv.planDetails?.planName || 'Standard Plan',
      amount: `$${inv.investmentAmount}`,
      dailyRoiPercentage: `${inv.dailyRoiPercentage}%`,
      totalRoiPaid: `$${Number(inv.totalRoiPaid || 0).toFixed(2)}`,
      startDate: new Date(inv.startDate).toLocaleDateString(),
      endDate: new Date(inv.endDate).toLocaleDateString(),
      status: inv.investmentStatus
    }));

    exportToCSV('Nexachain_Investment_Portfolio', rows, {
      id: 'Contract ID',
      planName: 'Plan Name',
      amount: 'Capital Invested',
      dailyRoiPercentage: 'Daily ROI %',
      totalRoiPaid: 'Total ROI Paid',
      startDate: 'Start Date',
      endDate: 'Maturity Date',
      status: 'Status'
    });
  };

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
        className="p-5 border-b flex flex-wrap gap-4 items-center justify-between"
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
              All active and historical investment contracts ({filteredInvestments.length} shown)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5" style={{ color: currentTheme.textSecondary }} />
            <input
              type="text"
              placeholder="Search plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Filter Tabs */}
          <div
            style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
            className="flex items-center p-1 border rounded-xl text-xs font-semibold"
          >
            {['ALL', 'ACTIVE', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  backgroundColor: statusFilter === st ? currentTheme.card : 'transparent',
                  color: statusFilter === st ? currentTheme.textPrimary : currentTheme.textSecondary,
                  boxShadow: statusFilter === st ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                }}
                className="px-2.5 py-1 rounded-lg transition capitalize text-[11px]"
              >
                {st.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
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

          {onInvestClick && (
            <button
              onClick={onInvestClick}
              style={{ backgroundColor: currentTheme.accent }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition hover:opacity-90 shadow-sm"
            >
              <span>New Plan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
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
            ) : filteredInvestments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12" style={{ color: currentTheme.textSecondary }}>
                  <p className="text-sm font-semibold">No matching investment contracts.</p>
                  <p className="text-xs mt-1">Try clearing filters or activate a new investment plan.</p>
                </td>
              </tr>
            ) : (
              filteredInvestments.map((inv) => (
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
