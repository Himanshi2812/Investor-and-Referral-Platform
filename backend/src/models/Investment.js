const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    investmentAmount: {
      type: Number,
      required: [true, 'Investment amount is required'],
      min: [1, 'Investment amount must be at least 1']
    },
    planDetails: {
      planName: {
        type: String,
        required: [true, 'Plan name is required'],
        trim: true
      },
      durationDays: {
        type: Number,
        required: [true, 'Plan duration in days is required'],
        min: [1, 'Duration must be at least 1 day']
      },
      description: {
        type: String,
        default: ''
      }
    },
    startDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      index: true
    },
    dailyRoiPercentage: {
      type: Number,
      required: [true, 'Daily ROI percentage is required'],
      min: [0.01, 'Daily ROI percentage must be greater than 0']
    },
    investmentStatus: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active',
      index: true
    },
    totalRoiPaid: {
      type: Number,
      default: 0
    },
    lastRoiDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for high-throughput queries & cron scheduler performance
InvestmentSchema.index({ investmentStatus: 1, startDate: 1, endDate: 1 });
InvestmentSchema.index({ user: 1, investmentStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Investment', InvestmentSchema);
