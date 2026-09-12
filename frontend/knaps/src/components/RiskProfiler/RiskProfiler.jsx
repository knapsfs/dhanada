import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { riskQuestions } from './riskQuestions';
import RiskQuestion from './RiskQuestion';
import LeadCapture from './LeadCapture';

export default function RiskProfiler({ isModal = false, onClose }) {
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

  const content = (
    <div className={`w-full max-w-3xl mx-auto ${isModal ? 'py-1' : 'max-w-7xl px-6 lg:px-8 relative z-10'}`}>
      {phase === 'intro' && (
        <div className="text-center max-w-xl mx-auto">
          <p className={`inline-block rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold tracking-wide ${isModal ? 'px-3 py-1 text-xs mb-3' : 'px-4 py-2 text-sm mb-6'}`}>
            Understand Your Investor Profile
          </p>
          <h2 className={`font-bold text-[#0a192f] ${isModal ? 'text-2xl sm:text-3xl mb-3' : 'text-3xl md:text-4xl lg:text-5xl mb-6'}`}>
            Risk Profiler
          </h2>
          <p className={`text-gray-600 leading-relaxed font-medium ${isModal ? 'text-xs sm:text-sm mb-5 max-w-md mx-auto' : 'text-lg mb-10'}`}>
            Understanding your comfort with market fluctuations is an important part of informed investing. Answer a few simple questions to discover your indicative risk profile.
          </p>

          <div className={`bg-white rounded-2xl shadow-md shadow-blue-900/5 border border-gray-100 ${isModal ? 'p-5 mb-4' : 'p-8 rounded-3xl shadow-xl mb-10'}`}>
            <div className={`flex justify-center items-center gap-6 ${isModal ? 'mb-4' : 'mb-8'}`}>
              <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-xs tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                5 Questions
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-xs tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#c10000]"></span>
                Takes ~1 Minute
              </div>
            </div>

            <button
              onClick={handleStart}
              className={`rounded-xl font-bold bg-[#032e92] text-white shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 hover:shadow-xl hover:bg-[#022169] transition-all duration-300 ${isModal ? 'w-full sm:w-auto px-8 py-3 text-sm' : 'w-full md:w-auto px-10 py-4'}`}
            >
              Start Risk Assessment
            </button>
            <p className={`text-gray-400 ${isModal ? 'text-[11px] mt-3' : 'text-xs mt-6'}`}>
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
            isModal={isModal}
          />
        </AnimatePresence>
      )}

      {phase === 'lead' && (
        <LeadCapture onSubmitSuccess={handleLeadSuccess} isModal={isModal} />
      )}

      {phase === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`max-w-xl mx-auto text-center bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 ${isModal ? 'p-6 sm:p-8' : 'p-12 rounded-3xl shadow-xl'}`}
        >
          <div className={`bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 ${isModal ? 'w-14 h-14' : 'w-20 h-20 mb-6'}`}>
            <svg className={`${isModal ? 'w-7 h-7' : 'w-10 h-10'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className={`font-black text-[#0a192f] mb-2 ${isModal ? 'text-xl sm:text-2xl' : 'text-2xl mb-4'}`}>Request Received!</h3>
          <p className={`text-gray-600 leading-relaxed ${isModal ? 'text-xs sm:text-sm mb-6' : 'text-lg mb-10'}`}>
            Your risk profile has been calculated and sent to your email. Please check your inbox.
          </p>
          <button
            onClick={handleRetake}
            className={`rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-[#032e92] hover:text-[#032e92] transition-colors ${isModal ? 'px-6 py-2.5 text-xs' : 'px-8 py-3'}`}
          >
            Take Assessment Again
          </button>
        </motion.div>
      )}
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-t border-gray-100">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #032e92 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      {content}
    </section>
  );
}
