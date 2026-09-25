export function calculateRiskProfile(answers) {
  // answers is an array of objects: { questionId, score, questionTitle?, selectedOptionText? }
  const totalScore = answers.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const maxScore = 50; // Score kept out of 50

  // Risk Band categorization:
  // ( score 10-16 out of 50 ) => Balanced
  // ( score 18-30 out of 50 ) => Moderate
  // ( score 32-40 out of 50 ) => Aggressive

  let profile = "Balanced";
  let description =
    "Your responses reflect a balanced approach—seeking steady wealth accumulation while maintaining a dependable cushion against market pullbacks.";

  if (totalScore > 30) {
    profile = "Aggressive";
    description =
      "Your responses indicate high risk tolerance and a primary focus on substantial long-term capital compounding and specialized alpha strategies.";
  } else if (totalScore >= 17) {
    profile = "Moderate";
    description =
      "Your responses indicate that you are comfortable accepting moderate market fluctuations in pursuit of healthy, inflation-beating long-term growth.";
  } else {
    profile = "Balanced";
    description =
      "Your responses reflect a balanced approach—seeking steady wealth accumulation while maintaining a dependable cushion against market pullbacks.";
  }

  // Derived sub-metrics based on actual 5 questions (scores: 8, 6, 4, 2)
  const q1Score = answers.find(a => a.questionId === 1)?.score || 4; // Age
  const q2Score = answers.find(a => a.questionId === 2)?.score || 4; // Dependents
  const q3Score = answers.find(a => a.questionId === 3)?.score || 4; // Expenses/EMI
  const q5Score = answers.find(a => a.questionId === 5)?.score || 4; // Emergency withdrawal
  const q14Score = answers.find(a => a.questionId === 14)?.score || 4; // Investment Priority

  const getRiskComfort = () => {
    const comfortScore = q14Score + q5Score; // Max 16, Min 4
    if (comfortScore >= 14) return "High";
    if (comfortScore >= 10) return "Moderate to High";
    if (comfortScore >= 8) return "Moderate";
    return "Conservative";
  };

  const getFlexibility = () => {
    const flexScore = q2Score + q3Score; // Max 16, Min 4
    if (flexScore >= 14) return "High";
    if (flexScore >= 10) return "Moderate";
    return "Cautious";
  };

  const getHorizon = () => {
    if (q1Score >= 8) return "Long-term (7+ Years)";
    if (q1Score >= 6) return "Long-term (5-7 Years)";
    if (q1Score >= 4) return "Medium-term (3-5 Years)";
    return "Short-term (1-3 Years)";
  };

  const getExperience = () => {
    if (totalScore >= 32) return "Advanced / Market-Ready";
    if (totalScore >= 18) return "Intermediate";
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
