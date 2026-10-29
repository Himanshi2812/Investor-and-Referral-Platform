const referralService = require('../services/referralService');

/**
 * @desc    Fetch direct referrals (Level 1)
 * @route   GET /api/v1/referrals/direct
 * @access  Private
 */
exports.getDirectReferrals = async (req, res, next) => {
  try {
    const directReferrals = await referralService.getDirectReferrals(req.user._id);
    return res.status(200).json({
      success: true,
      data: {
        count: directReferrals.length,
        referrals: directReferrals
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch complete referral tree in nested hierarchy format
 * @route   GET /api/v1/referrals/tree
 * @access  Private
 */
exports.getReferralTree = async (req, res, next) => {
  try {
    const depth = Number(req.query.depth) || 4;
    const tree = await referralService.getReferralTree(req.user._id, depth);

    return res.status(200).json({
      success: true,
      data: { tree }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch referral income transaction history
 * @route   GET /api/v1/referrals/history
 * @access  Private
 */
exports.getReferralHistory = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const history = await referralService.getReferralIncomeHistory(req.user._id, {
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};
