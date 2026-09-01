import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { getRiskLevelConfig } from '../utils/risk'

export default function Riskometer({ fund }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const risk = getRiskLevelConfig(fund.riskLevel)

  // 5 segments of 36 degrees each across 180 degrees (from 180° left to 0° right)
  const segments = [
    { label: 'Low', color: '#16a34a', lightColor: '#dcfce7', textCol: 'text-green-700', level: 1 },
    { label: 'Low to Moderate', color: '#84cc16', lightColor: '#ecfccb', textCol: 'text-lime-700', level: 2 },
    { label: 'Moderate', color: '#eab308', lightColor: '#fef9c3', textCol: 'text-amber-700', level: 3 },
    { label: 'High', color: '#f97316', lightColor: '#ffedd5', textCol: 'text-orange-700', level: 4 },
    { label: 'Very High', color: '#dc2626', lightColor: '#fee2e2', textCol: 'text-red-700', level: 5 }
  ]

  const levelNum = risk.level !== 'N/A' ? parseInt(risk.level, 10) : 5
  // Needle rotation from left horizontal (0 deg = 180° on circle, pointing left)
  // Level 1: 18 deg, Level 2: 54 deg, Level 3: 90 deg, Level 4: 126 deg, Level 5: 162 deg
  const needleAngle = 18 + (Math.max(1, Math.min(5, levelNum)) - 1) * 36

  const cx = 150
  const cy = 145
  const r = 105
  const strokeWidth = 26
  const gap = 2.5 // degrees gap between segments

  return (
    <section className="scroll-mt-32 pt-8 border-t border-[#e8edf7]" id="riskometer" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-[#e8edf7]">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Risk-o-Meter</h2>
            <p className="text-xs text-gray-400 font-medium">SEBI standardized scheme risk evaluation</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${risk.bg || 'bg-red-100'} ${risk.text || 'text-red-700'} border ${risk.border || 'border-red-200'}`}>
            Level {risk.level} of 5
          </span>
        </div>

        {/* Meter SVG Container */}
        <div className="relative w-72 h-40 sm:w-88 sm:h-48 flex justify-center items-end my-4">
          <svg viewBox="0 0 300 165" className="w-full h-full overflow-visible">
            <defs>
              <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Background subtle guide track */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth + 4}
              strokeLinecap="round"
            />

            {/* 5 Risk Segments */}
            {segments.map((seg, i) => {
              // Angles in standard polar coords (180° = Left, 0° = Right)
              const startAngle = 180 - i * 36 - gap / 2
              const endAngle = 180 - (i + 1) * 36 + gap / 2

              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180

              const x1 = cx + r * Math.cos(startRad)
              const y1 = cy - r * Math.sin(startRad)
              const x2 = cx + r * Math.cos(endRad)
              const y2 = cy - r * Math.sin(endRad)

              const isActive = seg.level === levelNum

              return (
                <g key={seg.label}>
                  <path
                    d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    opacity={isActive ? 1 : 0.82}
                  />
                </g>
              )
            })}

            {/* Animated Needle */}
            <g
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transform: `rotate(${needleAngle}deg)`,
                transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              filter="url(#needleGlow)"
            >
              {/* Needle pointing to the Left (0 deg position) */}
              <path
                d={`M ${cx} ${cy - 4} L ${cx - (r - 18)} ${cy} L ${cx} ${cy + 4} Z`}
                fill="#1e293b"
              />
              {/* Center Pivot circles */}
              <circle cx={cx} cy={cy} r="10" fill="#1e293b" />
              <circle cx={cx} cy={cy} r="4" fill="#ffffff" />
            </g>
          </svg>
        </div>

        {/* Risk Level Output Badge */}
        <div className="mt-2 text-center flex flex-col items-center">
          <motion.p 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={`text-2xl font-black uppercase tracking-wider ${
              levelNum === 5 ? 'text-red-600' :
              levelNum === 4 ? 'text-orange-500' :
              levelNum === 3 ? 'text-amber-500' :
              levelNum === 2 ? 'text-lime-600' : 'text-green-600'
            }`}
          >
            {risk.label}
          </motion.p>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
            Risk Level {risk.level} of 5
          </p>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-6 pt-5 border-t border-dashed border-[#e8edf7] text-center w-full">
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Investors understand that their principal will be at <span className="font-bold text-gray-600">{risk.label}</span> risk. The Risk-o-meter is based on the scheme portfolio and is subject to periodic review and change according to SEBI regulations.
          </p>
        </div>
      </motion.div>
    </section>
  )
}