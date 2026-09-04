import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { comparisonData } from '../data/data'

export default function Comparison() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="comparison" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            ⚖️ Smart Comparison
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why SIF <span className="gradient-text">Stands Out</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Compare investment options side by side and understand how SIF differs from Mutual Funds, PMS and AIFs.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="overflow-x-auto rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5">
          <table className="w-full min-w-[700px]">
            {/* Header */}
            <thead>
              <tr className="border-b border-[#e8edf7]">
                <th className="bg-gray-50 px-6 py-5 text-left text-sm font-semibold text-gray-400 w-40">Feature</th>
                {comparisonData.headers.slice(1).map((header) => {
                  const isSIF = header === 'SIF';
                  return (
                    <th key={header}
                      className={`px-5 py-5 text-center text-sm font-bold ${
                        isSIF
                          ? 'bg-[#032e92] text-white rounded-t-2xl shadow-lg'
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonData.rows.map((row, ri) => (
                <tr key={ri}
                  className={`border-b border-[#e8edf7] transition-colors hover:bg-[#f7f9fc] ${
                    ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-xs" />
                      <span className="text-sm font-semibold text-gray-600">{row.feature}</span>
                    </div>
                  </td>
                  {row.values.map((val, vi) => {
                    const isSIF = comparisonData.headers.slice(1)[vi] === 'SIF';
                    return (
                      <td key={vi} className={`px-5 py-4 text-center ${
                        isSIF ? 'bg-[#032e92]/5 border-x border-[#032e92]/10' : ''
                      }`}>
                        {val === 'Yes' ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 text-xs" />
                          </span>
                        ) : val === 'No' ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                            <FontAwesomeIcon icon={faXmark} className="text-red-500 text-xs" />
                          </span>
                        ) : (
                          <span className={`text-sm font-semibold ${
                            isSIF ? 'text-[#032e92]' : 'text-gray-600'
                          }`}>{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-6 text-sm text-gray-500 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
        >
          <span className="font-bold text-[#032e92]">SIF Note :</span> ₹10 lakh aggregate minimum investment across the SIF's investment strategies at the PAN level; this requirement does not apply to accredited investors. Risk level is also strategy-dependent.
        </motion.div>
      </div>
    </section>
  )
}
