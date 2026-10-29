import React, { useState } from 'react';
import { Play, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';

export const CronSimulator = ({ onJobExecuted }) => {
  const { currentTheme } = useTheme();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunCron = async () => {
    try {
      setRunning(true);
      setResult(null);
      const res = await api.post('/cron/trigger-daily-roi', {});
      setResult(res.data.data);
      onJobExecuted?.();
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: currentTheme.card,
        borderColor: currentTheme.border
      }}
      className="border rounded-2xl p-5 shadow-lg transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: currentTheme.accent + '20', color: currentTheme.accent }}
            >
              <Clock className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold tracking-wide" style={{ color: currentTheme.textPrimary }}>
              Automated Scheduler & Idempotency Testing Console (Task 5)
            </h4>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold"
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.accent
              }}
            >
              0 0 * * * (12:00 AM)
            </span>
          </div>
          <p className="text-xs max-w-2xl" style={{ color: currentTheme.textSecondary }}>
            Click to trigger the daily ROI calculation job. The backend uses compound indexing and transactional checks to guarantee that accidental double-executions NEVER credit ROI twice for the same day.
          </p>
        </div>

        <button
          onClick={handleRunCron}
          disabled={running}
          style={{ backgroundColor: currentTheme.accent }}
          className="shrink-0 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold shadow-md transition transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{running ? 'Executing Engine...' : 'Run Scheduled ROI Job Now'}</span>
        </button>
      </div>

      {result && (
        <div
          className="mt-4 pt-4 border-t animate-fade-in text-xs space-y-2.5"
          style={{ borderColor: currentTheme.border }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
              className="flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
              <span>Date:</span>
              <span className="font-mono ml-1.5 font-bold text-emerald-600 dark:text-emerald-400">{result.targetDate}</span>
            </span>

            <span
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5"
            >
              <span>Processed:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{result.processedCount}</strong>
            </span>

            <span
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5"
            >
              <span>Skipped / Already Credited:</span>
              <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">{result.skippedCount}</strong>
            </span>

            <span
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5"
            >
              <span>Total Distributed:</span>
              <strong className="font-mono text-sm" style={{ color: currentTheme.textPrimary }}>
                ${result.totalRoiDistributed}
              </strong>
            </span>
          </div>

          {result.skippedCount > 0 && result.processedCount === 0 && (
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 p-3 rounded-xl font-medium text-xs leading-relaxed">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong className="font-bold">Idempotency Safeguard Active:</strong> ROI for date {result.targetDate} has already been credited. Duplicate payout was successfully prevented!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
