const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate signed JWT token
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'nexachain_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Helper to generate unique referral code
const generateReferralCode = () => {
  return 'NX' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, referralCode } = req.body;

    if (!fullName || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, mobile number, and password.'
      });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Validate referral code if provided
    let parentUser = null;
    if (referralCode && referralCode.trim()) {
      parentUser = await User.findOne({
        referralCode: referralCode.trim().toUpperCase()
      });

      if (!parentUser) {
        return res.status(400).json({
          success: false,
          message: `Invalid referral code: '${referralCode}'. Sponsor not found.`
        });
      }
    }

    // Generate unique referral code for the new user
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode();
      const duplicateCode = await User.findOne({ referralCode: newReferralCode });
      if (!duplicateCode) {
        isUnique = true;
      }
    }

    // Create user
    const user = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      mobileNumber,
      password,
      referralCode: newReferralCode,
      referredBy: parentUser ? parentUser._id : null,
      walletBalance: 1000 // Give initial starting balance for testing convenience
    });

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          walletBalance: user.walletBalance,
          totalRoiEarned: user.totalRoiEarned,
          totalLevelIncomeEarned: user.totalLevelIncomeEarned,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Check user exists with password included
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.accountStatus !== 'Active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus}. Access denied.`
      });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          walletBalance: user.walletBalance,
          totalRoiEarned: user.totalRoiEarned,
          totalLevelIncomeEarned: user.totalLevelIncomeEarned,
          accountStatus: user.accountStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('referredBy', 'fullName email referralCode');
    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deposit mock funds to wallet for testing
 * @route   POST /api/v1/auth/deposit
 * @access  Private
 */
exports.deposit = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid deposit amount greater than 0.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: depositAmount } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully credited $${depositAmount} to your wallet.`,
      data: {
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    next(error);
  }
};
