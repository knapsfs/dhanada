import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { taxDisclaimer } from './quizQuestions';
import QuizIntro from './QuizIntro';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

export default function FinanceMythQuiz() {
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
        // Fetch from Frappe Doctype API
        // Adjust the URL if you have a specific custom API endpoint
        const response = await fetch('/api/resource/Myth Fact?fields=["*"]');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data.data) {
          // Map Frappe fields to our component's expected structure
          const formatted = data.data.map((item, index) => ({
            id: item.name || index,
            category: item.category || 'Finance',
            question: item.question,
            answer: item.correct_option ? item.correct_option.toUpperCase() : 'MYTH', // 'MYTH' or 'FACT'
            explanation: item.reason
          }));
          setQuizQuestions(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
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
    if (selectedAnswer) return; // Prevent double answering

    setSelectedAnswer(answerType);
    setShowFeedback(true);

    const question = quizQuestions[currentQuestion];
    if (answerType.toUpperCase() === question.answer.toUpperCase()) {
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
      <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100 flex justify-center items-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-[#032e92]/30 border-t-[#032e92] rounded-full animate-spin"></div>
      </section>
    );
  }

  if (error || quizQuestions.length === 0) {
    return (
      <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100 flex justify-center items-center min-h-[500px]">
        <p className="text-gray-500 font-medium">Please add questions to the myth_fact Doctype in the backend to start the quiz.</p>
      </section>
    );
  }

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

          {quizStarted && !quizFinished && quizQuestions.length > 0 && (
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
