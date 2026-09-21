import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

import homeImg from '../assets/goals/goal_dream_home.jpg';
import marriageImg from '../assets/goals/goal_child_marriage.jpg';
import educationImg from '../assets/goals/goal_higher_education.jpg';
import retirementImg from '../assets/goals/goal_retirement.jpg';
import freedomImg from '../assets/goals/goal_financial_freedom.jpg';
import tourImg from '../assets/goals/goal_world_tour.jpg';

const goals = [
  {
    title: 'Dream Home',
    iconBg: 'bg-[#e0f0fe] text-[#0284c7]',
    image: homeImg,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Marriage',
    iconBg: 'bg-[#ffe4e6] text-[#e11d48]',
    image: marriageImg,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8.5" cy="13.5" r="5" />
        <circle cx="15.5" cy="13.5" r="5" />
        <path d="M14 8.5 L15.5 6.5 L17 8.5" />
      </svg>
    ),
  },
  {
    title: 'Higher Education',
    iconBg: 'bg-[#dcfce7] text-[#16a34a]',
    image: educationImg,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" />
      </svg>
    ),
  },
  {
    title: 'Retirement',
    iconBg: 'bg-[#fef3c7] text-[#d97706]',
    image: retirementImg,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 7.5c0-2.5-2-4.5-4.5-4.5 0 2.5 2 4.5 4.5 4.5z" />
        <path d="M11 7.5c0-2.5 2-4.5 4.5-4.5 0 2.5-2 4.5-4.5 4.5z" />
        <path d="M12 7.5c-2.5 0-4.5 2-4.5 4.5 2.5 0 4.5-2 4.5-4.5z" />
        <path d="M12 7.5c2.5 0 4.5 2 4.5 4.5-2.5 0-4.5-2-4.5-4.5z" />
        <path d="M12 7.5v13.5" />
      </svg>
    ),
  },
  {
    title: 'Financial Freedom',
    iconBg: 'bg-[#ede9fe] text-[#7c3aed]',
    image: freedomImg,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="14" width="4" height="7" rx="1" />
        <rect x="10" y="9" width="4" height="12" rx="1" />
        <rect x="16" y="4" width="4" height="17" rx="1" />
      </svg>
    ),
  },
  {
    title: 'World tour',
    iconBg: 'bg-[#cffafe] text-[#0891b2]',
    image: tourImg,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.5.1-1.8.7l-.5 1 5.5 3.5-3 3-2.5-.5-1 .5 2 2 2 2 .5-1-.5-2.5 3-3 3.5 5.5 1-.5c.6-.3.9-1 .7-1.8z" />
      </svg>
    ),
  },
];

export default function GoalFocus() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Enclosing Soft Card Container matching Reference Design */}
        <div className=" rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 ">

          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Header Tag */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-4 uppercase tracking-wider text-center"
            >
              GOAL FOCUS
            </motion.span>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0f172a] tracking-tight leading-tight text-center max-w-3xl mx-auto"
            >
              Your Goals, <span className="text-[#032e92] block sm:inline">Our Focus</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed mt-3.5 text-center"
            >
              Life has many milestones. We help you turn them into achievable goals.
            </motion.p>
          </div>

          {/* 6 Goals Cards Grid matching Reference Design */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4 mt-8 sm:mt-10">
            {goals.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.05 * idx }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[20px] sm:rounded-[22px] border border-slate-100/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(3,46,146,0.08)] hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                {/* Top Section: Pastel Icon Pill & Title */}
                <div className="pt-4 sm:pt-5 pb-3 px-2 sm:px-3 text-center flex flex-col items-center">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-108 ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-800 leading-tight mt-2.5 group-hover:text-[#032e92] transition-colors truncate w-full px-1">
                    {item.title}
                  </h3>
                </div>

                {/* Bottom Section: Inset Rounded Photo Card */}
                <div className="px-2.5 pb-2.5 sm:px-3 sm:pb-3 w-full">
                  <div className="w-full h-22 sm:h-24 lg:h-26 rounded-xl sm:rounded-2xl overflow-hidden relative shadow-2xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner with Compounding Curve */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#edf4ff] via-[#f7faff] to-[#edf4ff] border border-blue-100/90 p-6 sm:p-7 lg:py-7 lg:px-9 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 shadow-xs"
          >
            {/* Left Title: Disciplined Investing / The Power of Time */}
            <div className="z-10 text-left py-1 lg:py-0 shrink-0">
              <span className="text-2xl sm:text-3xl lg:text-[32px] font-bold bg-gradient-to-r from-[#032e92] via-[#0284c7] to-[#032e92] bg-clip-text text-transparent font-serif italic tracking-tight block">
                Disciplined Investing.
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest block mt-1">
                The Power of Time
              </span>
            </div>

            {/* Right Compounding Growth Graph Graphic */}
            <div className="relative w-full sm:w-[400px] md:w-[440px] lg:w-[480px] flex flex-col justify-end shrink-0">

              {/* Header Label Row Above Chart */}
              <div className="flex items-center justify-end mb-1.5 px-1">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 border border-sky-200/90 shadow-2xs text-[11px] font-bold text-[#032e92]">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-emerald-500 text-xs" />
                  <span>Compounding</span>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="relative w-full h-[125px] sm:h-[135px] lg:h-[145px] flex items-end">
                {/* Histogram bars in background (Static - already rendered) */}
                <div className="absolute inset-x-1 bottom-0 top-3 flex items-end justify-between px-1 opacity-25 pointer-events-none z-0">
                  {[14, 18, 23, 29, 36, 45, 55, 66, 78, 90, 100].map((height, i) => (
                    <div
                      key={i}
                      className="w-2.5 sm:w-3.5 bg-gradient-to-t from-blue-300 via-sky-400 to-blue-500 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                {/* Smooth Exponential Compounding Curve SVG */}
                <svg
                  className="w-full h-full relative z-10 overflow-visible"
                  viewBox="0 0 450 145"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Base Gradient for the Curve */}
                    <linearGradient id="curveGradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#93c5fd" />
                      <stop offset="40%" stopColor="#38bdf8" />
                      <stop offset="85%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#032e92" />
                    </linearGradient>

                    {/* Gradient for Traveling Pulse */}
                    <linearGradient id="surgeGradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                    </linearGradient>

                    {/* Shaded Area Under the Curve */}
                    <linearGradient id="curveAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#dbeafe" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area Under Curve (Static fill) */}
                  <path
                    d="M 10 138 C 125 136, 245 120, 335 76 C 388 50, 420 28, 438 14 L 438 144 L 10 144 Z"
                    fill="url(#curveAreaGradient)"
                  />

                  {/* Subtle Background Guideline Track */}
                  <path
                    d="M 10 138 C 125 136, 245 120, 335 76 C 388 50, 420 28, 438 14"
                    stroke="#93c5fd"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.35"
                  />

                  {/* Active Compounding Curve Line - Forms upward when section loads into view, then stays formed */}
                  <motion.path
                    d="M 10 138 C 125 136, 245 120, 335 76 C 388 50, 420 28, 438 14"
                    stroke="url(#curveGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.8,
                      ease: "easeOut"
                    }}
                  />

                  {/* Continuous Energy Surge Animation along the line */}
                  <motion.path
                    d="M 10 138 C 125 136, 245 120, 335 76 C 388 50, 420 28, 438 14"
                    stroke="url(#surgeGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="50 350"
                    animate={{ strokeDashoffset: [400, 0] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Apex Pulsing Radar Rings */}
                  <motion.circle
                    cx="438"
                    cy="14"
                    r="5.5"
                    fill="#0284c7"
                    animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "438px 14px" }}
                  />
                  <motion.circle
                    cx="438"
                    cy="14"
                    r="9.5"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    style={{ transformOrigin: "438px 14px" }}
                  />

                  {/* Apex Core Glowing Dot */}
                  <circle cx="438" cy="14" r="4.5" fill="#032e92" />
                  <circle cx="438" cy="14" r="2" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
