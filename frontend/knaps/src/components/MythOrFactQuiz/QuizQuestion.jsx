import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function QuizQuestion({
  question,
  currentIdx,
  total,
  onAnswer,
  selectedAnswer,
  showFeedback,
  onNext
}) {
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.answer;

  const getButtonClass = (answerType) => {
    const base = "w-full py-6 px-4 rounded-2xl border-2 font-bold text-xl transition-all duration-300 ";

    if (!isAnswered) {
      return base + "bg-white border-gray-100 text-[#0a192f] hover:border-[#032e92] hover:bg-blue-50/50 hover:shadow-md";
    }

    if (answerType === selectedAnswer) {
      return base + (isCorrect
        ? "bg-[#eef5ff] border-[#032e92] text-[#032e92] shadow-sm"
        : "bg-red-50 border-red-200 text-[#c10000]");
    }

    // Unselected button after answering
    return base + "bg-white border-gray-100 text-gray-400 opacity-50 cursor-not-allowed";
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto w-full"
    >
      {/* Progress and Category */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
        <div>
          <div className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-3">
            Question {currentIdx + 1 > 9 ? currentIdx + 1 : `0${currentIdx + 1}`} / {total}
          </div>
          <div className="w-full md:w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: `${(currentIdx / total) * 100}%` }}
              animate={{ width: `${((currentIdx + 1) / total) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-[#032e92]"
            ></motion.div>
          </div>
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-gray-50 text-gray-600 font-bold text-[10px] uppercase tracking-wider border border-gray-200 self-start md:self-auto">
          {question.category}
        </div>
      </div>

      {/* Question */}
      <h3 className="text-2xl md:text-3xl lg:text-2xl font-bold text-[#0a192f] mb-12 leading-tight">
        {question.question}
      </h3>

      {/* Answer Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => !isAnswered && onAnswer('MYTH')}
          disabled={isAnswered}
          className={getButtonClass('MYTH')}
        >
          MYTH
        </button>
        <button
          onClick={() => !isAnswered && onAnswer('FACT')}
          disabled={isAnswered}
          className={getButtonClass('FACT')}
        >
          FACT
        </button>
      </div>

      {/* Feedback Panel */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
            aria-live="polite"
          >
            <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-6 md:p-8 mt-2">
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#032e92] text-xl" />
                    <span className="font-bold text-[#032e92] text-lg">Correct</span>
                  </>
                ) : (
                  <span className="font-bold text-[#c10000] text-lg">Not quite. Let's look at the facts.</span>
                )}
              </div>

              <div className="mb-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Correct Answer:
                </span>
                <span className="ml-2 font-black text-[#0a192f]">{question.answer}</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {question.explanation}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={onNext}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#0a192f] text-white hover:bg-[#032e92] transition-colors"
                >
                  {currentIdx === total - 1 ? 'See Results' : 'Next Question'}
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
