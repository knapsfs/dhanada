import { motion } from 'framer-motion';

export default function QuizResults({ score, total, onRetake, isModal = false, onClose }) {
  
  const getScoreDetails = () => {
    if (score >= 9) {
      return {
        title: "Finance Pro",
        desc: "You demonstrated a strong understanding of the concepts covered in this quiz."
      };
    } else if (score >= 7) {
      return {
        title: "Strong Foundation",
        desc: "You have a solid understanding of several core financial concepts."
      };
    } else if (score >= 4) {
      return {
        title: "Growing Knowledge",
        desc: "You have a developing understanding of important investment concepts."
      };
    } else {
      return {
        title: "Getting Started",
        desc: "You're building your financial knowledge. Keep exploring the fundamentals."
      };
    }
  };

  const details = getScoreDetails();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full mx-auto bg-white rounded-2xl border border-gray-100 text-center relative overflow-hidden ${
        isModal ? 'p-5 sm:p-6 max-w-2xl shadow-md' : 'p-8 md:p-12 max-w-3xl rounded-3xl shadow-2xl shadow-blue-900/5'
      }`}
    >
      <div className="relative z-10">
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-3">Your Finance Score</p>
        
        <div className="flex justify-center mb-3">
          <div className={`relative rounded-full border-4 sm:border-6 border-[#032e92] flex items-center justify-center font-black text-[#032e92] ${
            isModal ? 'w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl' : 'w-32 h-32 md:w-40 md:h-40 border-8 text-4xl md:text-5xl mb-8'
          }`}>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {score}/{total}
            </motion.span>
          </div>
        </div>
        
        <h2 className={`font-black text-[#0a192f] mb-1.5 ${isModal ? 'text-xl sm:text-2xl' : 'text-3xl md:text-4xl mb-4'}`}>
          {details.title}
        </h2>
        
        <p className={`text-gray-600 max-w-md mx-auto ${isModal ? 'text-xs sm:text-sm mb-4' : 'text-lg mb-12 max-w-lg'}`}>
          {details.desc}
        </p>
        
        <div className={`bg-[#f8fafc] rounded-xl text-left ${isModal ? 'p-3.5 mb-4' : 'p-6 md:p-8 rounded-2xl mb-12'}`}>
          <h3 className="font-bold text-[#0a192f] text-xs uppercase tracking-wider mb-2 border-b border-gray-200 pb-1.5">What You Explored</h3>
          <div className={`grid grid-cols-2 ${isModal ? 'gap-2.5 text-xs' : 'md:grid-cols-2 gap-6'}`}>
            <div>
              <p className="font-bold text-[#032e92] text-[11px] uppercase tracking-wider">Mutual Funds</p>
              <p className="text-gray-500 text-[10px] sm:text-xs leading-tight">Diversification, SIPs & risk.</p>
            </div>
            <div>
              <p className="font-bold text-[#032e92] text-[11px] uppercase tracking-wider">NPS</p>
              <p className="text-gray-500 text-[10px] sm:text-xs leading-tight">Retirement planning & growth.</p>
            </div>
            <div>
              <p className="font-bold text-[#032e92] text-[11px] uppercase tracking-wider">Risk Profiling</p>
              <p className="text-gray-500 text-[10px] sm:text-xs leading-tight">Balancing return potential.</p>
            </div>
            <div>
              <p className="font-bold text-[#032e92] text-[11px] uppercase tracking-wider">SIF & AIF</p>
              <p className="text-gray-500 text-[10px] sm:text-xs leading-tight">Regulated wealth frameworks.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-3">
          <button 
            onClick={onRetake}
            className={`rounded-xl font-bold text-[#032e92] bg-white border-2 border-gray-200 hover:border-[#032e92] hover:bg-gray-50 transition-colors cursor-pointer ${
              isModal ? 'px-6 py-2 text-xs sm:text-sm' : 'w-full md:w-auto px-8 py-3.5'
            }`}
          >
            Retake Quiz
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className={`rounded-xl font-bold bg-[#032e92] text-white hover:bg-[#022169] transition-colors shadow-md cursor-pointer ${
                isModal ? 'px-6 py-2 text-xs sm:text-sm' : 'w-full md:w-auto px-8 py-3.5'
              }`}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
