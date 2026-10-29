const roiService = require('../services/roiService');

/**
 * @desc    Fetch ROI payout history for current user
 * @route   GET /api/v1/roi/history
 * @access  Private
 */
exports.getROIHistory = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const history = await roiService.getROIHistory(req.user._id, { page, limit });

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Manually trigger daily ROI processing (useful for testing & idempotency verification)
 * @route   POST /api/v1/cron/trigger-daily-roi
 * @access  Private
 */
exports.triggerDailyROI = async (req, res, next) => {
  try {
    const { dateString } = req.body;
    // Allow optional dateString format 'YYYY-MM-DD'
    const result = await roiService.processDailyROI(dateString);

    return res.status(200).json({
      success: true,
      message: 'Daily ROI calculation executed successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
