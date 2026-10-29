const express = require('express');
const router = express.Router();
const roiController = require('../controllers/roiController');
const { protect } = require('../middlewares/auth');

router.get('/history', protect, roiController.getROIHistory);

module.exports = router;
