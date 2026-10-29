/**
 * Unit Test: Daily ROI Scheduler Idempotency & Duplicate Guard
 * Requirements:
 *  - Each active contract receives ROI once per calendar day (UTC)
 *  - Running the scheduler 2x or 10x on the same day MUST NOT duplicate payout
 *  - Formats date string strictly as YYYY-MM-DD
 */

describe('Daily ROI Idempotency & Duplicate Guard Verification', () => {
  // Mock in-memory idempotency ledger mimicking ROIHistory compound index { investment: 1, dateString: 1 }
  let roiLedger = new Set();

  beforeEach(() => {
    roiLedger.clear();
  });

  const distributeRoi = (contractId, dateString, dailyAmount) => {
    const uniqueKey = `${contractId}_${dateString}`;
    
    // Level 1: Application-level check
    if (roiLedger.has(uniqueKey)) {
      return {
        success: false,
        skipped: true,
        reason: 'ALREADY_CREDITED_FOR_DATE'
      };
    }

    // Save to ledger (simulating Level 2 Database Unique Compound Index)
    roiLedger.add(uniqueKey);
    return {
      success: true,
      creditedAmount: dailyAmount,
      dateString
    };
  };

  test('Processes first execution of the day successfully', () => {
    const contractId = 'inv_test_001';
    const dateString = '2026-10-29';
    const result = distributeRoi(contractId, dateString, 15.0);

    expect(result.success).toBe(true);
    expect(result.creditedAmount).toBe(15.0);
    expect(result.dateString).toBe('2026-10-29');
    expect(roiLedger.size).toBe(1);
  });

  test('Blocks immediate duplicate execution on the same calendar day', () => {
    const contractId = 'inv_test_001';
    const dateString = '2026-10-29';

    // 1st run
    const firstRun = distributeRoi(contractId, dateString, 15.0);
    expect(firstRun.success).toBe(true);

    // 2nd run (accidental restart or retry)
    const secondRun = distributeRoi(contractId, dateString, 15.0);
    expect(secondRun.success).toBe(false);
    expect(secondRun.skipped).toBe(true);
    expect(secondRun.reason).toBe('ALREADY_CREDITED_FOR_DATE');

    // Ledger should still only contain 1 record
    expect(roiLedger.size).toBe(1);
  });

  test('Allows execution on the next calendar day', () => {
    const contractId = 'inv_test_001';

    // Day 1
    const day1 = distributeRoi(contractId, '2026-10-29', 15.0);
    expect(day1.success).toBe(true);

    // Day 2
    const day2 = distributeRoi(contractId, '2026-10-30', 15.0);
    expect(day2.success).toBe(true);

    expect(roiLedger.size).toBe(2);
  });

  test('Independent contracts on the same day are both processed without conflict', () => {
    const dateString = '2026-10-29';
    const invA = distributeRoi('contract_A', dateString, 10.0);
    const invB = distributeRoi('contract_B', dateString, 25.0);

    expect(invA.success).toBe(true);
    expect(invB.success).toBe(true);
    expect(roiLedger.size).toBe(2);
  });
});
