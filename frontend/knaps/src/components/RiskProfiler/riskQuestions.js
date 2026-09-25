export const riskQuestions = [
	{
		id: 1,
		title: "What is your age band?",
		options: [
			{ text: "Less than 30 years", score: 8 },
			{ text: "Between 30 and 40 years", score: 6 },
			{ text: "Between 40 and 50 years", score: 4 },
			{ text: "Above 50 years", score: 2 },
		],
	},
	{
		id: 2,
		title: "How many financial dependents do you have?",
		options: [
			{ text: "No dependents", score: 8 },
			{ text: "1-2", score: 6 },
			{ text: "3-5", score: 4 },
			{ text: "More than 5", score: 2 },
		],
	},
	{
		id: 3,
		title: "Approximately what portion of your monthly income goes toward household expenses and EMI payments?",
		options: [
			{ text: "Less than 30%", score: 8 },
			{ text: "30–40%", score: 6 },
			{ text: "40–50%", score: 4 },
			{ text: "More than 50%", score: 2 },
		],
	},
	{
		id: 5,
		title: "If you needed money unexpectedly, which investment would you be most likely to withdraw from first?",
		options: [
			{ text: "Cash, Savings, FDs, Liquid/Money Market Funds, PPF", score: 8 },
			{ text: "Bonds / Bond Funds / Hybrid Funds", score: 6 },
			{ text: "Equity Funds / Shares", score: 4 },
			{ text: "I would need to borrow or take on debt", score: 2 },
		],
	},
	{
		id: 14,
		title: "Which statement best describes your investment priority?",
		options: [
			{
				text: "Maximizing long-term growth is my priority, even with significant fluctuations.",
				score: 8,
			},
			{
				text: "I am comfortable accepting volatility for higher growth potential.",
				score: 6,
			},
			{ text: "I want a balance between stability and growth.", score: 4 },
			{ text: "Protecting my money is my highest priority.", score: 2 },
		],
	},
];
