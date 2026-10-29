const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { protect } = require('../middlewares/auth');

router.get('/direct', protect, referralController.getDirectReferrals);
router.get('/tree', protect, referralController.getReferralTree);
router.get('/history', protect, referralController.getReferralHistory);

module.exports = router;
