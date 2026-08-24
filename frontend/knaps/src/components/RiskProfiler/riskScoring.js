export function calculateRiskProfile(answers) {
  // answers is an array of objects: { questionId, score }

  const totalScore = answers.reduce((acc, curr) => acc + curr.score, 0);

  // Total possible score: 14 questions * 5 max = 70
  // Categories:
  // Conservative: <= 25
  // Balanced: 26 - 38
  // Moderately Aggressive: 39 - 50
  // Aggressive: 51 - 60
  // Very Aggressive: > 60

  let profile = "Conservative";
  let description = "Your responses indicate a stronger preference for stability and a lower tolerance for significant investment fluctuations.";

  if (totalScore > 60) {
    profile = "Very Aggressive";
    description = "Your responses indicate a high tolerance for significant market fluctuations and a strong preference for long-term growth potential.";
  } else if (totalScore > 50) {
    profile = "Aggressive";
    description = "Your responses indicate a relatively high comfort with substantial market fluctuations in pursuit of long-term growth potential.";
  } else if (totalScore > 38) {
    profile = "Moderately Aggressive";
    description = "Your responses indicate that you may be comfortable accepting a higher degree of market fluctuation in pursuit of long-term growth potential.";
  } else if (totalScore > 25) {
    profile = "Balanced";
    description = "Your responses indicate a preference for balancing growth potential with a meaningful level of stability.";
  }

  // Derived sub-metrics
  const getRiskComfort = (score) => {
    if (score > 60) return "Very High";
    if (score > 50) return "High";
    if (score > 38) return "Moderate to High";
    if (score > 25) return "Moderate";
    return "Low";
  };

  const getExperience = (answers) => {
    const q9 = answers.find(a => a.questionId === 9)?.score || 3;
    if (q9 >= 4) return "Advanced";
    if (q9 === 3) return "Intermediate";
    return "Beginner";
  };

  const getHorizon = (answers) => {
    const q11 = answers.find(a => a.questionId === 11)?.score || 3;
    if (q11 >= 4) return "Long-term";
    if (q11 === 3) return "Medium-term";
    return "Short-term";
  };

  const getFlexibility = (answers) => {
    const q3 = answers.find(a => a.questionId === 3)?.score || 3;
    const q13 = answers.find(a => a.questionId === 13)?.score || 3;
    const avg = (q3 + q13) / 2;
    if (avg >= 4) return "High";
    if (avg >= 3) return "Moderate";
    return "Low";
  };

  return {
    score: totalScore,
    maxScore: 70,
    profile,
    description,
    metrics: {
      riskComfort: getRiskComfort(totalScore),
      experience: getExperience(answers),
      horizon: getHorizon(answers),
      financialFlexibility: getFlexibility(answers)
    }
  };
}
