import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function QuizResults({ score, total, onRetake }) {
  
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
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto w-full bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-2xl shadow-blue-900/5 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-8">Your Finance Score</p>
        
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-[#032e92] flex items-center justify-center text-4xl md:text-5xl font-black text-[#032e92]">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}/{total}
            </motion.span>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-[#0a192f] mb-4">
          {details.title}
        </h2>
        
        <p className="text-gray-600 text-lg mb-12 max-w-lg mx-auto">
          {details.desc}
        </p>
        
        <div className="bg-[#f8fafc] rounded-2xl p-6 md:p-8 text-left mb-12">
          <h3 className="font-bold text-[#0a192f] mb-6 border-b border-gray-200 pb-4">What You Explored</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-bold text-[#032e92] text-sm mb-1 uppercase tracking-wider">Mutual Funds</p>
              <p className="text-gray-500 text-sm">Diversification, SIPs and the realities of market risk.</p>
            </div>
            <div>
              <p className="font-bold text-[#032e92] text-sm mb-1 uppercase tracking-wider">NPS</p>
              <p className="text-gray-500 text-sm">Long-term retirement planning and accumulation.</p>
            </div>
            <div>
              <p className="font-bold text-[#032e92] text-sm mb-1 uppercase tracking-wider">Risk</p>
              <p className="text-gray-500 text-sm">How risk and potential return relate in a portfolio.</p>
            </div>
            <div>
              <p className="font-bold text-[#032e92] text-sm mb-1 uppercase tracking-wider">Alt Investments</p>
              <p className="text-gray-500 text-sm">Basic concepts around regulated SIF and AIF frameworks.</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button 
            onClick={onRetake}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-[#032e92] bg-white border-2 border-gray-200 hover:border-[#032e92] hover:bg-gray-50 transition-colors"
          >
            Retake Quiz
          </button>
          <a
            href="#services"
            className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold bg-[#032e92] text-white hover:bg-[#022169] transition-colors shadow-lg text-center"
          >
            Explore Our Services &rarr;
          </a>
        </div>
      </div>
    </motion.div>
  );
}
