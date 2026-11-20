import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function QuizQuestion({
  question,
  currentIdx,
  total,
  onAnswer,
  selectedAnswer,
  showFeedback,
  onNext,
  isModal = false
}) {
  const isAnswered = selectedAnswer !== null;
  const normalizedSelected = (selectedAnswer || '').trim().toUpperCase();
  const normalizedAnswer = (question.answer || '').trim().toUpperCase();
  const isCorrect = isAnswered && normalizedSelected === normalizedAnswer;

  const getButtonClass = (answerType) => {
    const typeUpper = answerType.toUpperCase();
    const base = `w-full rounded-xl border-2 font-bold transition-all duration-200 cursor-pointer ${isModal ? 'py-3 sm:py-3.5 px-4 text-base sm:text-lg' : 'py-6 px-4 rounded-2xl text-xl'
      } `;

    if (!isAnswered) {
      return base + "bg-white border-gray-100 text-[#0a192f] hover:border-[#032e92] hover:bg-blue-50/50 hover:shadow-md";
    }

    if (typeUpper === normalizedSelected) {
      return base + (isCorrect
        ? "bg-[#eef5ff] border-[#032e92] text-[#032e92] shadow-sm"
        : "bg-red-50 border-red-200 text-[#c10000]");
    }

    // Highlight the actual correct answer if user got it wrong
    if (typeUpper === normalizedAnswer && !isCorrect) {
      return base + "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm";
    }

    // Other unselected button after answering
    return base + "bg-white border-gray-100 text-gray-400 opacity-50 cursor-not-allowed";
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`w-full mx-auto ${isModal ? 'max-w-2xl py-1' : 'max-w-3xl'}`}
    >
      {/* Progress and Category */}
      <div className={`flex justify-between items-center ${isModal ? 'gap-3 mb-4' : 'flex-col md:flex-row gap-4 mb-10'}`}>
        <div className="flex-1 max-w-xs">
          <div className="text-gray-400 font-bold text-[11px] tracking-widest uppercase mb-1.5">
            Question {currentIdx + 1 > 9 ? currentIdx + 1 : `0${currentIdx + 1}`} / {total}
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: `${(currentIdx / total) * 100}%` }}
              animate={{ width: `${((currentIdx + 1) / total) * 100}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-[#032e92]"
            ></motion.div>
          </div>
        </div>


      </div>

      {/* Question */}
      <h3 className={`font-bold text-[#0a192f] leading-snug ${isModal ? 'text-base sm:text-lg mb-4' : 'text-2xl md:text-3xl mb-12 leading-tight'}`}>
        {question.question}
      </h3>

      {/* Answer Buttons */}
      <div className={`grid grid-cols-2 gap-3 ${isModal ? 'mb-3' : 'mb-8'}`}>
        <button
          type="button"
          onClick={() => !isAnswered && onAnswer('MYTH')}
          disabled={isAnswered}
          className={getButtonClass('MYTH')}
        >
          MYTH
        </button>
        <button
          type="button"
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
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
            aria-live="polite"
          >
            <div className={`bg-[#f8fafc] border border-gray-200 rounded-xl ${isModal ? 'p-3.5 sm:p-4 mt-2' : 'p-6 md:p-8 mt-2'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#007a55] text-base" />
                    <span className="font-bold text-[#007a55] text-sm sm:text-base">Correct!</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTimesCircle} className="text-[#c10000] text-base" />
                    <span className="font-bold text-[#c10000] text-sm sm:text-base">Incorrect</span>
                  </>
                )}
              </div>

              <div className="mb-1.5 text-xs">
                <span className="font-black text-gray-600 uppercase tracking-wider">
                  Correct Answer:
                </span>
                <span className={`ml-1.5 font-black text-gray-600 uppercase`}>
                  {normalizedAnswer}
                </span>
              </div>

              <p className={`text-gray-600 leading-relaxed ${isModal ? 'text-sm mb-3' : 'text-sm mb-8'}`}>
                {question.explanation}
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onNext}
                  className={`inline-flex items-center gap-1.5 rounded-xl font-bold bg-[#0a192f] text-white hover:bg-[#032e92] transition-colors cursor-pointer ${isModal ? 'px-5 py-2 text-xs sm:text-sm' : 'px-6 py-3 text-base'
                    }`}
                >
                  <span>{currentIdx === total - 1 ? 'See Results' : 'Next Question'}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
