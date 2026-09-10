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

const expertiseStats = [
  { label: 'Mutual Funds', percentage: 95 },
  { label: 'Portfolio Management Services (PMS)', percentage: 92 },
  { label: 'Alternative Investment Funds (AIF)', percentage: 88 },
  { label: 'Insurance Planning', percentage: 90 },
  { label: 'Retirement Planning', percentage: 94 },
];

export default function Expertise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#f7f9fc]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Infographic Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#eef4ff] rounded-full blur-[80px] -z-10"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" 
              alt="Financial Data Analysis" 
              className="rounded-3xl shadow-2xl relative z-10 w-full h-auto object-cover max-h-[500px]"
            />
            
            {/* Floating glass card over image */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 bg-white/80 backdrop-blur-xl border border-white p-6 rounded-2xl shadow-xl z-20 hidden sm:block"
            >
              <p className="text-gray-500 font-medium text-sm mb-1">Total Assets</p>
              <p className="text-3xl font-bold text-[#032e92]">₹500Cr+</p>
            </motion.div>
          </motion.div>

          {/* Right Side: Progress Bars */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[#c10000] font-semibold text-sm uppercase tracking-wider mb-4 block">Our Expertise</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Proven Competence in Wealth Creation</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our team possesses deep domain knowledge across a wide spectrum of financial instruments, allowing us to build robust and diversified portfolios.
              </p>
            </motion.div>

            <div className="space-y-8">
              {expertiseStats.map((stat, idx) => (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-gray-900 text-[15px]">{stat.label}</span>
                    <span className="font-bold text-[#032e92]">
                      {isInView ? (
                        <AnimatedCounter value={stat.percentage} duration={2} suffix="%" />
                      ) : (
                        "0%"
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-[#032e92] to-[#c10000] h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${stat.percentage}%` } : { width: 0 }}
                      transition={{ duration: 1.5, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

        </div>

      </div>
    </section>
  );
}
