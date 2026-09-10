import { motion } from 'framer-motion';

export default function RiskResult({ result, onRetake }) {
  const categories = ['Conservative', 'Balanced', 'Moderately Aggressive', 'Aggressive', 'Very Aggressive'];
  const profileIndex = categories.indexOf(result.profile);
  const positionPercentage = (profileIndex / (categories.length - 1)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto w-full"
    >
      <div className="text-center mb-12">
        <h2 className="text-[#032e92] font-bold tracking-widest uppercase text-sm mb-4">
          Your Indicative Risk Profile
        </h2>
        <h3 className="text-4xl md:text-5xl font-black text-[#0a192f] mb-6">
          {result.profile}
        </h3>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {result.description}
        </p>
      </div>
      
      {/* Risk Meter */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-gray-100 mb-12 relative overflow-hidden">
        <div className="relative pt-8 pb-4 w-full">
          {/* Base line */}
          <div className="h-2 bg-gray-100 rounded-full w-full"></div>
          
          {/* Fill line */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${positionPercentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-2 bg-gradient-to-r from-blue-300 to-[#032e92] rounded-full absolute top-8 left-0"
          ></motion.div>
          
          {/* Pointer */}
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${positionPercentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          >
            <div className="bg-[#0a192f] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-1 whitespace-nowrap">
              YOU
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0a192f]"></div>
            <div className="w-5 h-5 rounded-full bg-white border-4 border-[#032e92] mt-1 shadow-md"></div>
          </motion.div>
          
          {/* Labels */}
          <div className="flex justify-between mt-6 px-1">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 text-center w-1/5 -ml-2">Conservative</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 text-center w-1/5">Balanced</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 text-center w-1/5">Moderate</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 text-center w-1/5">Aggressive</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 text-center w-1/5 -mr-2">Very Aggressive</span>
          </div>
        </div>
      </div>
      
      {/* Assessment Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Risk Comfort</p>
          <p className="text-[#0a192f] font-black">{result.metrics.riskComfort}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Flexibility</p>
          <p className="text-[#0a192f] font-black">{result.metrics.financialFlexibility}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Experience</p>
          <p className="text-[#0a192f] font-black">{result.metrics.experience}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Horizon</p>
          <p className="text-[#0a192f] font-black">{result.metrics.horizon}</p>
        </div>
      </div>
      
      {/* What it means */}
      <div className="bg-[#032e92] text-white rounded-3xl p-8 md:p-12 mb-12 text-center md:text-left md:flex items-center gap-10">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <h3 className="text-2xl font-black leading-tight">What Your Profile Means</h3>
        </div>
        <div className="md:w-2/3">
          <p className="text-blue-100 leading-relaxed text-lg">
            Your responses suggest that you may be comfortable with {profileIndex > 2 ? 'a relatively higher level of investment volatility' : profileIndex < 2 ? 'prioritizing stability over aggressive growth' : 'a balanced approach to volatility and growth'}. However, risk tolerance is only one part of an investment decision. Your goals, liquidity needs, financial responsibilities, investment horizon and overall financial circumstances also matter.
          </p>
        </div>
      </div>
      
      {/* Explore Concepts */}
      <h3 className="text-2xl font-black text-[#0a192f] mb-8 text-center">Explore Investment Concepts</h3>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group cursor-pointer">
          <h4 className="text-xl font-bold text-[#0a192f] mb-3">Mutual Funds</h4>
          <p className="text-gray-600 mb-6">Learn about diversified market-linked investment strategies tailored to various risk profiles.</p>
          <span className="text-[#032e92] font-bold group-hover:underline">Explore &rarr;</span>
        </div>
        <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group cursor-pointer">
          <h4 className="text-xl font-bold text-[#0a192f] mb-3">NPS</h4>
          <p className="text-gray-600 mb-6">Explore long-term retirement planning concepts and their associated benefits.</p>
          <span className="text-[#032e92] font-bold group-hover:underline">Explore &rarr;</span>
        </div>
        {profileIndex >= 2 && (
          <>
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group cursor-pointer">
              <h4 className="text-xl font-bold text-[#0a192f] mb-3">SIF</h4>
              <p className="text-gray-600 mb-6">Understand Specialized Investment Funds and their applicable framework for sophisticated investors.</p>
              <span className="text-[#032e92] font-bold group-hover:underline">Explore &rarr;</span>
            </div>
            <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#032e92] transition-all bg-white group cursor-pointer">
              <h4 className="text-xl font-bold text-[#0a192f] mb-3">AIF</h4>
              <p className="text-gray-600 mb-6">Learn how Alternative Investment Funds and alternative strategies work.</p>
              <span className="text-[#032e92] font-bold group-hover:underline">Explore &rarr;</span>
            </div>
          </>
        )}
      </div>
      
      {/* CTA */}
      <div className="bg-gray-50 rounded-3xl p-10 text-center border border-gray-200 mb-12">
        <h3 className="text-2xl font-black text-[#0a192f] mb-4">Want to discuss your investment goals?</h3>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Our financial professionals can help you align your indicative risk profile with actionable investment solutions.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 rounded-xl font-bold bg-[#0a192f] text-white hover:bg-[#032e92] transition-all shadow-lg hover:-translate-y-0.5">
            Talk to a Financial Professional &rarr;
          </button>
          <a href="#services" className="px-8 py-4 rounded-xl font-bold bg-white text-[#0a192f] border-2 border-gray-200 hover:border-[#0a192f] transition-all">
            Explore Our Services &rarr;
          </a>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <button onClick={onRetake} className="text-gray-500 font-bold hover:text-[#032e92] transition-colors">
          &#8634; Retake Assessment
        </button>
      </div>
      
      <p className="text-[10px] text-gray-400 text-center leading-relaxed max-w-4xl mx-auto border-t border-gray-100 pt-8">
        This assessment provides an indicative risk profile based on the information provided by you. It is intended for educational purposes and does not constitute investment, financial, tax or legal advice, or a recommendation or determination of suitability for any investment product. Your risk profile may change as your financial circumstances, goals and experience change. Investment products are subject to market risks and returns are not guaranteed.
      </p>
    </motion.div>
  );
}
