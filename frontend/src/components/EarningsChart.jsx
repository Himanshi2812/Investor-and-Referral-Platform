import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export const EarningsChart = ({ data = [] }) => {
  // Format date display for chart X-axis
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
        <div className="bg-gray-900 border border-gray-700/80 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-semibold text-gray-300 border-b border-gray-800 pb-1">
            Date: {payload[0]?.payload?.date}
          </p>
          <div className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Daily ROI:</span>
            </span>
            <span className="font-mono font-bold text-emerald-300">
              ${payload[0]?.value?.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5 text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>Level Income:</span>
            </span>
            <span className="font-mono font-bold text-indigo-300">
              ${payload[1]?.value?.toFixed(2)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-800/80 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Earnings Analytics (Last 7 Days)</h3>
            <p className="text-xs text-gray-400">Visual distribution of daily ROI versus referral level commissions</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium">
          <span className="flex items-center space-x-1.5 text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Daily ROI</span>
          </span>
          <span className="flex items-center space-x-1.5 text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
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
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="label" stroke="#6B7280" fontSize={11} tickLine={false} />
            <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
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
              stroke="#6366F1"
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
