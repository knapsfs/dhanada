import { motion } from 'framer-motion';

// Partner Logos
import whiteOakLogo from '../assets/partners-logo/white-oak.png';
import adityaBirlaLogo from '../assets/partners-logo/aditya-birla.png';
import bajajLogo from '../assets/partners-logo/bajaj.png';
import hdfcLogo from '../assets/partners-logo/hdfc.png';
import iciciLogo from '../assets/partners-logo/icici.png';
import edelweissLogo from '../assets/partners-logo/EDELWEISS.png';
import tataLogo from '../assets/partners-logo/tata.png';
import unionLogo from '../assets/partners-logo/union.png';
import utiLogo from '../assets/partners-logo/uti.png';
import dspLogo from '../assets/partners-logo/dsp.png';
import hsbcLogo from '../assets/partners-logo/hsbc.png';
import sbiLogo from '../assets/partners-logo/sbi.png';

const partners = [
  { name: 'White Oak', logo: whiteOakLogo, type: 'Capital Management' },
  { name: 'Aditya Birla', logo: adityaBirlaLogo, type: 'Capital' },
  { name: 'Bajaj', logo: bajajLogo, type: 'Asset Management' },
  { name: 'HDFC', logo: hdfcLogo, type: 'Asset Management' },
  { name: 'ICICI Prudential', logo: iciciLogo, type: 'Mutual Fund' },
  { name: 'Edelweiss', logo: edelweissLogo, type: 'Mutual Fund' },
  { name: 'Tata', logo: tataLogo, type: 'Mutual Fund' },
  { name: 'UNION', logo: unionLogo, type: 'Mutual Fund' },
  { name: 'UTI', logo: utiLogo, type: 'Asset Management' },
  { name: 'DSP', logo: dspLogo, type: 'Mutual Fund' },
  { name: 'HSBC', logo: hsbcLogo, type: 'Mutual Fund' },
  { name: 'SBI', logo: sbiLogo, type: 'Mutual Fund' },
];

export default function TrustBar() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          Our Partners
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Gradient overlays for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
          className="flex gap-16 items-center whitespace-nowrap px-8"
        >
          {/* Double the array for seamless infinite scroll */}
          {[...partners, ...partners].map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 group cursor-pointer transition-all duration-300 filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 shrink-0"
            >
              <div className="w-11 h-11 bg-white p-1 flex items-center justify-center transition-all overflow-hidden shrink-0">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
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
