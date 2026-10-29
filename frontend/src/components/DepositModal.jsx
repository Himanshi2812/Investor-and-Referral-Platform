import React, { useState } from 'react';
import { X, Wallet, CheckCircle, Plus } from 'lucide-react';
import api from '../api/client';

export const DepositModal = ({ isOpen, onClose, onSuccess }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Deposit Wallet Balance</h3>
              <p className="text-xs text-gray-400">Mock Sandbox Payment Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleDeposit} className="p-6 space-y-4">
          {successMsg && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Amount to Deposit ($)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400 font-mono">$</span>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(q)}
                className="flex-1 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-mono text-gray-300 transition"
              >
                +${q}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition flex items-center space-x-1.5"
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
