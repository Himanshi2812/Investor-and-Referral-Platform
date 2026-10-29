/**
 * Unit Test: 3-Tier Referral Commission Calculation & Business Rules
 * Requirements:
 *  - Level 1 Upline: 5% of investment
 *  - Level 2 Upline: 3% of investment
 *  - Level 3 Upline: 1% of investment
 *  - Level 4+ Upline: 0% (Strictly 3 levels only)
 */

describe('Referral Commission Engine Math', () => {
  const REFERRAL_RATES = {
    1: 5.0, // 5%
    2: 3.0, // 3%
    3: 1.0  // 1%
  };

  const calculateCommission = (investmentAmount, level) => {
    const rate = REFERRAL_RATES[level] || 0;
    if (rate === 0) return 0;
    return parseFloat(((investmentAmount * rate) / 100).toFixed(2));
  };

  test('Level 1 direct sponsor receives exact 5% commission on $1,000 investment', () => {
    const amount = 1000;
    const commission = calculateCommission(amount, 1);
    expect(commission).toBe(50.0);
  });

  test('Level 2 upline receives exact 3% commission on $1,000 investment', () => {
    const amount = 1000;
    const commission = calculateCommission(amount, 2);
    expect(commission).toBe(30.0);
  });

  test('Level 3 upline receives exact 1% commission on $1,000 investment', () => {
    const amount = 1000;
    const commission = calculateCommission(amount, 3);
    expect(commission).toBe(10.0);
  });

  test('Level 4 and beyond receive 0 commission (Strict 3-Tier Constraint)', () => {
    const amount = 1000;
    expect(calculateCommission(amount, 4)).toBe(0);
    expect(calculateCommission(amount, 5)).toBe(0);
    expect(calculateCommission(amount, 10)).toBe(0);
  });

  test('Handles fractional calculations accurately without floating point drift', () => {
    // $250.00 investment at 3% = 7.50
    const amount = 250.00;
    const commission = calculateCommission(amount, 2);
    expect(commission).toBe(7.50);
  });

  test('Cumulative payout of 3 tiers never exceeds 9% (5% + 3% + 1%)', () => {
    const amount = 5000;
    const l1 = calculateCommission(amount, 1);
    const l2 = calculateCommission(amount, 2);
    const l3 = calculateCommission(amount, 3);
    const total = l1 + l2 + l3;

    expect(total).toBe(450.0);
    expect(total / amount).toBe(0.09); // Exactly 9% platform commission budget
  });
});
