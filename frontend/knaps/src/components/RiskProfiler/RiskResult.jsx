import { motion } from 'framer-motion';
import { useLeadModal } from '../../context/LeadModalContext';

export default function RiskResult({ result, onRetake, isModal = false }) {
  const { openLeadModal } = useLeadModal ? useLeadModal() : { openLeadModal: () => {} };
  const categories = ['Balanced', 'Moderate', 'Aggressive'];
  const profileIndex = Math.max(0, categories.indexOf(result.profile));
  // Spread position across 3 bands: Balanced (10%), Moderate (50%), Aggressive (90%)
  const positionPercentage = profileIndex === 0 ? 12 : profileIndex === 1 ? 50 : 88;

  const waText = `Hi KNAPS Team, I completed my Investor Risk Profiler assessment. My indicative profile is ${result.profile} (Score: ${result.score}/${result.maxScore}). I would like to consult with an advisor.`;
  const waUrl = `https://wa.me/+919990243143?text=${encodeURIComponent(waText)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-4xl mx-auto w-full ${isModal ? 'py-2 px-1' : ''}`}
    >
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-[#032e92] font-bold tracking-widest uppercase text-xs sm:text-sm mb-2">
          Your Indicative Risk Profile
        </h2>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0a192f] mb-4">
          {result.profile}
        </h3>
        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {result.description}
        </p>
      </div>
      
      {/* Risk Meter */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-900/5 border border-gray-100 mb-8 sm:mb-10 relative overflow-hidden">
        <div className="relative pt-8 pb-4 w-full">
          {/* Base line */}
          <div className="h-2.5 bg-gray-100 rounded-full w-full"></div>
          
          {/* Fill line */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${positionPercentage}%` }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="h-2.5 bg-gradient-to-r from-blue-400 via-indigo-600 to-[#032e92] rounded-full absolute top-8 left-0"
          ></motion.div>
          
          {/* Pointer */}
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${positionPercentage}%` }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          >
            <div className="bg-[#0a192f] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1 whitespace-nowrap shadow-sm">
              YOU
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0a192f]"></div>
            <div className="w-5 h-5 rounded-full bg-white border-4 border-[#032e92] mt-1 shadow-md"></div>
          </motion.div>
          
          {/* 3 Risk Band Labels */}
          <div className="flex justify-between mt-6 px-1">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 text-left w-1/3">Balanced (10–16)</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 text-center w-1/3">Moderate (18–30)</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 text-right w-1/3">Aggressive (32–40)</span>
          </div>
        </div>
      </div>
      
      {/* Assessment Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Risk Comfort</p>
          <p className="text-[#0a192f] text-sm sm:text-base font-black">{result.metrics.riskComfort}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Flexibility</p>
          <p className="text-[#0a192f] text-sm sm:text-base font-black">{result.metrics.financialFlexibility}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Experience</p>
          <p className="text-[#0a192f] text-sm sm:text-base font-black">{result.metrics.experience}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-center">
          <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Horizon</p>
          <p className="text-[#0a192f] text-sm sm:text-base font-black">{result.metrics.horizon}</p>
        </div>
      </div>
      
      {/* What it means */}
      <div className="bg-[#032e92] text-white rounded-3xl p-6 sm:p-10 mb-8 sm:mb-10 text-center md:text-left md:flex items-center gap-8">
        <div className="md:w-1/3 mb-4 md:mb-0">
          <h3 className="text-xl sm:text-2xl font-black leading-tight">What Your Profile Means</h3>
        </div>
        <div className="md:w-2/3">
          <p className="text-blue-100 leading-relaxed text-sm sm:text-base m-0">
            Your responses suggest that you may be comfortable with {profileIndex === 2 ? 'a higher level of investment volatility to achieve superior long-term growth and specialized alpha strategies' : profileIndex === 0 ? 'prioritizing capital protection, steady income, and balanced growth' : 'a balanced approach between growth and stability with moderate equity exposure'}. However, risk tolerance is only one part of an investment decision. Your goals, liquidity needs, financial responsibilities, and time horizon are equally critical.
          </p>
        </div>
      </div>
      
      {/* Explore Concepts */}
      <h3 className="text-xl sm:text-2xl font-black text-[#0a192f] mb-6 text-center">Recommended Investment Concepts</h3>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group">
          <h4 className="text-lg font-bold text-[#0a192f] mb-2">Mutual Funds</h4>
          <p className="text-gray-600 text-xs sm:text-sm mb-4">Diversified market-linked investment strategies tailored to your exact risk appetite and time horizon.</p>
          <a href="/mutual-funds" className="text-[#032e92] font-bold text-xs sm:text-sm group-hover:underline">Explore Funds &rarr;</a>
        </div>
        <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group">
          <h4 className="text-lg font-bold text-[#0a192f] mb-2">National Pension System (NPS)</h4>
          <p className="text-gray-600 text-xs sm:text-sm mb-4">Long-term retirement corpus creation with disciplined tax advantages and multi-asset allocation.</p>
          <a href="/nps" className="text-[#032e92] font-bold text-xs sm:text-sm group-hover:underline">Explore NPS &rarr;</a>
        </div>
        {profileIndex >= 1 && (
          <>
            <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group">
              <h4 className="text-lg font-bold text-[#0a192f] mb-2">Specialized Investment Funds (SIF)</h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">SEBI-regulated long-short derivative strategies starting from ₹10 lakh with built-in drawdown cushioning.</p>
              <a href="/sif" className="text-[#032e92] font-bold text-xs sm:text-sm group-hover:underline">Explore SIF &rarr;</a>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group">
              <h4 className="text-lg font-bold text-[#0a192f] mb-2">Hedging & Capital Cushioning</h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">Learn how institutional derivative hedging minimizes bear-market drawdowns while preserving upside.</p>
              <a href="/sif-vs-mutual-funds" className="text-[#032e92] font-bold text-xs sm:text-sm group-hover:underline">Read Comparison &rarr;</a>
            </div>
          </>
        )}
      </div>
      
      {/* CTA Box */}
      <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 text-center border border-gray-200 mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-[#0a192f] mb-2">Discuss Your Investment Goals with KNAPS</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-6 max-w-xl mx-auto">
          Our financial advisors can help you align your indicative risk profile with actionable, goal-driven investment solutions.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a 
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-ripple px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/10"
          >
            Chat on WhatsApp &rarr;
          </a>
          <button 
            type="button"
            onClick={() => openLeadModal && openLeadModal()}
            className="btn-ripple px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#032e92] text-white hover:bg-[#021d63] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-900/20"
          >
            Request Advisor Callback &rarr;
          </button>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <button onClick={onRetake} className="text-gray-500 text-xs sm:text-sm font-bold hover:text-[#032e92] transition-colors cursor-pointer">
          &#8634; Retake Assessment
        </button>
      </div>
      
      <p className="text-[10px] text-gray-400 text-center leading-relaxed max-w-3xl mx-auto border-t border-gray-100 pt-6">
        This assessment provides an indicative risk profile based on the information provided by you. It is intended strictly for educational purposes and does not constitute investment, financial, tax or legal advice, or a recommendation of suitability for any financial product. Investment products are subject to market risks.
      </p>
    </motion.div>
  );
}
