import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CalculatorNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const calculators = [
    { name: 'SIP Calculator', path: '/calculators/sip' },
    { name: 'Step Up SIP', path: '/calculators/step-up-sip' },
    { name: 'SWP Calculator', path: '/calculators/swp' },
    { name: 'Lumpsum Calculator', path: '/calculators/lumpsum' },
    { name: 'Retirement Calculator', path: '/calculators/retirement' },
    { name: 'Future Value', path: '/calculators/future-value' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:border-l lg:border-white/20 lg:pl-5"
    >
      <p className="text-[10px] uppercase font-bold tracking-widest text-blue-200/60 mb-2">
        Explore Calculators
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-x-4 gap-y-1.5">
        {calculators.map((calc, i) => {
          const isActive = currentPath === calc.path;
          return (
            <Link
              key={i}
              to={calc.path}
              className={`text-xs sm:text-[13px] transition-colors duration-150 py-0.5 flex items-center gap-2 ${isActive
                  ? 'text-white font-bold lg:-ml-[21px] lg:pl-5 lg:border-l-2 lg:border-amber-400'
                  : 'text-blue-200/70 hover:text-white font-medium'
                }`}
            >
              {isActive && (
                <span className="lg:hidden w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              )}
              <span className="truncate">{calc.name}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
