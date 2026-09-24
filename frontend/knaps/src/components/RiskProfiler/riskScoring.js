export function calculateRiskProfile(answers) {
  // answers is an array of objects: { questionId, score, questionTitle?, selectedOptionText? }
  const totalScore = answers.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const maxScore = answers.length > 0 ? answers.length * 5 : 25;

  // With 5 questions, score range is 10 to 25.
  // We use percentage to support both 5-question and custom question counts seamlessly.
  const scorePct = maxScore > 0 ? (totalScore / maxScore) * 100 : 50;

  // Risk Band categorization:
  // <= 48% (score 10-12 out of 25) => Conservative
  // 49% - 60% (score 13-15 out of 25) => Balanced
  // 61% - 72% (score 16-18 out of 25) => Moderately Aggressive
  // 73% - 84% (score 19-21 out of 25) => Aggressive
  // > 84% (score 22-25 out of 25) => Very Aggressive

  let profile = "Conservative";
  let description =
    "Your responses indicate a strong preference for capital stability and a lower tolerance for market fluctuations. Preserving capital is your top priority.";

  if (scorePct > 84) {
    profile = "Very Aggressive";
    description =
      "Your responses indicate a strong appetite for sophisticated, high-growth investment strategies, asymmetric upside, and flexible long-short derivative frameworks.";
  } else if (scorePct > 72) {
    profile = "Aggressive";
    description =
      "Your responses indicate a high comfort with substantial market fluctuations in pursuit of superior long-term wealth compounding.";
  } else if (scorePct > 60) {
    profile = "Moderately Aggressive";
    description =
      "Your responses indicate that you are comfortable accepting moderate market fluctuations in pursuit of healthy, inflation-beating long-term growth.";
  } else if (scorePct > 48) {
    profile = "Balanced";
    description =
      "Your responses indicate a preference for balancing steady wealth accumulation with an emphasis on capital protection during market pullbacks.";
  }

  // Derived sub-metrics based on actual 5 questions
  const q1Score = answers.find(a => a.questionId === 1)?.score || 3; // Age
  const q2Score = answers.find(a => a.questionId === 2)?.score || 3; // Dependents
  const q3Score = answers.find(a => a.questionId === 3)?.score || 3; // Expenses/EMI
  const q5Score = answers.find(a => a.questionId === 5)?.score || 3; // Emergency withdrawal
  const q14Score = answers.find(a => a.questionId === 14)?.score || 3; // Investment Priority

  const getRiskComfort = () => {
    const comfortScore = q14Score + q5Score; // Max 10, Min 4
    if (comfortScore >= 9) return "Very High";
    if (comfortScore >= 8) return "High";
    if (comfortScore >= 7) return "Moderate to High";
    if (comfortScore >= 5) return "Moderate";
    return "Conservative";
  };

  const getFlexibility = () => {
    const flexScore = q2Score + q3Score; // Max 10, Min 4
    if (flexScore >= 9) return "High";
    if (flexScore >= 7) return "Moderate";
    return "Cautious";
  };

  const getHorizon = () => {
    if (q1Score >= 5) return "Long-term (7+ Years)";
    if (q1Score === 4) return "Long-term (5-7 Years)";
    if (q1Score === 3) return "Medium-term (3-5 Years)";
    return "Short-term (1-3 Years)";
  };

  const getExperience = () => {
    if (scorePct > 75) return "Advanced / Market-Ready";
    if (scorePct > 55) return "Intermediate";
    return "Foundational";
  };

  return {
    score: totalScore,
    maxScore: maxScore,
    profile,
    description,
    metrics: {
      riskComfort: getRiskComfort(),
      financialFlexibility: getFlexibility(),
      horizon: getHorizon(),
      experience: getExperience(),
    },
  };
}
