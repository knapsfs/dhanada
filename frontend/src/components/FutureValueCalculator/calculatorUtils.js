export const formatIndianCurrency = (value) => {
  if (isNaN(value) || value === null || value === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const calculateFutureValue = ({ pv, pmt, annualRate, years, frequency, timing, isInflationAdjusted = false, inflationRate = 5 }) => {
  const isMonthly = frequency === 'monthly';
  const n = isMonthly ? years * 12 : years;
  const r = isMonthly ? annualRate / 100 / 12 : annualRate / 100;
  
  let fv = 0;
  
  if (r === 0) {
    fv = pv + (pmt * n);
  } else {
    // FV of present value
    const fvPv = pv * Math.pow(1 + r, n);
    
    // FV of recurring payment (ordinary annuity - end of period)
    let fvPmt = pmt * ((Math.pow(1 + r, n) - 1) / r);
    
    // Adjust for annuity due (beginning of period)
    if (timing === 'beginning') {
      fvPmt = fvPmt * (1 + r);
    }
    
    fv = fvPv + fvPmt;
  }
  
  const totalInvested = pv + (pmt * n);

  let finalFv = fv;
  if (isInflationAdjusted && years > 0) {
    const infRate = inflationRate / 100;
    finalFv = fv / Math.pow(1 + infRate, years);
  }
  
  const potentialGrowth = Math.max(0, finalFv - totalInvested);
  
  return {
    futureValue: Math.round(finalFv),
    nominalFutureValue: Math.round(fv),
    totalInvested: Math.round(totalInvested),
    potentialGrowth: Math.round(potentialGrowth),
    periodicRate: r,
    periods: n,
    frequency,
    isInflationAdjusted
  };
};

export const calculateRequiredInvestment = ({ targetFv, pv, annualRate, years, frequency, timing, isInflationAdjusted = false, inflationRate = 5 }) => {
  const isMonthly = frequency === 'monthly';
  const n = isMonthly ? years * 12 : years;
  const r = isMonthly ? annualRate / 100 / 12 : annualRate / 100;

  // If targetFv is adjusted for inflation (target in today's money), future target needed will be targetFv * (1 + i)^years
  let effectiveTargetFv = targetFv;
  if (isInflationAdjusted && years > 0) {
    const infRate = inflationRate / 100;
    effectiveTargetFv = targetFv * Math.pow(1 + infRate, years);
  }

  let pmt = 0;

  if (r === 0) {
    pmt = (effectiveTargetFv - pv) / n;
  } else {
    const fvPv = pv * Math.pow(1 + r, n);
    const targetPmtPortion = effectiveTargetFv - fvPv;

    if (targetPmtPortion <= 0) {
      // PV alone exceeds target FV, no PMT needed
      pmt = 0;
    } else {
      let denominator = ((Math.pow(1 + r, n) - 1) / r);
      if (timing === 'beginning') {
        denominator = denominator * (1 + r);
      }
      pmt = targetPmtPortion / denominator;
    }
  }

  const roundedPmt = Math.max(0, Math.round(pmt));
  const totalInvested = pv + (roundedPmt * n);
  
  // Recalculate true FV based on rounded PMT to avoid mismatch
  const calcData = calculateFutureValue({ 
    pv, 
    pmt: roundedPmt, 
    annualRate, 
    years, 
    frequency, 
    timing,
    isInflationAdjusted,
    inflationRate
  });

  return {
    requiredPmt: roundedPmt,
    futureValue: calcData.futureValue,
    nominalFutureValue: calcData.nominalFutureValue,
    totalInvested: Math.round(totalInvested),
    potentialGrowth: calcData.potentialGrowth,
    periodicRate: r,
    periods: n,
    frequency,
    isInflationAdjusted
  };
};

export const generateChartData = ({ calcMode, targetFv, pv, pmt, annualRate, years, frequency, timing, isInflationAdjusted = false, inflationRate = 5 }) => {
  const labels = [];
  const investedData = [];
  const growthData = [];
  const fvData = [];
  
  // If we are in calculate PMT mode, first solve for PMT so the chart builds up correctly
  let actualPmt = pmt;
  if (calcMode === 'pmt') {
    const req = calculateRequiredInvestment({ targetFv, pv, annualRate, years, frequency, timing, isInflationAdjusted, inflationRate });
    actualPmt = req.requiredPmt;
  }

  const numYears = Math.max(1, Math.round(years));

  // Create yearly data points for the chart matching Y1, Y2, Y3 format
  for (let y = 1; y <= numYears; y++) {
    labels.push(`Y${y}`);
    
    // Calculate values at this specific year
    const dataAtYear = calculateFutureValue({ 
      pv, 
      pmt: actualPmt, 
      annualRate, 
      years: y, 
      frequency, 
      timing,
      isInflationAdjusted,
      inflationRate
    });
    
    investedData.push(dataAtYear.totalInvested);
    growthData.push(dataAtYear.potentialGrowth);
    fvData.push(dataAtYear.futureValue);
  }
  
  return {
    labels,
    investedData,
    growthData,
    fvData
  };
};