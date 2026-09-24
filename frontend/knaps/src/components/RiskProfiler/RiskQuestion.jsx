import { motion } from 'framer-motion';

export default function RiskQuestion({ 
  question, 
  currentIdx, 
  total, 
  onAnswer,
  selectedScore,
  onBack,
  isModal = false
}) {
  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className={`w-full mx-auto ${isModal ? 'max-w-xl py-1' : 'max-w-2xl'}`}
    >
      <div className={isModal ? 'mb-4' : 'mb-8'}>
        <div className={`flex justify-between items-end ${isModal ? 'mb-2' : 'mb-4'}`}>
          <p className="text-[#032e92] font-bold tracking-widest uppercase text-xs">
            Risk Profiler
          </p>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">
            Question {currentIdx + 1} of {total}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: `${(currentIdx / total) * 100}%` }}
            animate={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#032e92] absolute left-0 top-0"
          ></motion.div>
        </div>
      </div>
      
      <h3 className={`font-bold text-[#0a192f] leading-snug ${isModal ? 'text-base sm:text-lg mb-4' : 'text-xl md:text-2xl mb-10 leading-tight'}`}>
        {question.title}
      </h3>
      
      <div className={`flex flex-col ${isModal ? 'gap-2 mb-4' : 'gap-3 mb-10'}`}>
        {question.options.map((option, idx) => {
          const isSelected = selectedScore === option.score;
          return (
            <button
              key={idx}
              onClick={() => onAnswer(option.score)}
              className={`w-full text-left rounded-xl border-2 transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
                isModal ? 'p-3 text-sm' : 'p-5'
              } ${
                isSelected 
                  ? 'border-[#032e92] bg-blue-50/50 shadow-sm' 
                  : 'border-gray-100 bg-white hover:border-[#032e92] hover:shadow-md'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                isSelected ? 'border-[#032e92] bg-[#032e92]' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
              </div>
              <span className={`${isModal ? 'text-xs sm:text-sm' : 'text-base'} ${isSelected ? 'font-bold text-[#032e92]' : 'text-gray-700 font-medium'}`}>
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className={`flex justify-between items-center border-t border-gray-100 ${isModal ? 'pt-3' : 'pt-6'}`}>
        <button
          onClick={onBack}
          disabled={currentIdx === 0}
          className={`font-bold transition-colors text-xs sm:text-sm ${currentIdx === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-[#032e92] cursor-pointer'}`}
        >
          &larr; Back
        </button>
      </div>
    </motion.div>
  );
}
