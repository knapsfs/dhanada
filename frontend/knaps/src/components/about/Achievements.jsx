import { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate, useMotionValue, useTransform } from 'framer-motion';

function AnimatedCounter({ value, duration = 2.5, prefix = '', suffix = '' }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [display, setDisplay] = useState(prefix + "0" + suffix);

  useEffect(() => {
    const controls = animate(count, value, { duration });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplay(prefix + latest.toLocaleString() + suffix);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, prefix, suffix, count, rounded]);

  return <>{display}</>;
}
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faMoneyBillTrendUp, 
  faBriefcase, 
  faHandshakeAngle, 
  faBuildingUser, 
  faUserTie 
} from '@fortawesome/free-solid-svg-icons';

const achievements = [
  { icon: faUsers, value: 10000, suffix: '+', label: 'Happy Investors' },
  { icon: faMoneyBillTrendUp, value: 500, prefix: '₹', suffix: 'Cr+', label: 'Assets Managed' },
  { icon: faBriefcase, value: 15, suffix: '+', label: 'Years Experience' },
  { icon: faHandshakeAngle, value: 98, suffix: '%', label: 'Client Retention' },
  { icon: faBuildingUser, value: 150, suffix: '+', label: 'Corporate Clients' },
  { icon: faUserTie, value: 25, suffix: '+', label: 'Expert Advisors' },
];

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 bg-[#032e92] relative overflow-hidden" ref={ref}>
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-white to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#c10000] to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-white/20 text-blue-100 bg-white/5 backdrop-blur-sm font-semibold text-sm mb-4 tracking-wider uppercase"
          >
            By The Numbers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Success</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
          {achievements.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
              className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 text-center border border-white/10 hover:bg-white/10 transition-colors duration-300 group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#c10000] to-red-800 flex items-center justify-center text-white mb-6 shadow-lg shadow-[#c10000]/20 group-hover:-translate-y-2 transition-transform duration-300">
                <FontAwesomeIcon icon={item.icon} className="text-2xl" />
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                {isInView ? (
                  <AnimatedCounter 
                    value={item.value} 
                    duration={2.5} 
                    prefix={item.prefix || ''}
                    suffix={item.suffix || ''}
                  />
                ) : (
                  "0"
                )}
              </h3>
              
              <p className="text-blue-200 font-medium uppercase tracking-wide text-xs md:text-sm">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
