export function calculateRiskProfile(answers) {
  // answers is an array of objects: { questionId, score, questionTitle?, selectedOptionText? }
  const totalScore = answers.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const maxScore = 50; // Score kept out of 50

  // Risk Band categorization:
  // ( score 10-16 out of 50 ) => Conservative
  // ( score 18-30 out of 50 ) => Moderate
  // ( score 32-40 out of 50 ) => Aggressive

  let profile = "Conservative";
  let description =
    "You are an investor who has expectations of low to moderate kind of returns with lower levels of risk in order to preserve your capital. As a conservative investor, you might expect your portfolio to be allocated approximately 15% in growth assets, with the remainder in defensive assets and an allocation to gold.";

  if (totalScore > 30) {
    profile = "Aggressive";
    description =
      "You are an investor who is comfortable with a high volatility and high level of risk in order to achieve relatively higher returns over long term. Your objective is to accumulate assets over long term by primarily investing in growth assets. As an aggressive investor, you might expect your portfolio to be allocated up to 75% in growth assets and an allocation to gold.";
  } else if (totalScore >= 17) {
    profile = "Moderate";
    description =
      "You are an investor who would like to invest in both income and growth assets. You will be comfortable with calculated risks to achieve good returns, however, you require an investment strategy that adequately deals with the effects of inflation and tax. As a moderate investor, you might expect your portfolio to be allocated approximately 45% in growth assets, with the remainder in defensive assets and an allocation to gold.";
  } else {
    profile = "Conservative";
    description =
      "You are an investor who has expectations of low to moderate kind of returns with lower levels of risk in order to preserve your capital. As a conservative investor, you might expect your portfolio to be allocated approximately 15% in growth assets, with the remainder in defensive assets and an allocation to gold.";
  }

  return {
    score: totalScore,
    maxScore: maxScore,
    profile,
    description,
  };
}
