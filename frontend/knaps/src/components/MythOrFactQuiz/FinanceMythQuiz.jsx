import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { quizQuestions, taxDisclaimer } from './quizQuestions';
import QuizIntro from './QuizIntro';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

export default function FinanceMythQuiz() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleStart = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (answerType) => {
    if (selectedAnswer) return; // Prevent double answering
    
    setSelectedAnswer(answerType);
    setShowFeedback(true);
    
    const question = quizQuestions[currentQuestion];
    if (answerType === question.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRetake = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizFinished(false);
  };

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #032e92 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {!quizStarted && !quizFinished && (
            <motion.div key="intro" className="w-full">
              <QuizIntro onStart={handleStart} />
            </motion.div>
          )}
          
          {quizStarted && !quizFinished && (
            <motion.div key="question" className="w-full min-h-[400px]">
              <QuizQuestion 
                question={quizQuestions[currentQuestion]}
                currentIdx={currentQuestion}
                total={quizQuestions.length}
                onAnswer={handleAnswer}
                selectedAnswer={selectedAnswer}
                showFeedback={showFeedback}
                onNext={handleNext}
              />
            </motion.div>
          )}
          
          {quizFinished && (
            <motion.div key="results" className="w-full">
              <QuizResults 
                score={score} 
                total={quizQuestions.length} 
                onRetake={handleRetake} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="mt-20 text-center">
          <p className="text-[11px] text-gray-400 max-w-4xl mx-auto leading-relaxed">
            {taxDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
