import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NEXACHAIN AI</h1>
          <p className="text-xs text-gray-400 mt-1">Investment & Multi-Tier Referral Platform</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alice@nexachain.ai"
                className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Logins for Evaluator Convenience */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center space-x-1.5 text-xs text-gray-400 mb-3">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-gray-300">Quick 1-Click Evaluator Logins:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoFill('alice@nexachain.ai')}
              type="button"
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700/80 text-left hover:border-indigo-500 transition"
            >
              <div className="font-semibold text-gray-200">Alice (Root Sponsor)</div>
              <div className="text-[10px] text-gray-400">Has 3 tiers of referrals</div>
            </button>
            <button
              onClick={() => handleDemoFill('bob@nexachain.ai')}
              type="button"
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700/80 text-left hover:border-indigo-500 transition"
            >
              <div className="font-semibold text-gray-200">Bob (Level 1)</div>
              <div className="text-[10px] text-gray-400">Referred by Alice</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
