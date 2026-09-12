import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuildingColumns, faShieldHeart, faLandmark, 
  faPiggyBank, faChartPie, faCoins 
} from '@fortawesome/free-solid-svg-icons';

const partners = [
  { name: 'HDFC Bank', icon: faBuildingColumns, type: 'Bank' },
  { name: 'SBI Mutual Fund', icon: faChartPie, type: 'Mutual Fund' },
  { name: 'ICICI Prudential', icon: faShieldHeart, type: 'Insurance' },
  { name: 'Axis Bank', icon: faLandmark, type: 'Bank' },
  { name: 'Nippon India', icon: faPiggyBank, type: 'Mutual Fund' },
  { name: 'Kotak Life', icon: faShieldHeart, type: 'Insurance' },
  { name: 'Tata Mutual Fund', icon: faChartPie, type: 'Mutual Fund' },
  { name: 'Bajaj Finance', icon: faCoins, type: 'NBFC' },
];

export default function TrustBar() {
  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          Trusted by Top Financial Institutions
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Gradient overlays for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

        <motion.div
          animate={{ x: [0, -1036] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
          className="flex gap-16 items-center whitespace-nowrap px-8"
        >
          {/* Double the array for seamless infinite scroll */}
          {[...partners, ...partners].map((partner, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 group cursor-pointer transition-all duration-300 filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#eef5ff] flex items-center justify-center transition-colors">
                <FontAwesomeIcon 
                  icon={partner.icon} 
                  className="text-gray-400 group-hover:text-[#032e92] text-lg transition-colors" 
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-700 group-hover:text-[#032e92] transition-colors">{partner.name}</h4>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{partner.type}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
