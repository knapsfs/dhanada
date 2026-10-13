import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { comparisonData } from '../../data/data'

export default function Comparison() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="comparison" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            ⚖️ Smart Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why SIF <span className="gradient-text">Stands Out</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
            Compare investment options side by side and understand how SIF differs from Mutual Funds, PMS and AIFs.
          </p>
        </motion.div>

        {/* Mobile Horizontal Scroll Hint */}
        <div className="flex sm:hidden items-center justify-end gap-1.5 text-xs text-gray-400 font-medium mb-2.5 px-1">
          <svg className="w-3.5 h-3.5 animate-pulse text-[#032e92]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span>Scroll horizontally to view all</span>
        </div>

        {/* Table Container with Sticky First Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative overflow-x-auto rounded-2xl sm:rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 bg-white"
        >
          <table className="w-full min-w-[620px] sm:min-w-[720px] border-separate border-spacing-0">
            {/* Header */}
            <thead>
              <tr>
                {/* Fixed "Feature" Column */}
                <th className="sticky left-0 z-20 bg-gray-50/95 backdrop-blur-sm px-4 sm:px-6 py-4 sm:py-5 text-left text-xs sm:text-sm font-semibold text-gray-500 w-36 sm:w-48 min-w-[130px] sm:min-w-[170px] border-b border-r border-[#e8edf7] shadow-[4px_0_10px_-2px_rgba(0,0,0,0.06)]">
                  Feature
                </th>
                {comparisonData.headers.slice(1).map((header) => {
                  const isSIF = header === 'SIF';
                  return (
                    <th
                      key={header}
                      className={`px-4 sm:px-5 py-4 sm:py-5 text-center text-xs sm:text-sm font-bold border-b border-[#e8edf7] ${isSIF
                        ? 'bg-[#032e92] text-white rounded-t-2xl shadow-lg min-w-[140px] sm:min-w-[180px]'
                        : 'bg-gray-50 text-gray-700 min-w-[100px] sm:min-w-[130px]'
                        }`}
                    >
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonData.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="group transition-colors"
                >
                  {/* Fixed "Feature" Column Cell */}
                  <td
                    className={`sticky left-0 z-10 px-4 sm:px-6 py-4 border-b border-r border-[#e8edf7] shadow-[4px_0_10px_-2px_rgba(0,0,0,0.06)] transition-colors ${ri % 2 === 0
                      ? 'bg-white group-hover:bg-[#f1f5fa]'
                      : 'bg-[#f7f9fc] group-hover:bg-[#f1f5fa]'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-snug">
                        {row.feature}
                      </span>
                    </div>
                  </td>

                  {/* Scrollable Value Cells */}
                  {row.values.map((val, vi) => {
                    const isSIF = comparisonData.headers.slice(1)[vi] === 'SIF';
                    return (
                      <td
                        key={vi}
                        className={`px-4 sm:px-5 py-4 text-center border-b border-[#e8edf7] transition-colors ${isSIF
                          ? 'bg-[#032e92]/5 group-hover:bg-[#032e92]/10 border-x border-[#032e92]/10'
                          : ri % 2 === 0
                            ? 'bg-white group-hover:bg-[#f7f9fc]'
                            : 'bg-gray-50/50 group-hover:bg-[#f7f9fc]'
                          }`}
                      >
                        {val === 'Yes' ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 text-xs" />
                          </span>
                        ) : val === 'No' ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                            <FontAwesomeIcon icon={faXmark} className="text-red-500 text-xs" />
                          </span>
                        ) : (
                          <span
                            className={`text-xs sm:text-sm font-semibold ${isSIF ? 'text-[#032e92]' : 'text-gray-600'
                              }`}
                          >
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
