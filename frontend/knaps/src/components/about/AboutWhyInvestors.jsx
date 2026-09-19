import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function AboutWhyInvestors() {
  const checklist = [
    "Experienced Advisors",
    "Personalised Strategies",
    "Transparent Process",
    "Long-Term Focus",
    "SEBI Compliant"
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0a192f] leading-tight mb-6">
              Why Thousands of Investors Trust Us
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg">
              We eliminate the guesswork from wealth creation. Our systematic, research-backed methodology ensures that every investment decision aligns perfectly with your distinct financial profile.
            </p>

            <ul className="space-y-4 mb-10">
              {checklist.map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 text-[#0a192f] font-medium text-[17px]"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#c10000] text-xl" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <button className="bg-white border-2 border-[#032e92] text-[#032e92] hover:bg-[#032e92] hover:text-white px-8 py-3.5 rounded-xl font-bold transition-colors duration-300 shadow-sm">
              Book Consultation
            </button>
          </motion.div>

          {/* Right - Dashboard Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative lg:ml-10"
          >
            <div className="relative bg-[#f8f9fa] rounded-[40px] p-8 border border-gray-100 shadow-2xl overflow-hidden aspect-square flex flex-col justify-between">
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-1">Total Portfolio Value</p>
                  <p className="text-[#0a192f] font-bold text-4xl">₹1,24,50,000</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  +18.4%
                </div>
              </div>

              {/* Fake Chart Graphics */}
              <div className="flex-1 relative mt-4">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-50">
                  <div className="border-b border-gray-200 w-full h-0"></div>
                  <div className="border-b border-gray-200 w-full h-0"></div>
                  <div className="border-b border-gray-200 w-full h-0"></div>
                  <div className="border-b border-gray-200 w-full h-0"></div>
                </div>
                
                {/* Growth Line */}
                <svg className="w-full h-full relative z-10" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path 
                    d="M 0 180 C 50 170, 100 120, 150 130 C 200 140, 250 80, 300 70 C 350 60, 380 20, 400 10" 
                    fill="none" 
                    stroke="#032e92" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 0 180 C 50 170, 100 120, 150 130 C 200 140, 250 80, 300 70 C 350 60, 380 20, 400 10 L 400 200 L 0 200 Z" 
                    fill="url(#gradient)" 
                    opacity="0.1" 
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#032e92" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Plot points */}
                <div className="absolute w-3 h-3 bg-[#c10000] rounded-full top-[10%] right-0 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_4px_rgba(193,0,0,0.2)]"></div>
              </div>

              {/* Bottom Info Blocks */}
              <div className="grid grid-cols-2 gap-4 mt-8 relative z-20">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-400 text-xs font-semibold mb-1">Mutual Funds</p>
                  <p className="text-[#0a192f] font-bold text-xl">₹85.2L</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-400 text-xs font-semibold mb-1">AIFs</p>
                  <p className="text-[#0a192f] font-bold text-xl">₹39.3L</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
