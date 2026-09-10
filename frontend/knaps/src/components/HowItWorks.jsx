import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandshake, faComments, faChartPie, 
  faLayerGroup, faCheckCircle, faFileSignature, faBullseye 
} from '@fortawesome/free-solid-svg-icons';

const steps = [
  { 
    id: '01', 
    title: 'Connect through referrals, leads', 
    icon: faHandshake,
    description: 'We initiate our relationship by connecting with you through our trusted network of referrals and organic leads.'
  },
  { 
    id: '02', 
    title: 'Understand your needs', 
    icon: faComments,
    description: 'Our first priority is to listen and deeply understand your current financial situation and future aspirations.'
  },
  { 
    id: '03', 
    title: 'Assess your risk profile', 
    icon: faChartPie,
    description: 'Using scientific methods, we evaluate your risk tolerance to ensure strategies align with your comfort level.'
  },
  { 
    id: '04', 
    title: 'Do asset allocation based on risk appetite', 
    icon: faLayerGroup,
    description: 'We design a robust and diversified asset allocation strategy across equity, debt, and alternative investments.'
  },
  { 
    id: '05', 
    title: 'Determine your Product suitability', 
    icon: faCheckCircle,
    description: 'We meticulously filter and select the specific investment vehicles that strictly align with your strategy.'
  },
  { 
    id: '06', 
    title: 'Onboard you through registration form', 
    icon: faFileSignature,
    description: 'Our digital onboarding process is seamless, entirely paperless, and incredibly fast to get you started.'
  },
  { 
    id: '07', 
    title: 'Be with you until your financial goals are met', 
    icon: faBullseye,
    description: 'We continuously monitor your portfolio, provide regular reviews, and stay by your side until goals are met.'
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-6 tracking-wide"
          >
            How it works
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6"
          >
            How Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032e92] to-[#c10000]">Process</span> Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Our wealth management process is simple, fast, and produces amazing results in just a few easy steps.
          </motion.p>
        </div>

        {/* 4-Column Grid matching the reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group h-full"
            >
              <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col h-full">
                
                {/* Top Visual Area */}
                <div className="relative h-56 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                  {/* Concentric rings background */}
                  <div className="absolute w-[300px] h-[300px] border border-[#032e92]/10 rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100"></div>
                  <div className="absolute w-[220px] h-[220px] border border-[#032e92]/20 rounded-full scale-50 group-hover:scale-100 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100"></div>
                  <div className="absolute w-[140px] h-[140px] border border-[#032e92]/30 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100"></div>
                  
                  {/* Central Icon */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#032e92] to-[#011240] text-white flex items-center justify-center text-2xl shadow-lg shadow-[#032e92]/30 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                </div>

                {/* Bottom Text Area */}
                <div className="p-8 flex flex-col flex-grow bg-white z-20">
                  <div className="text-sm font-bold text-[#c10000] mb-3 tracking-wide">
                    Step {parseInt(step.id)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
