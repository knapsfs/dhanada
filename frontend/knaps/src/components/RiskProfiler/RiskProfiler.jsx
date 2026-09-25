import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { riskQuestions } from './riskQuestions';
import { calculateRiskProfile } from './riskScoring';
import RiskQuestion from './RiskQuestion';
import LeadCapture from './LeadCapture';
import RiskResult from './RiskResult';

export default function RiskProfiler({ isModal = false, onClose }) {
  const [phase, setPhase] = useState('intro'); // 'intro', 'questions', 'lead', 'success', 'result'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [submittedUser, setSubmittedUser] = useState(null);

  const [currentScoreSelection, setCurrentScoreSelection] = useState(null);

  const handleStart = () => {
    setPhase('questions');
  };

  const handleAnswerSelect = (score) => {
    setCurrentScoreSelection(score);

    // Auto-advance logic
    setTimeout(() => {
      const newAnswers = [...answers];
      const q = riskQuestions[currentQuestion];
      const qId = q.id;
      const selectedOption = q.options.find(opt => opt.score === score);
      const existingIndex = newAnswers.findIndex(a => a.questionId === qId);

      const entry = {
        questionId: qId,
        score,
        questionTitle: q.title,
        selectedOptionText: selectedOption ? selectedOption.text : `Score ${score}`
      };

      if (existingIndex >= 0) {
        newAnswers[existingIndex] = entry;
      } else {
        newAnswers.push(entry);
      }

      setAnswers(newAnswers);

      if (currentQuestion < riskQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        const nextQId = riskQuestions[currentQuestion + 1].id;
        const nextAnswer = newAnswers.find(a => a.questionId === nextQId);
        setCurrentScoreSelection(nextAnswer ? nextAnswer.score : null);
      } else {
        // Calculate profile once all questions are answered
        const computed = calculateRiskProfile(newAnswers);
        setResult(computed);
        setPhase('lead');
      }
    }, 400);
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

  const handleLeadSuccess = (userData) => {
    setSubmittedUser(userData);
    setPhase('success');
  };

  const handleViewResult = () => {
    setPhase('result');
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setSubmittedUser(null);
    setCurrentScoreSelection(null);
  };

  const waText = result?.profile
    ? `Hi KNAPS Team, I completed my Investor Risk Profiler assessment. My profile is ${result.profile}. I would like to consult with an advisor regarding my investments.`
    : `Hi KNAPS Team, I would like to consult regarding my investment portfolio.`;
  const waUrl = `https://wa.me/+919990243143?text=${encodeURIComponent(waText)}`;

  const content = (
    <div className={`w-full max-w-4xl mx-auto ${isModal ? 'py-1' : 'max-w-7xl px-6 lg:px-8 relative z-10'}`}>
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
              className={`btn-ripple rounded-xl font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 cursor-pointer ${isModal ? 'w-full sm:w-auto px-6 py-3 text-[14px]' : 'w-full md:w-auto px-8 py-3.5 text-[15px]'}`}
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
        <LeadCapture
          result={result}
          answers={answers}
          onSubmitSuccess={handleLeadSuccess}
          isModal={isModal}
        />
      )}

      {phase === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`max-w-xl mx-auto text-center bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 ${isModal ? 'p-6 sm:p-8' : 'p-10 rounded-3xl shadow-2xl'}`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h3 className="font-black text-[#0a192f] text-xl sm:text-2xl mb-2">
            Risk Profile Sent!
          </h3>

          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm mb-5 max-w-md mx-auto">
            Your comprehensive risk profile report has been generated and sent to:
          </p>

          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-xl px-4 py-2 mb-6 text-xs sm:text-sm font-bold text-[#032e92]">
            <span>📧</span>
            <span>{submittedUser?.email || 'your email'}</span>
          </div>

          {result?.profile && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-4 sm:p-5 border border-blue-100 mb-6 text-left">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Indicative Risk Profile</div>
              <div className="text-xl sm:text-2xl font-black text-[#0a192f] mb-2">{result.profile}</div>
              <p className="text-xs text-gray-600 leading-relaxed m-0">{result.description}</p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ripple px-6 py-3 rounded-xl font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all text-xs sm:text-sm shadow-md shadow-emerald-900/10 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Chat on WhatsApp &rarr;</span>
            </a>
          </div>

          <button
            onClick={handleRetake}
            className="text-xs font-semibold text-gray-400 hover:text-[#032e92] transition-colors cursor-pointer"
          >
            ↺ Take Assessment Again
          </button>
        </motion.div>
      )}

      {phase === 'result' && result && (
        <RiskResult
          result={result}
          onRetake={handleRetake}
          isModal={isModal}
        />
      )}
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#f8fafc] relative overflow-hidden border-t border-gray-100">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #032e92 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      {content}
    </section>
  );
}
