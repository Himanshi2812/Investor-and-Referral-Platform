const mongoose = require('mongoose');

const ROIHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: [true, 'Investment reference is required'],
      index: true
    },
    roiAmount: {
      type: Number,
      required: [true, 'ROI amount is required'],
      min: [0, 'ROI amount cannot be negative']
    },
    roiPercentage: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      index: true
    },
    // dateString in 'YYYY-MM-DD' format guarantees calendar-day idempotency
    dateString: {
      type: String,
      required: [true, 'Date string identifier is required'],
      index: true
    },
    status: {
      type: String,
      enum: ['Credited', 'Failed', 'Pending'],
      default: 'Credited',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL SAFEGUARD: Compound unique index prevents duplicate daily ROI payouts if cron runs multiple times
ROIHistorySchema.index({ investment: 1, dateString: 1 }, { unique: true });
ROIHistorySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('ROIHistory', ROIHistorySchema);
