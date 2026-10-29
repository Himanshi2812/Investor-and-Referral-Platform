const mongoose = require('mongoose');
const Investment = require('../models/Investment');
const User = require('../models/User');
const referralService = require('../services/referralService');
const { INVESTMENT_PLANS } = require('../config/constants');

/**
 * @desc    Get pre-configured investment plans
 * @route   GET /api/v1/investments/plans
 * @access  Public
 */
exports.getPlans = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: { plans: INVESTMENT_PLANS }
  });
};

/**
 * @desc    Create a new investment
 * @route   POST /api/v1/investments
 * @access  Private
 */
exports.createInvestment = async (req, res, next) => {
  let session = null;
  let isSessionStarted = false;

  try {
    const { amount, planId, customPlanName, customDurationDays, customDailyRoiPercentage } = req.body;
    const investAmount = Number(amount);

    if (!investAmount || investAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid investment amount.'
      });
    }

    // Determine plan details
    let selectedPlan = INVESTMENT_PLANS.find((p) => p.id === planId);
    let planName, durationDays, dailyRoiPercentage, description;

    if (selectedPlan) {
      if (investAmount < selectedPlan.minAmount || investAmount > selectedPlan.maxAmount) {
        return res.status(400).json({
          success: false,
          message: `Investment amount for ${selectedPlan.name} must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}.`
        });
      }
      planName = selectedPlan.name;
      durationDays = selectedPlan.durationDays;
      dailyRoiPercentage = selectedPlan.dailyRoiPercentage;
      description = selectedPlan.description;
    } else {
      // Allow custom plan parameters if supplied
      planName = customPlanName || 'Custom Growth Plan';
      durationDays = Number(customDurationDays) || 30;
      dailyRoiPercentage = Number(customDailyRoiPercentage) || 2.0;
      description = `Custom investment plan with ${dailyRoiPercentage}% daily ROI for ${durationDays} days.`;
    }

    // Check user's current wallet balance
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.walletBalance < investAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance ($${user.walletBalance}). Please deposit funds first.`
      });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Setup session for ACID guarantees if replica set is present
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      isSessionStarted = true;
    } catch (e) {
      session = null;
      isSessionStarted = false;
    }

    // 1. Deduct wallet balance from user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { walletBalance: -investAmount } },
      { new: true, session: isSessionStarted ? session : null }
    );

    // 2. Create Investment record
    const investment = new Investment({
      user: user._id,
      investmentAmount: investAmount,
      planDetails: {
        planName,
        durationDays,
        dailyRoiPercentage,
        description
      },
      startDate,
      endDate,
      dailyRoiPercentage,
      investmentStatus: 'Active'
    });

    await investment.save({ session: isSessionStarted ? session : null });

    // 3. Multi-level referral commission distribution
    const referralDistributions = await referralService.distributeReferralIncome({
      investment,
      investor: updatedUser,
      session: isSessionStarted ? session : null
    });

    if (isSessionStarted && session) {
      await session.commitTransaction();
    }

    return res.status(201).json({
      success: true,
      message: 'Investment created successfully and referral commissions credited.',
      data: {
        investment,
        walletBalance: updatedUser.walletBalance,
        referralDistributions
      }
    });
  } catch (error) {
    if (isSessionStarted && session) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    if (isSessionStarted && session) {
      session.endSession();
    }
  }
};

/**
 * @desc    View current user's investments
 * @route   GET /api/v1/investments
 * @access  Private
 */
exports.getUserInvestments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (status && ['Active', 'Completed', 'Cancelled'].includes(status)) {
      query.investmentStatus = status;
    }

    const skip = (page - 1) * limit;

    const [investments, total] = await Promise.all([
      Investment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Investment.countDocuments(query)
    ]);

    // Calculate aggregated totals
    const allUserInvestments = await Investment.find({ user: req.user._id }).lean();
    const totalInvested = allUserInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
    const activeInvested = allUserInvestments
      .filter((inv) => inv.investmentStatus === 'Active')
      .reduce((sum, inv) => sum + inv.investmentAmount, 0);

    return res.status(200).json({
      success: true,
      data: {
        investments,
        summary: {
          totalInvested,
          activeInvested,
          totalCount: allUserInvestments.length
        },
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
