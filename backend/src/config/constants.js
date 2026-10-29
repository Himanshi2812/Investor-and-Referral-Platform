module.exports = {
  // Referral commission hierarchy levels and percentage rates
  REFERRAL_TIERS: [
    { level: 1, percentage: 5.0 }, // Direct sponsor: 5%
    { level: 2, percentage: 3.0 }, // Level 2: 3%
    { level: 3, percentage: 1.0 }  // Level 3: 1%
  ],

  // Default pre-configured investment plans
  INVESTMENT_PLANS: [
    {
      id: 'starter',
      name: 'Starter Plan',
      minAmount: 50,
      maxAmount: 999,
      dailyRoiPercentage: 1.5,
      durationDays: 30,
      description: 'Ideal for beginners. 1.5% daily return for 30 calendar days.'
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      minAmount: 1000,
      maxAmount: 4999,
      dailyRoiPercentage: 2.0,
      durationDays: 45,
      description: 'Accelerated growth. 2.0% daily return for 45 calendar days.'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      minAmount: 5000,
      maxAmount: 50000,
      dailyRoiPercentage: 2.5,
      durationDays: 60,
      description: 'Maximum yield. 2.5% daily return for 60 calendar days.'
    }
  ]
};
