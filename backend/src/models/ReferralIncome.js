const mongoose = require('mongoose');

const ReferralIncomeSchema = new mongoose.Schema(
  {
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user reference is required'],
      index: true
    },
    sourceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Source user reference is required'],
      index: true
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: [true, 'Investment reference is required'],
      index: true
    },
    referralLevel: {
      type: Number,
      required: [true, 'Referral level is required'],
      min: [1, 'Level must be at least 1']
    },
    commissionPercentage: {
      type: Number,
      required: [true, 'Commission percentage is required']
    },
    incomeAmount: {
      type: Number,
      required: [true, 'Income amount is required'],
      min: [0, 'Income amount cannot be negative']
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for query performance and preventing duplicate payouts for same investment & level
ReferralIncomeSchema.index({ recipientUser: 1, date: -1 });
ReferralIncomeSchema.index({ investment: 1, referralLevel: 1 }, { unique: true });

module.exports = mongoose.model('ReferralIncome', ReferralIncomeSchema);
