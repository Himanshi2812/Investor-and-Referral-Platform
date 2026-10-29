import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DashboardCards } from '../components/DashboardCards';
import { EarningsChart } from '../components/EarningsChart';
import { InvestmentTable } from '../components/InvestmentTable';
import { RoiTable } from '../components/RoiTable';
import { ReferralTable } from '../components/ReferralTable';
import { ReferralTree } from '../components/ReferralTree';
import { CronSimulator } from '../components/CronSimulator';
import { InvestmentModal } from '../components/InvestmentModal';
import { DepositModal } from '../components/DepositModal';
import { RefreshCw, TrendingUp, Sparkles, Clock } from 'lucide-react';

export const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();
  const { currentTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('overview'); // overview, investments, roi, network, cron
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [roiHistory, setRoiHistory] = useState([]);
  const [referralHistory, setReferralHistory] = useState([]);
  const [treeData, setTreeData] = useState(null);

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, invRes, roiRes, refRes, treeRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/investments'),
        api.get('/roi/history'),
        api.get('/referrals/history'),
        api.get('/referrals/tree')
      ]);

      setDashboardData(statsRes.data.data);
      setInvestments(invRes.data.data.investments);
      setRoiHistory(roiRes.data.data.items);
      setReferralHistory(refRes.data.data.items);
      setTreeData(treeRes.data.data.tree);

      await refreshProfile();
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleActionComplete = async () => {
    await fetchAllData();
  };

  return (
    <div
      style={{
        backgroundColor: currentTheme.bg
      }}
      className="min-h-screen text-gray-100 flex selection:bg-indigo-600 selection:text-white transition-colors duration-300"
    >
      {/* 1. Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenDeposit={() => setIsDepositModalOpen(true)}
          onOpenInvest={() => setIsInvestModalOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h1
                      className="text-2xl font-black tracking-tight font-sans"
                      style={{ color: currentTheme.textPrimary }}
                    >
                      Portfolio Overview
                    </h1>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border font-bold"
                      style={{
                        backgroundColor: currentTheme.accent + '15',
                        borderColor: currentTheme.accent + '30',
                        color: currentTheme.accent
                      }}
                    >
                      Live
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: currentTheme.textSecondary }}>
                    Welcome back, <strong style={{ color: currentTheme.textPrimary }}>{user?.fullName}</strong>. Real-time contracts, daily ROI, and multi-tier network commissions.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchAllData}
                    disabled={loading}
                    style={{
                      backgroundColor: currentTheme.card,
                      borderColor: currentTheme.border,
                      color: currentTheme.textPrimary
                    }}
                    className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition hover:opacity-85 shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: currentTheme.accent }} />
                    <span>Sync</span>
                  </button>

                  <button
                    onClick={() => setIsInvestModalOpen(true)}
                    style={{ backgroundColor: currentTheme.accent }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition transform active:scale-95 hover:opacity-90"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>+ New Contract</span>
                  </button>
                </div>
              </div>

              {/* Task 5: Cron Job Testing Widget */}
              <CronSimulator onJobExecuted={handleActionComplete} />

              {/* Task 4: Metric Cards */}
              <DashboardCards
                cards={dashboardData?.cards}
                onInvestClick={() => setIsInvestModalOpen(true)}
                onDepositClick={() => setIsDepositModalOpen(true)}
              />

              {/* Task 4: Recharts Earnings Analytics */}
              <EarningsChart data={dashboardData?.charts?.earningsChartData || []} />

              {/* Active Portfolio Preview */}
              <InvestmentTable
                investments={investments}
                loading={loading}
                onInvestClick={() => setIsInvestModalOpen(true)}
              />
            </div>
          )}

          {/* Investments Tab */}
          {activeTab === 'investments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Investment Portfolio</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Active contracts earning daily automated yields</p>
                </div>
                <button
                  onClick={() => setIsInvestModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
                >
                  + Activate New Plan
                </button>
              </div>
              <InvestmentTable
                investments={investments}
                loading={loading}
                onInvestClick={() => setIsInvestModalOpen(true)}
              />
            </div>
          )}

          {/* Daily ROI Tab */}
          {activeTab === 'roi' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-white">Daily ROI Payouts</h2>
                <p className="text-xs text-gray-400 mt-0.5">Verified daily returns credited automatically to your wallet</p>
              </div>
              <RoiTable roiHistory={roiHistory} loading={loading} />
            </div>
          )}

          {/* Referral Network Tab */}
          {activeTab === 'network' && (
            <div className="space-y-8 animate-fade-in">
              <ReferralTree treeData={treeData} onRefresh={fetchAllData} />
              <ReferralTable referralHistory={referralHistory} loading={loading} />
            </div>
          )}

          {/* Scheduler Console Tab */}
          {activeTab === 'cron' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-black text-white">Cron Scheduler & Idempotency Testing Lab (Task 5)</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Automated background job running every midnight at 12:00 AM (0 0 * * *). Test and verify idempotency live below.
                </p>
              </div>
              <CronSimulator onJobExecuted={handleActionComplete} />
              <RoiTable roiHistory={roiHistory} loading={loading} />
            </div>
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <InvestmentModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        walletBalance={user?.walletBalance || 0}
        onSuccess={handleActionComplete}
      />

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleActionComplete}
      />
    </div>
  );
};
