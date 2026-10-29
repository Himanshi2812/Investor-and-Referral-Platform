const User = require('../models/User');
const ReferralIncome = require('../models/ReferralIncome');
const Investment = require('../models/Investment');
const { REFERRAL_TIERS } = require('../config/constants');

class ReferralService {
  /**
   * Distribute multi-level referral commissions upon a new investment.
   * Traverses upline hierarchy and atomically updates balances.
   *
   * @param {Object} params
   * @param {Object} params.investment - Mongoose Investment document
   * @param {Object} params.investor - Mongoose User document of the investor
   * @param {Object} [params.session=null] - Optional Mongoose ClientSession for ACID transactions
   * @returns {Promise<Array>} Array of distributed commission records
   */
  async distributeReferralIncome({ investment, investor, session = null }) {
    const distributedLogs = [];

    // If user has no sponsor, there are no uplines to credit
    if (!investor.referredBy) {
      return distributedLogs;
    }

    let currentReferrerId = investor.referredBy;

    for (const tier of REFERRAL_TIERS) {
      if (!currentReferrerId) break;

      const parentUser = await User.findById(currentReferrerId).session(session);

      if (!parentUser) break;

      // Only credit active accounts
      if (parentUser.accountStatus === 'Active') {
        const commissionAmount = Number(
          ((investment.investmentAmount * tier.percentage) / 100).toFixed(4)
        );

        if (commissionAmount > 0) {
          // Idempotency check: Ensure commission hasn't already been distributed for this investment & level
          const existingCommission = await ReferralIncome.findOne({
            investment: investment._id,
            referralLevel: tier.level
          }).session(session);

          if (!existingCommission) {
            // 1. Record referral income ledger entry
            const incomeRecord = new ReferralIncome({
              recipientUser: parentUser._id,
              sourceUser: investor._id,
              investment: investment._id,
              referralLevel: tier.level,
              commissionPercentage: tier.percentage,
              incomeAmount: commissionAmount,
              date: new Date()
            });

            await incomeRecord.save({ session });

            // 2. Atomically update parent wallet balance and total level income
            await User.findByIdAndUpdate(
              parentUser._id,
              {
                $inc: {
                  walletBalance: commissionAmount,
                  totalLevelIncomeEarned: commissionAmount
                }
              },
              { session, runValidators: true }
            );

            distributedLogs.push({
              level: tier.level,
              recipient: parentUser._id,
              recipientEmail: parentUser.email,
              amount: commissionAmount,
              percentage: tier.percentage
            });
          }
        }
      }

      // Traverse up to next level in the hierarchy
      currentReferrerId = parentUser.referredBy;
    }

    return distributedLogs;
  }

  /**
   * Fetch Level 1 Direct Referrals for a user
   *
   * @param {string} userId
   * @returns {Promise<Array>} Direct referrals with active investment aggregates
   */
  async getDirectReferrals(userId) {
    const directUsers = await User.find({ referredBy: userId })
      .select('fullName email mobileNumber walletBalance totalRoiEarned accountStatus createdAt')
      .lean();

    // Enrich each direct referral with their investment statistics
    const enriched = await Promise.all(
      directUsers.map(async (refUser) => {
        const investments = await Investment.find({ user: refUser._id })
          .select('investmentAmount investmentStatus createdAt')
          .lean();

        const totalInvested = investments.reduce(
          (sum, inv) => sum + inv.investmentAmount,
          0
        );

        const activeCount = investments.filter(
          (inv) => inv.investmentStatus === 'Active'
        ).length;

        return {
          ...refUser,
          totalInvested,
          activeInvestmentsCount: activeCount,
          totalInvestmentsCount: investments.length
        };
      })
    );

    return enriched;
  }

  /**
   * Recursively fetch complete referral tree up to specified depth
   *
   * @param {string} userId
   * @param {number} [maxDepth=3]
   * @returns {Promise<Object>} Nested hierarchy node
   */
  async getReferralTree(userId, maxDepth = 3) {
    const rootUser = await User.findById(userId)
      .select('fullName email referralCode createdAt accountStatus')
      .lean();

    if (!rootUser) {
      throw new Error('User not found');
    }

    const buildTree = async (currentUserId, currentDepth) => {
      if (currentDepth > maxDepth) return [];

      const children = await User.find({ referredBy: currentUserId })
        .select('fullName email referralCode createdAt accountStatus walletBalance')
        .lean();

      const enrichedChildren = await Promise.all(
        children.map(async (child) => {
          const investments = await Investment.find({ user: child._id })
            .select('investmentAmount investmentStatus')
            .lean();

          const totalInvested = investments.reduce(
            (sum, inv) => sum + inv.investmentAmount,
            0
          );

          const subTree = await buildTree(child._id, currentDepth + 1);

          return {
            _id: child._id,
            fullName: child.fullName,
            email: child.email,
            referralCode: child.referralCode,
            joinedAt: child.createdAt,
            accountStatus: child.accountStatus,
            level: currentDepth,
            totalInvested,
            childrenCount: children.length,
            children: subTree
          };
        })
      );

      return enrichedChildren;
    };

    const tree = await buildTree(rootUser._id, 1);

    return {
      _id: rootUser._id,
      fullName: rootUser.fullName,
      email: rootUser.email,
      referralCode: rootUser.referralCode,
      joinedAt: rootUser.createdAt,
      accountStatus: rootUser.accountStatus,
      level: 0,
      children: tree
    };
  }

  /**
   * Get paginated referral income history for a recipient
   *
   * @param {string} userId
   * @param {Object} queryOptions
   * @returns {Promise<Object>} Paginated records and totals
   */
  async getReferralIncomeHistory(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ReferralIncome.find({ recipientUser: userId })
        .populate('sourceUser', 'fullName email')
        .populate('investment', 'investmentAmount planDetails.planName')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReferralIncome.countDocuments({ recipientUser: userId })
    ]);

    return {
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    };
  }
}

module.exports = new ReferralService();
