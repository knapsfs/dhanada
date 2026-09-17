import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../context/LeadModalContext';

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
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Enclosing Soft Card Container matching Reference Design */}
        <div className=" rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 ">

          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight"
            >
              Your Goals, Our Focus
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm sm:text-base text-gray-500 font-normal max-w-xl mx-auto mt-2 leading-relaxed"
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
                onClick={() => openLeadModal(`Goal: ${item.title}`)}
                className="bg-white rounded-[20px] sm:rounded-[22px] border border-slate-100/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(3,46,146,0.08)] hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group cursor-pointer overflow-hidden"
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
            className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#eef4ff] via-[#f7faff] to-[#edf4ff] border border-blue-100/70 p-6 sm:p-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xs"
          >
            {/* Left Checkpoints */}
            <div className="space-y-3.5 z-10 w-full lg:w-auto">
              {[
                'Stay invested for the long term',
                'Let compounding work for you',
                'Build the life you envision',
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100/90 text-[#032e92] flex items-center justify-center text-[10px] flex-shrink-0">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Center Playful Cursive Script */}
            <div className="z-10 text-center lg:text-left self-center">
              <span className="text-base sm:text-xl font-bold text-sky-700/60 italic tracking-wider select-none font-serif">
                Disciplined<br className="hidden sm:inline lg:hidden" /> Investing.
              </span>
            </div>

            {/* Right Compounding Growth Graph Graphic */}
            <div className="relative w-full sm:w-[320px] lg:w-[360px] h-[90px] flex items-end justify-end flex-shrink-0 overflow-hidden">
              {/* Histogram bars in background */}
              <div className="absolute inset-0 flex items-end justify-between px-2 opacity-25 pointer-events-none">
                {[20, 24, 28, 33, 39, 46, 54, 63, 73, 85, 95].map((height, i) => (
                  <div
                    key={i}
                    className="w-2.5 sm:w-3 bg-blue-400 rounded-t-xs"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              {/* Smooth Exponential Compounding Curve */}
              <svg
                className="w-full h-full relative z-10 overflow-visible"
                viewBox="0 0 340 90"
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="70%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 82 C 100 80, 200 68, 325 15"
                  stroke="url(#curveGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Glowing Pulse Dot at end */}
                <circle cx="325" cy="15" r="7" fill="#0284c7" opacity="0.3" />
                <circle cx="325" cy="15" r="4.5" fill="#0284c7" />
                <circle cx="325" cy="15" r="2" fill="#ffffff" />
              </svg>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
