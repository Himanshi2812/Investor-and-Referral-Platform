import React, { useState } from 'react';
import { X, TrendingUp, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';

export const InvestmentModal = ({ isOpen, onClose, walletBalance, onSuccess }) => {
  const { currentTheme } = useTheme();

  const [plans] = useState([
    {
      id: 'starter',
      name: 'Starter Plan',
      minAmount: 50,
      maxAmount: 999,
      dailyRoiPercentage: 1.5,
      durationDays: 30,
      description: '1.5% daily for 30 days (45% total ROI)'
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      minAmount: 1000,
      maxAmount: 4999,
      dailyRoiPercentage: 2.0,
      durationDays: 45,
      description: '2.0% daily for 45 days (90% total ROI)'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      minAmount: 5000,
      maxAmount: 50000,
      dailyRoiPercentage: 2.5,
      durationDays: 60,
      description: '2.5% daily for 60 days (150% total ROI)'
    }
  ]);

  const [selectedPlanId, setSelectedPlanId] = useState('growth');
  const [amount, setAmount] = useState(1000);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const dailyReturn = ((amount * (selectedPlan?.dailyRoiPercentage || 0)) / 100);
  const totalReturn = dailyReturn * (selectedPlan?.durationDays || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (amount > walletBalance) {
      setError(`Insufficient wallet balance ($${walletBalance.toFixed(2)}). Please deposit funds first.`);
      return;
    }

    if (amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      setError(`Amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount} for ${selectedPlan.name}.`);
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/investments', {
        planId: selectedPlan.id,
        amount: Number(amount)
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create investment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border,
          color: currentTheme.textPrimary
        }}
        className="border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-colors duration-200"
      >
        {/* Header */}
        <div
          style={{ borderColor: currentTheme.border }}
          className="flex items-center justify-between p-6 border-b"
        >
          <div className="flex items-center space-x-3">
            <div
              style={{ backgroundColor: currentTheme.accent + '15', color: currentTheme.accent }}
              className="p-2.5 rounded-xl border"
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
                Create New Investment
              </h3>
              <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                Select a plan and lock in high daily returns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start space-x-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Plan Selection Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Choose Investment Tier
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {plans.map((p) => {
                const isSelected = p.id === selectedPlanId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlanId(p.id);
                      setAmount(p.minAmount);
                    }}
                    style={{
                      backgroundColor: isSelected ? currentTheme.accent + '15' : currentTheme.bg,
                      borderColor: isSelected ? currentTheme.accent : currentTheme.border
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected ? 'ring-2 shadow-sm font-bold' : 'hover:opacity-90 font-medium'
                    }`}
                  >
                    <span className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                      {p.name}
                    </span>
                    <span
                      style={{ color: currentTheme.accent }}
                      className="text-[11px] font-mono font-bold my-1"
                    >
                      +{p.dailyRoiPercentage}% / day
                    </span>
                    <span className="text-[10px] font-mono opacity-70" style={{ color: currentTheme.textSecondary }}>
                      ${p.minAmount} - ${p.maxAmount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold" style={{ color: currentTheme.textPrimary }}>
                Investment Capital ($)
              </label>
              <span style={{ color: currentTheme.textSecondary }}>
                Wallet Available: <strong className="font-mono text-emerald-600 dark:text-emerald-400">${walletBalance.toFixed(2)}</strong>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 opacity-50 font-mono">$</span>
              <input
                type="number"
                min={selectedPlan?.minAmount}
                max={selectedPlan?.maxAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-8 pr-4 py-2.5 font-mono text-sm font-bold focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          {/* Return Calculation Box */}
          <div
            style={{
              backgroundColor: currentTheme.bg,
              borderColor: currentTheme.border
            }}
            className="border rounded-2xl p-4 space-y-2 shadow-sm"
          >
            <div className="flex justify-between text-xs">
              <span style={{ color: currentTheme.textSecondary }}>Estimated Daily Payout:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +${dailyReturn.toFixed(2)} / day
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: currentTheme.textSecondary }}>Duration:</span>
              <span className="font-mono font-bold" style={{ color: currentTheme.textPrimary }}>
                {selectedPlan?.durationDays} Days
              </span>
            </div>
            <div
              style={{ borderColor: currentTheme.border }}
              className="pt-2 border-t flex justify-between text-xs"
            >
              <span className="font-bold" style={{ color: currentTheme.textPrimary }}>Total Projected ROI:</span>
              <span className="font-mono font-black text-sm" style={{ color: currentTheme.accent }}>
                ${totalReturn.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold opacity-60 hover:opacity-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || amount > walletBalance}
              style={{ backgroundColor: currentTheme.accent }}
              className="px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{submitting ? 'Confirming...' : 'Confirm & Activate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
