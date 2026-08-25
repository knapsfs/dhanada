import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { riskQuestions } from './riskQuestions';
import RiskQuestion from './RiskQuestion';
import LeadCapture from './LeadCapture';

export default function RiskProfiler() {
  const [phase, setPhase] = useState('intro'); // 'intro', 'questions', 'lead', 'success'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [currentScoreSelection, setCurrentScoreSelection] = useState(null);

  const handleStart = () => {
    setPhase('questions');
  };

  const handleAnswerSelect = (score) => {
    setCurrentScoreSelection(score);

    // Auto-advance logic
    setTimeout(() => {
      const newAnswers = [...answers];
      const qId = riskQuestions[currentQuestion].id;
      const existingIndex = newAnswers.findIndex(a => a.questionId === qId);

      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { questionId: qId, score };
      } else {
        newAnswers.push({ questionId: qId, score });
      }

      setAnswers(newAnswers);

      if (currentQuestion < riskQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        // Load existing answer if they are re-visiting
        const nextQId = riskQuestions[currentQuestion + 1].id;
        const nextAnswer = newAnswers.find(a => a.questionId === nextQId);
        setCurrentScoreSelection(nextAnswer ? nextAnswer.score : null);
      } else {
        setPhase('lead');
      }
    }, 400); // 400ms delay gives user time to see their selection before advancing
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      const prevQ = currentQuestion - 1;
      setCurrentQuestion(prevQ);
      const prevQId = riskQuestions[prevQ].id;
      const prevAnswer = answers.find(a => a.questionId === prevQId);
      setCurrentScoreSelection(prevAnswer ? prevAnswer.score : null);
    }
  };

  const handleLeadSuccess = () => {
    setPhase('success');
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentScoreSelection(null);
  };

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-t border-gray-100">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #032e92 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {phase === 'intro' && (
          <div className="text-center max-w-2xl mx-auto">
            <p className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-6 tracking-wide">
              Understand Your Investor Profile
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f] mb-6">
              Risk Profiler
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
              Understanding your comfort with market fluctuations is an important part of informed investing. Answer a few simple questions to discover your indicative risk profile.
            </p>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 mb-10">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-sm tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                  5 Questions
                </div>
                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-sm tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#c10000]"></span>
                  Takes ~1 Minute
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full md:w-auto px-10 py-4 rounded-xl font-bold bg-[#032e92] text-white shadow-xl shadow-blue-900/20 hover:-translate-y-1 hover:shadow-2xl hover:bg-[#022169] transition-all duration-300"
              >
                Start Risk Assessment
              </button>
              <p className="text-xs text-gray-400 mt-6">
                Your responses help us generate an indicative risk profile.
              </p>
            </div>
          </div>
        )}

        {phase === 'questions' && (
          <AnimatePresence mode="wait">
            <RiskQuestion
              key={currentQuestion}
              question={riskQuestions[currentQuestion]}
              currentIdx={currentQuestion}
              total={riskQuestions.length}
              onAnswer={handleAnswerSelect}
              selectedScore={currentScoreSelection}
              onBack={handleBack}
            />
          </AnimatePresence>
        )}

        {phase === 'lead' && (
          <LeadCapture onSubmitSuccess={handleLeadSuccess} />
        )}

        {phase === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center bg-white p-12 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-[#0a192f] mb-4">Request Received!</h3>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Your risk profile has been calculated and sent to your email. Please check your inbox.
            </p>
            <button
              onClick={handleRetake}
              className="px-8 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-[#032e92] hover:text-[#032e92] transition-colors"
            >
              Take Assessment Again
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
}

