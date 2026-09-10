import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function AboutCompany() {
  const highlights = [
    "Personalized Financial Planning",
    "Experienced Investment Experts",
    "Transparent Advisory",
    "Goal-Based Wealth Management"
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Professional Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] shadow-2xl shadow-blue-900/10 border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" 
                alt="Corporate Office" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Experience Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 lg:-right-12 bg-white rounded-2xl p-6 shadow-xl border border-gray-50 flex items-center gap-5"
            >
              <div className="text-[#032e92] font-black text-5xl tracking-tighter">15+</div>
              <div className="text-gray-500 font-medium text-sm leading-tight uppercase tracking-wider">
                Years<br/>Experience
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8 mt-12 lg:mt-0"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f] leading-tight mb-8">
              Trusted Financial Advisors for Long-Term Wealth Creation
            </h2>
            
            <div className="space-y-6 text-gray-600 text-[17px] leading-relaxed mb-10">
              <p>
                At Knaps Financial Services, we are dedicated to securing your financial future through strategic, disciplined, and personalized investment planning. With over 15 years of industry experience, we navigate complex market cycles to deliver consistent growth and absolute peace of mind.
              </p>
              <p>
                We believe that wealth management is not a one-size-fits-all approach. Our certified experts take the time to understand your unique aspirations, risk tolerance, and time horizon, crafting bespoke portfolios that turn your financial goals into reality.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eef4ff] flex items-center justify-center text-[#032e92] shrink-0">
                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-[#032e92] hover:bg-[#021d63] text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-[#032e92]/20 hover:shadow-xl transition-all duration-300">
              Our Services
            </button>
            
          </motion.div>

        </div>

      </div>
    </section>
  );
}
