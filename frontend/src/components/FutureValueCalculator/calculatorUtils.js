export const formatIndianCurrency = (value) => {
	if (isNaN(value)) return "₹0";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(value);
};

export const calculateFutureValue = ({ pv, pmt, annualRate, years, frequency, timing }) => {
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
	const potentialGrowth = Math.max(0, fv - totalInvested);

	return {
		futureValue: Math.round(fv),
		totalInvested: Math.round(totalInvested),
		potentialGrowth: Math.round(potentialGrowth),
		periodicRate: r,
		periods: n,
		frequency,
	};
};

export const generateChartData = ({ pv, pmt, annualRate, years, frequency, timing }) => {
	const labels = [];
	const investedData = [];
	const growthData = [];
	const fvData = [];

	// Create yearly data points for the chart
	for (let y = 0; y <= years; y++) {
		// Current year labels
		labels.push(y === 0 ? "Start" : `Year ${y}`);

		// Calculate values at this specific year
		const dataAtYear = calculateFutureValue({
			pv,
			pmt,
			annualRate,
			years: y,
			frequency,
			timing,
		});

		investedData.push(dataAtYear.totalInvested);
		growthData.push(dataAtYear.potentialGrowth);
		fvData.push(dataAtYear.futureValue);
	}

	return {
		labels,
		investedData,
		growthData,
		fvData,
	};
};
