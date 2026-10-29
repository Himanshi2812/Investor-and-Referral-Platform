const cron = require('node-cron');
const roiService = require('../services/roiService');

let isCronRunning = false;

/**
 * Initializes the automated Daily ROI Scheduler.
 * Configured to run every midnight at 12:00 AM (0 0 * * *).
 */
const initRoiCron = () => {
  // Cron expression: '0 0 * * *' = At 00:00 (midnight) every day
  const cronSchedule = process.env.ROI_CRON_SCHEDULE || '0 0 * * *';

  console.log(`[Scheduler] Initializing Daily ROI Cron Job with schedule: "${cronSchedule}"...`);

  cron.schedule(cronSchedule, async () => {
    if (isCronRunning) {
      console.warn('[Scheduler] Previous ROI calculation job still executing. Skipping concurrent trigger.');
      return;
    }

    try {
      isCronRunning = true;
      console.log(`[Scheduler] Starting scheduled Daily ROI job at ${new Date().toISOString()}`);

      const summary = await roiService.processDailyROI();

      console.log('[Scheduler] Daily ROI job finished successfully:', summary);
    } catch (error) {
      console.error('[Scheduler Error] Critical error during scheduled daily ROI execution:', error);
    } finally {
      isCronRunning = false;
    }
  });

  console.log('[Scheduler] Daily ROI Cron registered and active.');
};

module.exports = { initRoiCron };
