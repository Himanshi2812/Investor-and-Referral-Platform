import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { TrendingUp, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const { currentTheme } = useTheme();
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
    <div
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.textPrimary
      }}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none transition-colors duration-300"
    >
      {/* Top Right Corner Theme Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeSwitcher />
      </div>

      {/* Dynamic Ambient Background Glows */}
      <div
        className="absolute top-1/4 -left-20 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.accent }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.accent }}
      />

      <div
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border
        }}
        className="w-full max-w-md backdrop-blur-2xl border rounded-3xl p-8 shadow-2xl relative z-10 transition-colors duration-300"
      >
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl p-0.5 shadow-xl mb-4"
            style={{ backgroundColor: currentTheme.accent }}
          >
            <div
              className="w-full h-full rounded-[14px] flex items-center justify-center text-white"
              style={{ backgroundColor: currentTheme.card }}
            >
              <Sparkles className="w-7 h-7" style={{ color: currentTheme.accent }} />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: currentTheme.textPrimary }}>
            NEXACHAIN AI
          </h1>
          <p className="text-xs opacity-75 mt-1" style={{ color: currentTheme.textSecondary }}>
            Institutional Investment & Multi-Tier Referral Platform
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2.5 p-3.5 mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 opacity-50 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alice@nexachain.ai"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 opacity-50 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: currentTheme.accent
            }}
            className="w-full py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2 mt-2 transform active:scale-95"
          >
            <span>{loading ? 'Authenticating Secure Session...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Evaluator Quick 1-Click Fill */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center space-x-2 text-xs mb-3">
            <KeyRound className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
            <span className="font-bold text-[11px] uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
              Quick 1-Click Evaluator Logins:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoFill('aarav@nexachain.ai')}
              type="button"
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border
              }}
              className="p-2.5 rounded-xl border text-left transition shadow-sm hover:scale-[1.02]"
            >
              <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>Aarav (Root Sponsor)</div>
              <div className="text-[10px] font-semibold" style={{ color: currentTheme.accent }}>3 Tiers Downlines</div>
            </button>

            <button
              onClick={() => handleDemoFill('rohan@nexachain.ai')}
              type="button"
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border
              }}
              className="p-2.5 rounded-xl border text-left transition shadow-sm hover:scale-[1.02]"
            >
              <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>Rohan (Level 1)</div>
              <div className="text-[10px] font-semibold" style={{ color: currentTheme.accent }}>Referred by Aarav</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs" style={{ color: currentTheme.textSecondary }}>
          Need a new account?{' '}
          <button
            onClick={onSwitchToRegister}
            style={{ color: currentTheme.accent }}
            className="font-bold underline underline-offset-2 ml-1"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};
