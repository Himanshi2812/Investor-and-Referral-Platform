import React, { useState } from 'react';
import { X, Wallet, CheckCircle, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';

export const DepositModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentTheme } = useTheme();
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/auth/deposit', { amount: Number(amount) });
      setSuccessMsg(`Successfully credited $${amount} into wallet!`);
      setTimeout(() => {
        setSuccessMsg('');
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border,
          color: currentTheme.textPrimary
        }}
        className="border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition-colors duration-200"
      >
        <div
          style={{ borderColor: currentTheme.border }}
          className="flex items-center justify-between p-6 border-b"
        >
          <div className="flex items-center space-x-3">
            <div
              style={{ backgroundColor: currentTheme.accent + '15', color: currentTheme.accent }}
              className="p-2.5 rounded-xl border"
            >
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
                Deposit Wallet Balance
              </h3>
              <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                Mock Sandbox Payment Gateway
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

        <form onSubmit={handleDeposit} className="p-6 space-y-4">
          {successMsg && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Amount to Deposit ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 opacity-50 font-mono">$</span>
              <input
                type="number"
                min="10"
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

          <div className="flex space-x-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(q)}
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="flex-1 py-1.5 rounded-xl border text-xs font-mono font-bold transition hover:opacity-80"
              >
                +${q}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold opacity-60 hover:opacity-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: currentTheme.accent }}
              className="px-5 py-2.5 rounded-xl hover:opacity-90 text-white text-xs font-bold shadow-lg transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Crediting...' : 'Add Funds'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
