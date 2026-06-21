export type RiskGrade = 'CLEAR' | 'THRESHOLD_1' | 'THRESHOLD_2' | 'THRESHOLD_3' | 'PENDING';

export interface MetricAssessment {
  value: number | undefined;
  status: RiskGrade;
  headroomBps: number | undefined; // Positive means headroom, negative means breach
  thresholdInfo: string;
  label: string;
  minRequired: number;
}

export interface BankAssessment {
  name: string;
  ticker: string;
  type: string;
  crar: MetricAssessment;
  cet1: MetricAssessment;
  netNpa: MetricAssessment;
  leverage: MetricAssessment;
  overallStatus: RiskGrade;
  hasPendingData: boolean;
}

// D-SIBs list under RBI
const D_SIBS_TICKERS = ['SBIN', 'HDFCBANK', 'ICICIBANK'];

/**
 * Checks if a bank ticker corresponds to a Domestic Systemically Important Bank (D-SIB)
 */
export function isDSib(ticker: string): boolean {
  return D_SIBS_TICKERS.includes(ticker.toUpperCase());
}

/**
 * Assesses the CRAR metric
 * Minimum requirement: 11.50% (9.0% total capital + 2.5% CCB)
 */
export function assessCrar(crar: number | undefined): MetricAssessment {
  const minRequired = 11.50;
  const label = "CRAR (Capital to Risk-Weighted Assets)";
  
  if (crar === undefined) {
    return {
      value: undefined,
      status: 'PENDING',
      headroomBps: undefined,
      thresholdInfo: 'Data Pending',
      label,
      minRequired
    };
  }

  const headroomBps = Math.round((crar - minRequired) * 100);
  let status: RiskGrade = 'CLEAR';
  let thresholdInfo = `Threshold 1 triggers below 11.50% (9.00% + 2.50% CCB) — ${headroomBps} bps of headroom`;

  if (crar < 11.50) {
    if (crar >= 9.00) {
      status = 'THRESHOLD_1';
      thresholdInfo = `Threshold 1 breached by ${Math.abs(headroomBps)} bps (CRAR < 11.50% but ≥ 9.00%)`;
    } else if (crar >= 7.50) {
      status = 'THRESHOLD_2';
      thresholdInfo = `Threshold 2 breached by ${Math.abs(headroomBps)} bps (CRAR < 9.00% but ≥ 7.50%)`;
    } else {
      status = 'THRESHOLD_3';
      thresholdInfo = `Threshold 3 breached by ${Math.abs(headroomBps)} bps (CRAR < 7.50%)`;
    }
  }

  return { value: crar, status, headroomBps, thresholdInfo, label, minRequired };
}

/**
 * Assesses the CET1 metric
 * Minimum requirement: 8.00% (5.5% CET1 + 2.5% CCB)
 */
export function assessCet1(cet1: number | undefined): MetricAssessment {
  const minRequired = 8.00;
  const label = "CET1 (Common Equity Tier 1)";

  if (cet1 === undefined) {
    return {
      value: undefined,
      status: 'PENDING',
      headroomBps: undefined,
      thresholdInfo: 'Data Pending',
      label,
      minRequired
    };
  }

  const headroomBps = Math.round((cet1 - minRequired) * 100);
  let status: RiskGrade = 'CLEAR';
  let thresholdInfo = `Threshold 1 triggers below 8.00% (5.50% + 2.50% CCB) — ${headroomBps} bps of headroom`;

  if (cet1 < 8.00) {
    if (cet1 >= 5.50) {
      status = 'THRESHOLD_1';
      thresholdInfo = `Threshold 1 breached by ${Math.abs(headroomBps)} bps (CET1 < 8.00% but ≥ 5.50%)`;
    } else if (cet1 >= 4.00) {
      status = 'THRESHOLD_2';
      thresholdInfo = `Threshold 2 breached by ${Math.abs(headroomBps)} bps (CET1 < 5.50% but ≥ 4.00%)`;
    } else {
      status = 'THRESHOLD_3';
      thresholdInfo = `Threshold 3 breached by ${Math.abs(headroomBps)} bps (CET1 < 4.00%)`;
    }
  }

  return { value: cet1, status, headroomBps, thresholdInfo, label, minRequired };
}

/**
 * Assesses the Net NPA Asset Quality metric
 * Lower is better. Thresholds trigger when Net NPA is elevated.
 * Threshold 1: Net NPA >= 6.00% and < 9.00%
 * Threshold 2: Net NPA >= 9.00% and < 12.00%
 * Threshold 3: Net NPA >= 12.00%
 */
export function assessNetNpa(netNpa: number | undefined): MetricAssessment {
  const minRequired = 6.00; // This is the trigger line (lower is better, so it's a upper limit)
  const label = "Net NPA Ratio (Asset Quality)";

  if (netNpa === undefined) {
    return {
      value: undefined,
      status: 'PENDING',
      headroomBps: undefined,
      thresholdInfo: 'Data Pending',
      label,
      minRequired
    };
  }

  // Headroom is defined as how far below 6.00% it is
  const headroomBps = Math.round((6.00 - netNpa) * 100);
  let status: RiskGrade = 'CLEAR';
  let thresholdInfo = `Threshold 1 triggers at 6.00% — ${headroomBps} bps of headroom`;

  if (netNpa >= 6.00) {
    if (netNpa < 9.00) {
      status = 'THRESHOLD_1';
      thresholdInfo = `Threshold 1 breached by ${Math.abs(headroomBps)} bps (Net NPA ≥ 6.00% but < 9.00%)`;
    } else if (netNpa < 12.00) {
      status = 'THRESHOLD_2';
      thresholdInfo = `Threshold 2 breached by ${Math.abs(headroomBps)} bps (Net NPA ≥ 9.00% but < 12.00%)`;
    } else {
      status = 'THRESHOLD_3';
      thresholdInfo = `Threshold 3 breached by ${Math.abs(headroomBps)} bps (Net NPA ≥ 12.00%)`;
    }
  }

  return { value: netNpa, status, headroomBps, thresholdInfo, label, minRequired };
}

/**
 * Assesses the Tier 1 Leverage Ratio
 * Minimum requirement: 4.00% for D-SIBs, 3.50% for other banks
 * Threshold 1: Up to 50 bps below regulatory minimum
 * Threshold 2: 50 to 100 bps below regulatory minimum
 * Threshold 3: More than 100 bps below regulatory minimum
 */
export function assessLeverage(leverage: number | undefined, ticker: string): MetricAssessment {
  const minRequired = isDSib(ticker) ? 4.00 : 3.50;
  const label = "Tier-1 Leverage Ratio";

  if (leverage === undefined) {
    return {
      value: undefined,
      status: 'PENDING',
      headroomBps: undefined,
      thresholdInfo: 'Data Pending',
      label,
      minRequired
    };
  }

  const headroomBps = Math.round((leverage - minRequired) * 100);
  let status: RiskGrade = 'CLEAR';
  let thresholdInfo = `Threshold 1 triggers below ${minRequired.toFixed(2)}% (D-SIB minimum) — ${headroomBps} bps of headroom`;

  if (!isDSib(ticker)) {
    thresholdInfo = `Threshold 1 triggers below ${minRequired.toFixed(2)}% (Standard minimum) — ${headroomBps} bps of headroom`;
  }

  if (leverage < minRequired) {
    const breachBps = Math.abs(headroomBps);
    if (breachBps <= 50) {
      status = 'THRESHOLD_1';
      thresholdInfo = `Threshold 1 breached by ${breachBps} bps (Leverage < ${minRequired.toFixed(2)}%)`;
    } else if (breachBps <= 100) {
      status = 'THRESHOLD_2';
      thresholdInfo = `Threshold 2 breached by ${breachBps} bps (Leverage < ${(minRequired - 0.5).toFixed(2)}%)`;
    } else {
      status = 'THRESHOLD_3';
      thresholdInfo = `Threshold 3 breached by ${breachBps} bps (Leverage < ${(minRequired - 1.0).toFixed(2)}%)`;
    }
  }

  return { value: leverage, status, headroomBps, thresholdInfo, label, minRequired };
}

/**
 * Performs full assessment for a bank based on raw data
 */
export function assessBank(rawBank: {
  name: string;
  ticker: string;
  type: string;
  crar?: number;
  cet1?: number;
  netNpaRatio?: number;
  leverageRatio?: number; // Potential future field
}): BankAssessment {
  const crarAssess = assessCrar(rawBank.crar);
  const cet1Assess = assessCet1(rawBank.cet1);
  const netNpaAssess = assessNetNpa(rawBank.netNpaRatio);
  const leverageAssess = assessLeverage(rawBank.leverageRatio, rawBank.ticker);

  // Capital overall status is the worse of CRAR and CET1
  const capitalStatus = getWorseGrade(crarAssess.status, cet1Assess.status);
  const assetQualityStatus = netNpaAssess.status;
  const leverageStatus = leverageAssess.status;

  // Numerical mapping for severity evaluation
  const severityScore = (grade: RiskGrade): number => {
    switch (grade) {
      case 'CLEAR': return 0;
      case 'PENDING': return 0; // Pending doesn't indicate a positive breach
      case 'THRESHOLD_1': return 1;
      case 'THRESHOLD_2': return 2;
      case 'THRESHOLD_3': return 3;
      default: return 0;
    }
  };

  const capScore = severityScore(capitalStatus);
  const aqScore = severityScore(assetQualityStatus);
  const levScore = severityScore(leverageStatus);

  const scores = [capScore, aqScore, levScore];
  const maxScore = Math.max(...scores);

  let overallStatus: RiskGrade = 'CLEAR';
  
  // RBI framework rule implementation:
  // "A bank breaching Threshold 3 on any parameter, or Threshold 2 on two or more parameters,
  // is generally considered for more severe/mandatory action (equivalent to Threshold 3)"
  const countThreshold2OrWorse = scores.filter(s => s >= 2).length;

  if (maxScore === 3 || countThreshold2OrWorse >= 2) {
    overallStatus = 'THRESHOLD_3';
  } else if (maxScore === 2) {
    overallStatus = 'THRESHOLD_2';
  } else if (maxScore === 1) {
    overallStatus = 'THRESHOLD_1';
  }

  const hasPendingData = [crarAssess.status, cet1Assess.status, netNpaAssess.status, leverageAssess.status].includes('PENDING');

  return {
    name: rawBank.name,
    ticker: rawBank.ticker,
    type: rawBank.type,
    crar: crarAssess,
    cet1: cet1Assess,
    netNpa: netNpaAssess,
    leverage: leverageAssess,
    overallStatus,
    hasPendingData
  };
}

/**
 * Returns the worse of two risk grades
 */
export function getWorseGrade(g1: RiskGrade, g2: RiskGrade): RiskGrade {
  const ranking = {
    'CLEAR': 0,
    'PENDING': 1,
    'THRESHOLD_1': 2,
    'THRESHOLD_2': 3,
    'THRESHOLD_3': 4
  };
  
  return ranking[g1] > ranking[g2] ? g1 : g2;
}
