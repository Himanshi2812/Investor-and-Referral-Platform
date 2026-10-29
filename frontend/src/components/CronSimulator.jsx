import React, { useState } from 'react';
import { Play, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import api from '../api/client';

export const CronSimulator = ({ onJobExecuted }) => {
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
    <div className="bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
              <Clock className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Automated Scheduler & Idempotency Testing Console (Task 5)
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              0 0 * * * (12:00 AM)
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-2xl">
            Click to trigger the daily ROI calculation job. The backend uses compound indexing and transactional checks to guarantee that accidental double-executions NEVER credit ROI twice for the same day.
          </p>
        </div>

        <button
          onClick={handleRunCron}
          disabled={running}
          className="shrink-0 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{running ? 'Executing Engine...' : 'Run Scheduled ROI Job Now'}</span>
        </button>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-indigo-500/20 animate-fade-in text-xs space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Date: <span className="font-mono ml-1 text-gray-200">{result.targetDate}</span>
            </span>

            <span className="bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700">
              Processed: <strong className="text-emerald-400 font-mono">{result.processedCount}</strong>
            </span>

            <span className="bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700">
              Skipped / Already Credited: <strong className="text-amber-400 font-mono">{result.skippedCount}</strong>
            </span>

            <span className="bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700">
              Total Distributed: <strong className="text-white font-mono">${result.totalRoiDistributed}</strong>
            </span>
          </div>

          {result.skippedCount > 0 && result.processedCount === 0 && (
            <div className="flex items-center space-x-2 text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                <strong>Idempotency Safeguard Active:</strong> ROI for date {result.targetDate} has already been credited. Duplicate payout was successfully prevented!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
