const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Investment = require('./models/Investment');
const ReferralIncome = require('./models/ReferralIncome');
const ROIHistory = require('./models/ROIHistory');
const { INVESTMENT_PLANS } = require('./config/constants');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Promise.all([
      User.deleteMany({}),
      Investment.deleteMany({}),
      ReferralIncome.deleteMany({}),
      ROIHistory.deleteMany({})
    ]);

    console.log('[Seeder] Creating multi-tiered user network...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Root / Sponsor User: Alice
    const alice = await User.create({
      fullName: 'Alice Johnson',
      email: 'alice@nexachain.ai',
      mobileNumber: '+1234567890',
      password: hashedPassword,
      referralCode: 'NXALICE1',
      referredBy: null,
      walletBalance: 2450.5,
      totalRoiEarned: 350.5,
      totalLevelIncomeEarned: 1100.0,
      accountStatus: 'Active'
    });

    // 2. Direct downline of Alice: Bob (Level 1 to Alice)
    const bob = await User.create({
      fullName: 'Bob Smith',
      email: 'bob@nexachain.ai',
      mobileNumber: '+1234567891',
      password: hashedPassword,
      referralCode: 'NXBOB222',
      referredBy: alice._id,
      walletBalance: 1200.0,
      totalRoiEarned: 200.0,
      totalLevelIncomeEarned: 400.0,
      accountStatus: 'Active'
    });

    // 3. Direct downline of Bob: Charlie (Level 2 to Alice, Level 1 to Bob)
    const charlie = await User.create({
      fullName: 'Charlie Davis',
      email: 'charlie@nexachain.ai',
      mobileNumber: '+1234567892',
      password: hashedPassword,
      referralCode: 'NXCHAR33',
      referredBy: bob._id,
      walletBalance: 850.0,
      totalRoiEarned: 150.0,
      totalLevelIncomeEarned: 100.0,
      accountStatus: 'Active'
    });

    // 4. Direct downline of Charlie: David (Level 3 to Alice, Level 2 to Bob, Level 1 to Charlie)
    const david = await User.create({
      fullName: 'David Wilson',
      email: 'david@nexachain.ai',
      mobileNumber: '+1234567893',
      password: hashedPassword,
      referralCode: 'NXDAVE44',
      referredBy: charlie._id,
      walletBalance: 500.0,
      totalRoiEarned: 50.0,
      totalLevelIncomeEarned: 0.0,
      accountStatus: 'Active'
    });

    // 5. Direct downline of Alice: Emma (Level 1 to Alice)
    const emma = await User.create({
      fullName: 'Emma Watson',
      email: 'emma@nexachain.ai',
      mobileNumber: '+1234567894',
      password: hashedPassword,
      referralCode: 'NXEMMA55',
      referredBy: alice._id,
      walletBalance: 3200.0,
      totalRoiEarned: 420.0,
      totalLevelIncomeEarned: 0.0,
      accountStatus: 'Active'
    });

    console.log('[Seeder] Creating realistic active and matured investments...');

    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Alice's Investment
    const aliceInv = await Investment.create({
      user: alice._id,
      investmentAmount: 5000,
      planDetails: {
        planName: 'Enterprise Plan',
        durationDays: 60,
        dailyRoiPercentage: 2.5,
        description: 'Maximum yield tier'
      },
      startDate: tenDaysAgo,
      endDate: thirtyDaysLater,
      dailyRoiPercentage: 2.5,
      investmentStatus: 'Active',
      totalRoiPaid: 1250,
      lastRoiDate: now
    });

    // Bob's Investment (Triggers Level 1 commission to Alice: 5% of $2,000 = $100)
    const bobInv = await Investment.create({
      user: bob._id,
      investmentAmount: 2000,
      planDetails: {
        planName: 'Growth Plan',
        durationDays: 45,
        dailyRoiPercentage: 2.0,
        description: 'Accelerated growth tier'
      },
      startDate: tenDaysAgo,
      endDate: thirtyDaysLater,
      dailyRoiPercentage: 2.0,
      investmentStatus: 'Active',
      totalRoiPaid: 400,
      lastRoiDate: now
    });

    // Charlie's Investment (Triggers Level 1 to Bob: $50, Level 2 to Alice: 3% of $1,000 = $30)
    const charlieInv = await Investment.create({
      user: charlie._id,
      investmentAmount: 1000,
      planDetails: {
        planName: 'Growth Plan',
        durationDays: 45,
        dailyRoiPercentage: 2.0,
        description: 'Accelerated growth tier'
      },
      startDate: tenDaysAgo,
      endDate: thirtyDaysLater,
      dailyRoiPercentage: 2.0,
      investmentStatus: 'Active',
      totalRoiPaid: 200,
      lastRoiDate: now
    });

    // David's Investment (Triggers L1 to Charlie: $25, L2 to Bob: $15, L3 to Alice: 1% of $500 = $5)
    const davidInv = await Investment.create({
      user: david._id,
      investmentAmount: 500,
      planDetails: {
        planName: 'Starter Plan',
        durationDays: 30,
        dailyRoiPercentage: 1.5,
        description: 'Starter tier'
      },
      startDate: tenDaysAgo,
      endDate: thirtyDaysLater,
      dailyRoiPercentage: 1.5,
      investmentStatus: 'Active',
      totalRoiPaid: 75,
      lastRoiDate: now
    });

    // Emma's Investment (Triggers L1 to Alice: 5% of $3,000 = $150)
    const emmaInv = await Investment.create({
      user: emma._id,
      investmentAmount: 3000,
      planDetails: {
        planName: 'Growth Plan',
        durationDays: 45,
        dailyRoiPercentage: 2.0,
        description: 'Accelerated growth tier'
      },
      startDate: tenDaysAgo,
      endDate: thirtyDaysLater,
      dailyRoiPercentage: 2.0,
      investmentStatus: 'Active',
      totalRoiPaid: 600,
      lastRoiDate: now
    });

    console.log('[Seeder] Creating Referral Income audit records...');

    await ReferralIncome.insertMany([
      {
        recipientUser: alice._id,
        sourceUser: bob._id,
        investment: bobInv._id,
        referralLevel: 1,
        commissionPercentage: 5.0,
        incomeAmount: 100.0,
        date: tenDaysAgo
      },
      {
        recipientUser: alice._id,
        sourceUser: charlie._id,
        investment: charlieInv._id,
        referralLevel: 2,
        commissionPercentage: 3.0,
        incomeAmount: 30.0,
        date: tenDaysAgo
      },
      {
        recipientUser: alice._id,
        sourceUser: david._id,
        investment: davidInv._id,
        referralLevel: 3,
        commissionPercentage: 1.0,
        incomeAmount: 5.0,
        date: tenDaysAgo
      },
      {
        recipientUser: alice._id,
        sourceUser: emma._id,
        investment: emmaInv._id,
        referralLevel: 1,
        commissionPercentage: 5.0,
        incomeAmount: 150.0,
        date: tenDaysAgo
      },
      {
        recipientUser: bob._id,
        sourceUser: charlie._id,
        investment: charlieInv._id,
        referralLevel: 1,
        commissionPercentage: 5.0,
        incomeAmount: 50.0,
        date: tenDaysAgo
      },
      {
        recipientUser: bob._id,
        sourceUser: david._id,
        investment: davidInv._id,
        referralLevel: 2,
        commissionPercentage: 3.0,
        incomeAmount: 15.0,
        date: tenDaysAgo
      },
      {
        recipientUser: charlie._id,
        sourceUser: david._id,
        investment: davidInv._id,
        referralLevel: 1,
        commissionPercentage: 5.0,
        incomeAmount: 25.0,
        date: tenDaysAgo
      }
    ]);

    console.log('[Seeder] Generating ROI History records for past 7 days...');

    const roiRecords = [];
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const historyDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const dateString = historyDate.toISOString().split('T')[0];

      roiRecords.push({
        user: alice._id,
        investment: aliceInv._id,
        roiAmount: (5000 * 2.5) / 100, // $125
        roiPercentage: 2.5,
        date: historyDate,
        dateString,
        status: 'Credited'
      });

      roiRecords.push({
        user: bob._id,
        investment: bobInv._id,
        roiAmount: (2000 * 2.0) / 100, // $40
        roiPercentage: 2.0,
        date: historyDate,
        dateString,
        status: 'Credited'
      });
    }

    await ROIHistory.insertMany(roiRecords);

    console.log('====================================================');
    console.log('[Seeder] Database successfully seeded with demo data!');
    console.log('Primary Demo Credentials:');
    console.log('  Email:    alice@nexachain.ai');
    console.log('  Password: password123');
    console.log('  Referral: NXALICE1');
    console.log('Downline accounts:');
    console.log('  bob@nexachain.ai / password123');
    console.log('  charlie@nexachain.ai / password123');
    console.log('  david@nexachain.ai / password123');
    console.log('  emma@nexachain.ai / password123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedData();
