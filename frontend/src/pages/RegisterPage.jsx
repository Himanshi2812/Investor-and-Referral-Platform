import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { TrendingUp, Lock, Mail, User, Phone, Share2, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const { currentTheme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-detect referral code from URL query parameter ?ref=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setFormData((prev) => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
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
        className="absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.accent }}
      />
      <div
        className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.accent }}
      />

      <div
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border
        }}
        className="w-full max-w-md border rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 transition-colors backdrop-blur-xl animate-fade-in"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            style={{
              backgroundColor: currentTheme.accent + '20',
              color: currentTheme.accent
            }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
          >
            <TrendingUp className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: currentTheme.textPrimary }}>
            Create Account
          </h1>
          <p className="text-xs mt-1 font-medium" style={{ color: currentTheme.textSecondary }}>
            Join the Nexachain investment & referral network
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3" style={{ color: currentTheme.textSecondary }} />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3" style={{ color: currentTheme.textSecondary }} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="aarav@example.com"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3" style={{ color: currentTheme.textSecondary }} />
              <input
                type="tel"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3" style={{ color: currentTheme.textSecondary }} />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center justify-between" style={{ color: currentTheme.textPrimary }}>
              <span>Sponsor Referral Code (Optional)</span>
              <span className="text-[10px] font-mono opacity-60" style={{ color: currentTheme.textSecondary }}>
                e.g. NXAARAV1
              </span>
            </label>
            <div className="relative">
              <Share2 className="w-4 h-4 absolute left-3.5 top-3" style={{ color: currentTheme.accent }} />
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="NX..."
                style={{
                  backgroundColor: currentTheme.bg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 uppercase font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-bold tracking-wider"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: currentTheme.accent
            }}
            className="w-full py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2 mt-4 transform active:scale-95"
          >
            <span>{loading ? 'Creating Account...' : 'Register & Start Earning'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs" style={{ color: currentTheme.textSecondary }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{ color: currentTheme.accent }}
            className="font-bold underline underline-offset-2 ml-1"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
