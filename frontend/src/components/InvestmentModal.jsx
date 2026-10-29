import React, { useState } from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

export const InvestmentModal = ({ isOpen, onClose, walletBalance, onSuccess }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Investment</h3>
              <p className="text-xs text-gray-400">Select a plan and lock in high daily returns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start space-x-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Plan Selection Radios */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Choose Investment Tier</label>
            <div className="grid grid-cols-3 gap-2">
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
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                        : 'bg-gray-850 bg-gray-800/40 border-gray-700/60 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-bold text-xs text-gray-200">{p.name}</span>
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold my-1">
                      +{p.dailyRoiPercentage}% / day
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
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
              <label className="font-semibold text-gray-300">Investment Capital ($)</label>
              <span className="text-gray-400">
                Wallet Available: <span className="font-mono text-emerald-400 font-bold">${walletBalance.toFixed(2)}</span>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400 font-mono">$</span>
              <input
                type="number"
                min={selectedPlan?.minAmount}
                max={selectedPlan?.maxAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Return Calculation Box */}
          <div className="bg-gray-800/50 border border-gray-700/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Estimated Daily Payout:</span>
              <span className="font-mono font-bold text-emerald-400">+${dailyReturn.toFixed(2)} / day</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Duration:</span>
              <span className="font-mono text-gray-200">{selectedPlan?.durationDays} Days</span>
            </div>
            <div className="pt-2 border-t border-gray-700/60 flex justify-between text-xs">
              <span className="font-semibold text-gray-200">Total Projected ROI:</span>
              <span className="font-mono font-bold text-indigo-300 text-sm">${totalReturn.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || amount > walletBalance}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
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
