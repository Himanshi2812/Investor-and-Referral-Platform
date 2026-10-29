import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#080B11] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#101524]/90 backdrop-blur-2xl border border-gray-800/90 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 p-0.5 shadow-xl shadow-indigo-600/25 mb-4">
            <div className="w-full h-full bg-[#101524] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">NEXACHAIN AI</h1>
          <p className="text-xs text-gray-400 mt-1">Institutional Investment & Multi-Tier Referral Platform</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2.5 p-3.5 mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alice@nexachain.ai"
                className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 mt-2 transform active:scale-95"
          >
            <span>{loading ? 'Authenticating Secure Session...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Evaluator Quick 1-Click Fill */}
        <div className="mt-8 pt-6 border-t border-gray-800/80">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold text-gray-300 text-[11px] uppercase tracking-wider">
              Quick 1-Click Evaluator Logins:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoFill('alice@nexachain.ai')}
              type="button"
              className="p-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-indigo-500/50 text-left transition shadow-sm"
            >
              <div className="font-bold text-white text-xs">Alice (Root Sponsor)</div>
              <div className="text-[10px] text-emerald-400 font-medium">3 Tiers Downlines</div>
            </button>

            <button
              onClick={() => handleDemoFill('bob@nexachain.ai')}
              type="button"
              className="p-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-indigo-500/50 text-left transition shadow-sm"
            >
              <div className="font-bold text-white text-xs">Bob (Level 1)</div>
              <div className="text-[10px] text-indigo-400 font-medium">Referred by Alice</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Need a new account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-2 ml-1"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};
