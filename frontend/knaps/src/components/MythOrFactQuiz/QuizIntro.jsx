import { motion } from 'framer-motion';

export default function QuizIntro({ onStart }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto py-12"
    >
      <div className="inline-block px-4 py-2 rounded-full bg-white text-[#032e92] font-bold text-[11px] mb-6 uppercase tracking-[0.2em] shadow-sm border border-blue-50">
        Finance, Simplified
      </div>
      
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0a192f] mb-6 tracking-tight">
        Myth or Fact?
      </h2>
      
      <p className="text-lg md:text-xl text-gray-600 mb-12 font-medium leading-relaxed max-w-xl mx-auto">
        Think you know investing? Test your financial knowledge and separate common investment myths from facts.
      </p>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
        <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-sm tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
          10 Questions
        </div>
        <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
        <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-sm tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#c10000]"></span>
          ~2 Minutes
        </div>
      </div>
      
      <button
        onClick={onStart}
        className="px-10 py-4 rounded-xl font-bold bg-[#032e92] text-white shadow-xl shadow-blue-900/20 hover:-translate-y-1 hover:shadow-2xl hover:bg-[#022169] transition-all duration-300"
      >
        START QUIZ
      </button>
    </motion.div>
  );
}
