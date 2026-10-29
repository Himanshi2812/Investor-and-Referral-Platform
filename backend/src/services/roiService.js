const mongoose = require('mongoose');
const Investment = require('../models/Investment');
const User = require('../models/User');
const ROIHistory = require('../models/ROIHistory');

class ROIService {
  /**
   * Helper to format a Date into standardized YYYY-MM-DD string
   * @param {Date} date
   * @returns {string} e.g. "2026-10-29"
   */
  getFormattedDateString(date = new Date()) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Process daily ROI for all active investments idempotently.
   * If executed multiple times on the same calendar day, duplicate payouts are strictly prevented.
   *
   * @param {string} [customDateString] - Optional YYYY-MM-DD for deterministic simulation/testing
   * @returns {Promise<Object>} Summary report of the daily execution
   */
  async processDailyROI(customDateString = null) {
    const today = new Date();
    const targetDateString = customDateString || this.getFormattedDateString(today);
    const targetDate = new Date(`${targetDateString}T00:00:00.000Z`);

    console.log(`[ROIService] Starting daily ROI processing for date: ${targetDateString}...`);

    // 1. Find all active investments eligible for ROI on target date
    // Eligible: status is 'Active', startDate <= end of today, endDate >= start of today
    const activeInvestments = await Investment.find({
      investmentStatus: 'Active',
      startDate: { $lte: today }
    }).populate('user');

    const summary = {
      targetDate: targetDateString,
      totalActiveInvestments: activeInvestments.length,
      processedCount: 0,
      skippedCount: 0,
      completedInvestmentsCount: 0,
      totalRoiDistributed: 0,
      errors: []
    };

    for (const investment of activeInvestments) {
      const invId = investment._id;
      const user = investment.user;

      if (!user || user.accountStatus !== 'Active') {
        summary.skippedCount++;
        continue;
      }

      // Check if investment has surpassed its end date
      const isPastEndDate = today > new Date(investment.endDate);

      // Idempotency Safeguard Level 1: Check if already credited for this dateString
      const alreadyCredited = await ROIHistory.exists({
        investment: invId,
        dateString: targetDateString
      });

      if (alreadyCredited) {
        summary.skippedCount++;
        // If expired and not yet marked completed, mark it
        if (isPastEndDate && investment.investmentStatus === 'Active') {
          await Investment.findByIdAndUpdate(invId, { investmentStatus: 'Completed' });
          summary.completedInvestmentsCount++;
        }
        continue;
      }

      // Calculate daily ROI
      const dailyRoiAmount = Number(
        ((investment.investmentAmount * investment.dailyRoiPercentage) / 100).toFixed(4)
      );

      // Attempt transaction if replica set is available, else atomic document updates
      let session = null;
      let isSessionStarted = false;

      try {
        session = await mongoose.startSession();
        session.startTransaction();
        isSessionStarted = true;
      } catch (sessErr) {
        // Standalone Mongo instances do not support sessions/transactions; proceed safely with fallbacks
        session = null;
        isSessionStarted = false;
      }

      try {
        // 1. Create ROI History record (Unique index guarantees Level 2 idempotency)
        const roiRecord = new ROIHistory({
          user: user._id,
          investment: invId,
          roiAmount: dailyRoiAmount,
          roiPercentage: investment.dailyRoiPercentage,
          date: targetDate,
          dateString: targetDateString,
          status: 'Credited'
        });

        await roiRecord.save(isSessionStarted ? { session } : {});

        // 2. Atomically credit user wallet balance and update total ROI earned
        await User.findByIdAndUpdate(
          user._id,
          {
            $inc: {
              walletBalance: dailyRoiAmount,
              totalRoiEarned: dailyRoiAmount
            }
          },
          isSessionStarted ? { session } : {}
        );

        // 3. Update investment total ROI paid and last ROI timestamp
        const updateData = {
          $inc: { totalRoiPaid: dailyRoiAmount },
          $set: { lastRoiDate: today }
        };

        // If investment matured, complete it
        if (isPastEndDate) {
          updateData.$set.investmentStatus = 'Completed';
          summary.completedInvestmentsCount++;
        }

        await Investment.findByIdAndUpdate(
          invId,
          updateData,
          isSessionStarted ? { session } : {}
        );

        if (isSessionStarted && session) {
          await session.commitTransaction();
        }

        summary.processedCount++;
        summary.totalRoiDistributed = Number(
          (summary.totalRoiDistributed + dailyRoiAmount).toFixed(4)
        );
      } catch (err) {
        if (isSessionStarted && session) {
          await session.abortTransaction();
        }

        // E11000 Duplicate Key error is caught cleanly as idempotency guard
        if (err.code === 11000) {
          summary.skippedCount++;
        } else {
          console.error(`[ROIService] Error processing investment ${invId}:`, err.message);
          summary.errors.push({ investmentId: invId, error: err.message });
        }
      } finally {
        if (isSessionStarted && session) {
          session.endSession();
        }
      }
    }

    console.log(`[ROIService] Daily ROI processing completed for ${targetDateString}. Distributed: $${summary.totalRoiDistributed} across ${summary.processedCount} investments.`);
    return summary;
  }

  /**
   * Get paginated ROI History for a user
   *
   * @param {string} userId
   * @param {Object} options
   * @returns {Promise<Object>} Paginated records and totals
   */
  async getROIHistory(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ROIHistory.find({ user: userId })
        .populate('investment', 'investmentAmount planDetails.planName')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ROIHistory.countDocuments({ user: userId })
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

module.exports = new ROIService();
