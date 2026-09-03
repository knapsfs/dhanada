export const formatIndianCurrency = (value) => {
	if (isNaN(value) || value === null || value === undefined) return "₹0";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(value);
};

export const calculateFutureValue = ({
	pv,
	pmt,
	annualRate,
	years,
	frequency,
	timing,
	isInflationAdjusted = false,
	inflationRate = 5,
}) => {
	const isMonthly = frequency === "monthly";
	const n = isMonthly ? years * 12 : years;
	const r = isMonthly ? annualRate / 100 / 12 : annualRate / 100;

	let fv = 0;

	if (r === 0) {
		fv = pv + pmt * n;
	} else {
		// FV of present value
		const fvPv = pv * Math.pow(1 + r, n);

		// FV of recurring payment (ordinary annuity - end of period)
		let fvPmt = pmt * ((Math.pow(1 + r, n) - 1) / r);

		// Adjust for annuity due (beginning of period)
		if (timing === "beginning") {
			fvPmt = fvPmt * (1 + r);
		}

		fv = fvPv + fvPmt;
	}

	const totalInvested = pv + pmt * n;
	const infRate = Number(inflationRate) / 100;
	let inflationAdjustedValue = fv;
	if (years > 0) {
		inflationAdjustedValue = fv / Math.pow(1 + infRate, years);
	}

	const finalFv = isInflationAdjusted ? inflationAdjustedValue : fv;
	const potentialGrowth = Math.max(0, finalFv - totalInvested);

	return {
		futureValue: Math.round(finalFv),
		nominalFutureValue: Math.round(fv),
		inflationAdjustedValue: Math.round(inflationAdjustedValue),
		totalInvested: Math.round(totalInvested),
		potentialGrowth: Math.round(potentialGrowth),
		periodicRate: r,
		periods: n,
		frequency,
		isInflationAdjusted,
	};
};

export const calculateRequiredInvestment = ({
	targetFv,
	pv,
	annualRate,
	years,
	frequency,
	timing,
	isInflationAdjusted = false,
	inflationRate = 5,
}) => {
	const isMonthly = frequency === "monthly";
	const n = isMonthly ? years * 12 : years;
	const r = isMonthly ? annualRate / 100 / 12 : annualRate / 100;

	// If targetFv is adjusted for inflation (target in today's money), future target needed will be targetFv * (1 + i)^years
	let effectiveTargetFv = targetFv;
	if (isInflationAdjusted && years > 0) {
		const infRate = Number(inflationRate) / 100;
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
			let denominator = (Math.pow(1 + r, n) - 1) / r;
			if (timing === "beginning") {
				denominator = denominator * (1 + r);
			}
			pmt = targetPmtPortion / denominator;
		}
	}

	const roundedPmt = Math.max(0, Math.round(pmt));
	const totalInvested = pv + roundedPmt * n;

	// Recalculate true FV based on rounded PMT to avoid mismatch
	const calcData = calculateFutureValue({
		pv,
		pmt: roundedPmt,
		annualRate,
		years,
		frequency,
		timing,
		isInflationAdjusted,
		inflationRate,
	});

	return {
		requiredPmt: roundedPmt,
		totalInvested: Math.round(totalInvested),
		potentialGrowth: calcData.potentialGrowth,
		futureValue: calcData.futureValue,
		nominalFutureValue: calcData.nominalFutureValue,
		inflationAdjustedValue: calcData.inflationAdjustedValue,
		periodicRate: r,
		periods: n,
		frequency,
		isInflationAdjusted,
	};
};

export const generateChartData = ({
	calcMode,
	pv,
	pmt,
	targetFv,
	annualRate,
	years,
	frequency,
	timing,
	isInflationAdjusted = false,
	inflationRate = 5,
}) => {
	const labels = [];
	const investedData = [];
	const growthData = [];

	const effectivePmt =
		calcMode === "pmt"
			? calculateRequiredInvestment({
					targetFv,
					pv,
					annualRate,
					years,
					frequency,
					timing,
					isInflationAdjusted,
					inflationRate,
			  }).requiredPmt
			: pmt;

	const isMonthly = frequency === "monthly";
	const infRate = Number(inflationRate) / 100;

	for (let y = 0; y <= years; y++) {
		labels.push(`Year ${y}`);

		if (y === 0) {
			investedData.push(pv);
			growthData.push(pv);
			continue;
		}

		const n = isMonthly ? y * 12 : y;
		const r = isMonthly ? annualRate / 100 / 12 : annualRate / 100;

		let fv = 0;
		if (r === 0) {
			fv = pv + effectivePmt * n;
		} else {
			const fvPv = pv * Math.pow(1 + r, n);
			let fvPmt = effectivePmt * ((Math.pow(1 + r, n) - 1) / r);
			if (timing === "beginning") {
				fvPmt = fvPmt * (1 + r);
			}
			fv = fvPv + fvPmt;
		}

		let finalFv = fv;
		if (isInflationAdjusted) {
			finalFv = fv / Math.pow(1 + infRate, y);
		}

		const totalInvested = pv + effectivePmt * n;

		investedData.push(Math.round(totalInvested));
		growthData.push(Math.round(finalFv));
	}

	return {
		labels,
		investedData,
		growthData,
	};
};