const User = require('../models/User');
const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory');
const ReferralIncome = require('../models/ReferralIncome');

/**
 * @desc    Get aggregated dashboard metrics for current user
 * @route   GET /api/v1/dashboard
 * @access  Private
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch fresh user balances
    const user = await User.findById(userId)
      .select('walletBalance totalRoiEarned totalLevelIncomeEarned referralCode')
      .lean();

    // 2. Fetch investments aggregate
    const investments = await Investment.find({ user: userId }).lean();
    const activeInvestments = investments.filter((i) => i.investmentStatus === 'Active');

    const totalInvestmentsAmount = investments.reduce(
      (sum, inv) => sum + inv.investmentAmount,
      0
    );

    const activeInvestmentsAmount = activeInvestments.reduce(
      (sum, inv) => sum + inv.investmentAmount,
      0
    );

    // Current daily ROI generation rate across active investments
    const currentDailyRoiEstimate = activeInvestments.reduce((sum, inv) => {
      const dailyRate = (inv.investmentAmount * inv.dailyRoiPercentage) / 100;
      return sum + dailyRate;
    }, 0);

    // 3. Referral direct count
    const directReferralsCount = await User.countDocuments({ referredBy: userId });

    // 4. Fetch last 7 days ROI & Level earnings for charts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentRoi, recentLevelIncome] = await Promise.all([
      ROIHistory.find({
        user: userId,
        date: { $gte: sevenDaysAgo }
      })
        .sort({ date: 1 })
        .lean(),
      ReferralIncome.find({
        recipientUser: userId,
        date: { $gte: sevenDaysAgo }
      })
        .sort({ date: 1 })
        .lean()
    ]);

    // Build day-by-day earnings chart series
    const chartMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      chartMap[dateKey] = {
        date: dateKey,
        roiEarnings: 0,
        referralEarnings: 0,
        totalEarnings: 0
      };
    }

    recentRoi.forEach((item) => {
      const key = item.dateString || item.date.toISOString().split('T')[0];
      if (chartMap[key]) {
        chartMap[key].roiEarnings = Number(
          (chartMap[key].roiEarnings + item.roiAmount).toFixed(2)
        );
        chartMap[key].totalEarnings = Number(
          (chartMap[key].totalEarnings + item.roiAmount).toFixed(2)
        );
      }
    });

    recentLevelIncome.forEach((item) => {
      const key = item.date.toISOString().split('T')[0];
      if (chartMap[key]) {
        chartMap[key].referralEarnings = Number(
          (chartMap[key].referralEarnings + item.incomeAmount).toFixed(2)
        );
        chartMap[key].totalEarnings = Number(
          (chartMap[key].totalEarnings + item.incomeAmount).toFixed(2)
        );
      }
    });

    const earningsChartData = Object.values(chartMap);

    return res.status(200).json({
      success: true,
      data: {
        cards: {
          totalInvestments: totalInvestmentsAmount,
          activeInvestments: activeInvestmentsAmount,
          totalRoiEarned: user.totalRoiEarned,
          totalLevelIncomeEarned: user.totalLevelIncomeEarned,
          walletBalance: user.walletBalance,
          dailyRoiEstimate: Number(currentDailyRoiEstimate.toFixed(2)),
          directReferralsCount,
          activeInvestmentsCount: activeInvestments.length,
          totalInvestmentsCount: investments.length
        },
        referralCode: user.referralCode,
        charts: {
          earningsChartData
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
