import { useEffect, useState } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { id: 1, value: 10000, suffix: '+', label: 'Happy Investors' },
  { id: 2, value: 500, prefix: '₹', suffix: 'Cr+', label: 'Assets Managed' },
  { id: 3, value: 15, suffix: '+', label: 'Years Experience' },
  { id: 4, value: 98, suffix: '%', label: 'Client Satisfaction' },
];

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

export default function Stats() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="py-20 bg-white relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#032e92] to-[#021d63] rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-blue-900/20">

          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#c10000]/20 rounded-full blur-3xl mix-blend-overlay"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 relative z-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col items-center justify-center text-center ${idx > 1 ? 'pt-8 md:pt-0' : idx > 0 && idx < 2 ? 'pt-8 sm:pt-0 md:pt-0' : ''}`}
              >
                <div className="text-4xl md:text-5xl font-semibold text-white mb-2 tracking-tight">
                  {inView ? (
                    <AnimatedCounter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <p className="text-blue-100 font-medium text-sm md:text-base uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
