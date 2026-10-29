const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { protect } = require('../middlewares/auth');

router.get('/plans', investmentController.getPlans);
router.post('/', protect, investmentController.createInvestment);
router.get('/', protect, investmentController.getUserInvestments);

module.exports = router;
