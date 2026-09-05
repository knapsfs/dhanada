import { motion, useInView, animate, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

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

export default function AboutNumbers() {
  const stats = [
    { number: 10000, suffix: "+", title: "Happy Investors" },
    { number: 500, prefix: "₹", suffix: "Cr+", title: "Assets Managed" },
    { number: 15, suffix: "+", title: "Years Experience" },
    { number: 98, suffix: "%", title: "Client Satisfaction" }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white border-y border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 lg:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-3xl bg-[#f8f9fa] border border-gray-100 shadow-sm"
            >
              <h3 className="text-4xl lg:text-5xl font-black text-[#032e92] mb-2 tracking-tighter">
                {stat.prefix}
                {isInView ? (
                  <AnimatedCounter value={stat.number} duration={2.5} />
                ) : "0"}
                {stat.suffix}
              </h3>
              <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
