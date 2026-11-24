import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuizIntro from './QuizIntro';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

export default function FinanceMythQuiz({ isModal = false, onClose }) {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/resource/Myth Fact?fields=["*"]&order_by=creation asc&limit_page_length=100');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          const formatted = data.data.map((item, index) => {
            const rawOpt = (item.correct_option || '').toString().trim().toUpperCase();
            const isFact = rawOpt === 'FACT' || rawOpt === '1' || rawOpt === 'TRUE';
            return {
              id: item.name || index + 1,
              category: (item.category || 'Finance').trim(),
              question: (item.question || '').trim(),
              answer: isFact ? 'FACT' : 'MYTH',
              explanation: (item.reason || item.explanation || '').trim()
            };
          });
          // Only show 5 questions for now
          setQuizQuestions(formatted.slice(0, 5));
        } else {
          setQuizQuestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch questions from Myth Fact DocType:", err);
        setError("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleStart = () => {
    if (quizQuestions.length > 0) {
      setQuizStarted(true);
    }
  };

  const handleAnswer = (answerType) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answerType);
    setShowFeedback(true);

    const question = quizQuestions[currentQuestion];
    if (question && answerType.toUpperCase() === question.answer.toUpperCase()) {
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

  if (loading) {
    return (
      <div className={`flex justify-center items-center ${isModal ? 'py-12' : 'py-24 bg-[#f8fafc] min-h-[400px]'}`}>
        <div className="w-10 h-10 border-4 border-[#032e92]/30 border-t-[#032e92] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || quizQuestions.length === 0) {
    return (
      <div className={`flex justify-center items-center text-center ${isModal ? 'py-8' : 'py-24 bg-[#f8fafc] min-h-[400px]'}`}>
        <p className="text-gray-500 font-medium text-sm">Please add questions to the Myth Fact DocType in the backend to start the quiz.</p>
      </div>
    );
  }

  const content = (
    <div className={`w-full max-w-4xl mx-auto ${isModal ? 'py-1' : 'max-w-7xl px-6 lg:px-8 relative z-10'}`}>
      <AnimatePresence mode="wait">
        {!quizStarted && !quizFinished && (
          <motion.div key="intro" className="w-full">
            <QuizIntro onStart={handleStart} isModal={isModal} totalQuestions={quizQuestions.length || 5} />
          </motion.div>
        )}

        {quizStarted && !quizFinished && quizQuestions.length > 0 && (
          <motion.div key="question" className="w-full">
            <QuizQuestion
              question={quizQuestions[currentQuestion]}
              currentIdx={currentQuestion}
              total={quizQuestions.length}
              onAnswer={handleAnswer}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              onNext={handleNext}
              isModal={isModal}
            />
          </motion.div>
        )}

        {quizFinished && (
          <motion.div key="results" className="w-full">
            <QuizResults
              score={score}
              total={quizQuestions.length}
              onRetake={handleRetake}
              isModal={isModal}
              onClose={onClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #032e92 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      {content}
    </section>
  );
}
