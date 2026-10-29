import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const EarningsChart = ({ data = [] }) => {
  const { currentTheme } = useTheme();

  const formattedData = data.map((item) => {
    const parts = item.date.split('-');
    const label = parts.length === 3 ? `${parts[1]}/${parts[2]}` : item.date;
    return {
      ...item,
      label
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
          className="border rounded-xl p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-md"
        >
          <p className="font-bold border-b pb-1 opacity-75" style={{ borderColor: currentTheme.border }}>
            Date: {payload[0]?.payload?.date}
          </p>
          <div className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Daily ROI:</span>
            </span>
            <span className="font-mono font-bold text-emerald-500">
              ${payload[0]?.value?.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5 font-semibold" style={{ color: currentTheme.accent }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.accent }}></span>
              <span>Level Income:</span>
            </span>
            <span className="font-mono font-bold" style={{ color: currentTheme.accent }}>
              ${payload[1]?.value?.toFixed(2)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        backgroundColor: currentTheme.card,
        borderColor: currentTheme.border
      }}
      className="border rounded-2xl p-5 shadow-lg transition-colors"
    >
      <div
        style={{ borderColor: currentTheme.border }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b gap-2"
      >
        <div className="flex items-center space-x-2.5">
          <div
            style={{ backgroundColor: currentTheme.accent + '15', color: currentTheme.accent }}
            className="p-2 rounded-xl"
          >
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>
              Earnings Analytics (Last 7 Days)
            </h3>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
              Visual distribution of daily ROI versus referral level commissions
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <span className="flex items-center space-x-1.5 text-emerald-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Daily ROI</span>
          </span>
          <span className="flex items-center space-x-1.5" style={{ color: currentTheme.accent }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.accent }}></span>
            <span>Level Referral</span>
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="refGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentTheme.accent} stopOpacity={0.35} />
                <stop offset="95%" stopColor={currentTheme.accent} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} vertical={false} />
            <XAxis dataKey="label" stroke={currentTheme.textSecondary} fontSize={11} tickLine={false} />
            <YAxis stroke={currentTheme.textSecondary} fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="roiEarnings"
              name="Daily ROI"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#roiGradient)"
            />
            <Area
              type="monotone"
              dataKey="referralEarnings"
              name="Level Income"
              stroke={currentTheme.accent}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#refGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
