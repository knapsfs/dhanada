import { motion } from 'framer-motion';
import mythFactImg from '../../assets/myth-fact.png';

export default function QuizIntro({ onStart, isModal = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className={`w-full flex flex-col md:flex-row items-center justify-between ${
        isModal ? 'gap-6 py-2' : 'max-w-7xl gap-12 lg:gap-20'
      }`}
    >
      {/* Text Content - Left Side */}
      <div className={`w-full md:w-1/2 text-center md:text-left order-2 md:order-1 flex flex-col items-center md:items-start`}>
        <div className={`inline-block rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold tracking-wide ${
          isModal ? 'px-3 py-1 text-xs mb-3' : 'px-4 py-2 text-sm mb-6'
        }`}>
          Finance, Simplified
        </div>

        <h2 className={`font-bold text-[#1a1a1a] tracking-tight leading-tight ${
          isModal ? 'text-2xl sm:text-3xl md:text-4xl mb-3' : 'text-4xl md:text-5xl lg:text-6xl mb-6'
        }`}>
          Myth or <span className='text-[#032e92]'>Fact?</span>
        </h2>

        <p className={`text-gray-600 font-medium ${
          isModal ? 'text-xs sm:text-sm mb-4 max-w-sm' : 'text-lg mb-10 max-w-lg'
        }`}>
          Think you know investing? Test your financial knowledge and separate common investment myths from facts.
        </p>

        <div className={`flex items-center ${isModal ? 'gap-4 mb-5 text-xs' : 'flex-col sm:flex-row gap-6 mb-10 text-sm'}`}>
          <div className="flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
            10 Questions
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#c10000]"></span>
            ~2 Minutes
          </div>
        </div>

        <button
          onClick={onStart}
          className={`rounded-xl font-bold bg-[#032e92] text-white shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 hover:shadow-xl hover:bg-[#022169] transition-all duration-300 cursor-pointer ${
            isModal ? 'px-8 py-3 text-sm w-full sm:w-auto' : 'px-10 py-4 w-full sm:w-auto'
          }`}
        >
          START QUIZ
        </button>
      </div>

      {/* Image - Right Side */}
      <div className={`w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2`}>
        <img
          src={mythFactImg}
          alt="Myth or Fact Illustration"
          className={`object-contain drop-shadow-md ${
            isModal ? 'w-36 sm:w-48 md:w-56 max-h-48' : 'w-full max-w-md lg:max-w-lg'
          }`}
        />
      </div>
    </motion.div>
  );
}
