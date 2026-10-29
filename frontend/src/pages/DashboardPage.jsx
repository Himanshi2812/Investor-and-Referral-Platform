import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Navbar } from '../components/Navbar';
import { DashboardCards } from '../components/DashboardCards';
import { EarningsChart } from '../components/EarningsChart';
import { InvestmentTable } from '../components/InvestmentTable';
import { RoiTable } from '../components/RoiTable';
import { ReferralTable } from '../components/ReferralTable';
import { ReferralTree } from '../components/ReferralTree';
import { CronSimulator } from '../components/CronSimulator';
import { InvestmentModal } from '../components/InvestmentModal';
import { DepositModal } from '../components/DepositModal';
import { Landmark, TrendingUp, Users, GitBranch, RefreshCw } from 'lucide-react';

export const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('investments');
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

  const tabs = [
    { id: 'investments', label: 'Investments', icon: Landmark, count: investments.length },
    { id: 'roi', label: 'Daily ROI History', icon: TrendingUp, count: roiHistory.length },
    { id: 'referrals', label: 'Referral Income', icon: Users, count: referralHistory.length },
    { id: 'tree', label: 'Referral Network Tree', icon: GitBranch }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenDeposit={() => setIsDepositModalOpen(true)}
        onOpenInvest={() => setIsInvestModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Real-time portfolio analytics, active contracts, and multi-tier affiliate earnings
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 border border-gray-700 text-xs font-medium transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsInvestModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              + New Investment
            </button>
          </div>
        </div>

        {/* Task 5: Automated Scheduler Console */}
        <CronSimulator onJobExecuted={handleActionComplete} />

        {/* Task 4: Metric Cards */}
        <DashboardCards
          cards={dashboardData?.cards}
          onInvestClick={() => setIsInvestModalOpen(true)}
          onDepositClick={() => setIsDepositModalOpen(true)}
        />

        {/* Task 4: Earnings Analytics Chart */}
        <EarningsChart data={dashboardData?.charts?.earningsChartData || []} />

        {/* Tab Navigation for Tables & Network Tree */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-gray-900/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-indigo-700 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab View */}
          <div className="transition duration-150">
            {activeTab === 'investments' && (
              <InvestmentTable
                investments={investments}
                loading={loading}
                onInvestClick={() => setIsInvestModalOpen(true)}
              />
            )}

            {activeTab === 'roi' && (
              <RoiTable roiHistory={roiHistory} loading={loading} />
            )}

            {activeTab === 'referrals' && (
              <ReferralTable referralHistory={referralHistory} loading={loading} />
            )}

            {activeTab === 'tree' && (
              <ReferralTree treeData={treeData} onRefresh={fetchAllData} />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
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
