import { motion } from 'framer-motion';
import mythFactImg from '../../assets/myth-fact.png';

export default function QuizIntro({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20"
    >
      {/* Text Content - Left Side */}
      <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1 flex flex-col items-center md:items-start">
        <div className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-6 tracking-wide">
          Finance, Simplified
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6 tracking-tight leading-tight">
          Myth or <span className='text-[#032e92]'>Fact?</span>
        </h2>

        <p className="text-lg text-gray-600 mb-10 font-medium  max-w-lg">
          Think you know investing? Test your financial knowledge and separate common investment myths from facts.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-sm tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
            10 Questions
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-sm tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#c10000]"></span>
            ~2 Minutes
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-10 py-4 rounded-xl font-semibold bg-[#032e92] text-white shadow-xl shadow-blue-900/20 hover:-translate-y-1 hover:shadow-2xl hover:bg-[#022169] transition-all duration-300 w-full sm:w-auto"
        >
          START QUIZ
        </button>
      </div>

      {/* Image - Right Side */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
        <img
          src={mythFactImg}
          alt="Myth or Fact Illustration"
          className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
        />
      </div>
    </motion.div>
  );
}
