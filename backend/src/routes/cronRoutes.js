const express = require('express');
const router = express.Router();
const roiController = require('../controllers/roiController');
const { protect } = require('../middlewares/auth');

// Allow authenticated triggers to test and demonstrate idempotency
router.post('/trigger-daily-roi', protect, roiController.triggerDailyROI);

module.exports = router;
