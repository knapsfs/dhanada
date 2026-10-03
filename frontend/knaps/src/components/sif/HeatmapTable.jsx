import { useState } from 'react';
import { motion } from 'framer-motion';
import HeatmapTooltip from './HeatmapTooltip';

// Descending order (Recent to Old)
const monthsConfig = [
  { key: 'sep_26', label: "SEPT '26", date: '2026-09-01' },
  { key: 'aug_26', label: "AUG '26", date: '2026-08-01' },
  { key: 'jul_26', label: "JUL '26", date: '2026-07-01' },
  { key: 'jun_26', label: "JUN '26", date: '2026-06-01' },
  { key: 'may_26', label: "MAY '26", date: '2026-05-01' },
  { key: 'apr_26', label: "APR '26", date: '2026-04-01' },
  { key: 'mar_26', label: "MAR '26", date: '2026-03-01' },
  { key: 'feb_26', label: "FEB '26", date: '2026-02-01' },
  { key: 'jan_26', label: "JAN '26", date: '2026-01-01' },
  { key: 'dec_25', label: "DEC '25", date: '2025-12-01' },
  { key: 'nov_25', label: "NOV '25", date: '2025-11-01' },
  { key: 'oct_25', label: "OCT '25", date: '2025-10-01' },
  { key: 'sep_25', label: "SEPT '25", date: '2025-09-01' },
];

const getCellColor = (val) => {
  if (val === undefined || val === null || val === 'N/A' || val === 'N/L' || val === 'NL') {
    return 'bg-gray-50 text-gray-400 font-medium border border-gray-100';
  }
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) {
    return 'bg-gray-50 text-gray-400 font-medium border border-gray-100';
  }

  // Deep green
  if (num >= 5.0) return 'bg-[#15803d] text-white font-bold shadow-sm';
  // Rich green
  if (num >= 2.5) return 'bg-[#22c55e] text-white font-bold shadow-sm';
  // Soft pastel green
  if (num > 0) return 'bg-[#bbf7d0] text-emerald-950 font-semibold';
  // Flat zero
  if (num === 0) return 'bg-[#f3f4f6] text-gray-700 font-semibold';
  // Soft pastel pink / light red
  if (num > -1.5) return 'bg-[#ffe4e6] text-rose-900 font-semibold';
  // Medium pink-red
  if (num > -4.5) return 'bg-[#fda4af] text-rose-950 font-bold';
  // Deep dark red / burgundy
  return 'bg-[#881337] text-white font-bold shadow-sm';
};

// Return actual database month return or N/A if not in DB
function getFundMonthlyReturn(fund, month) {
  // 1. Check if present in database monthlyReturns map (supports "sep_26" and "2026-09" formats)
  if (fund?.monthlyReturns) {
    if (fund.monthlyReturns[month.key] !== undefined && fund.monthlyReturns[month.key] !== null) {
      const val = fund.monthlyReturns[month.key];
      return typeof val === 'number' ? val : parseFloat(val);
    }
    const datePrefix = month.date ? month.date.substring(0, 7) : null;
    if (datePrefix && fund.monthlyReturns[datePrefix] !== undefined && fund.monthlyReturns[datePrefix] !== null) {
      const val = fund.monthlyReturns[datePrefix];
      return typeof val === 'number' ? val : parseFloat(val);
    }
  }

  // 2. Direct property fallback
  if (fund && fund[month.key] !== undefined && fund[month.key] !== null) {
    const val = fund[month.key];
    return typeof val === 'number' ? val : parseFloat(val);
  }

  return 'N/A';
}

export default function HeatmapTable({ funds = [], timeFilter = '12M', activeSubCategoryLabel }) {
  const [tooltipData, setTooltipData] = useState(null);

  // Handle mouse move for tooltip
  const handleMouseMove = (e, fund, monthLabel, returnVal) => {
    setTooltipData({
      x: e.clientX,
      y: e.clientY,
      fundName: fund.name,
      category: activeSubCategoryLabel || fund.category,
      month: monthLabel,
      returnVal: returnVal != null ? returnVal : 'N/A',
      isPositive: typeof returnVal === 'number' && returnVal > 0,
      isNegative: typeof returnVal === 'number' && returnVal < 0,
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  // Determine periods to show based on timeFilter (Recent months first)
  let displayMonths = monthsConfig;
  if (timeFilter === '3M') {
    displayMonths = monthsConfig.slice(0, 4); // Most recent 4 months (SEPT '26, AUG '26, JUL '26, JUN '26)
  } else if (timeFilter === '6M') {
    displayMonths = monthsConfig.slice(0, 7); // Most recent 7 months (SEPT '26 to MAR '26)
  } else if (timeFilter === '12M' || timeFilter === 'All') {
    displayMonths = monthsConfig; // All 13 months descending
  }

  return (
    <div className="flex-1 w-full bg-white relative">
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto w-full [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-slate-100/60 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#032e92] pb-2">
        <table className="w-full min-w-[650px] border-collapse">
          <thead className="sticky top-0 z-30 bg-white shadow-xs">
            {/* Category label indicator header */}
            {activeSubCategoryLabel && (
              <tr className="bg-[#f8faff] border-b border-[#e8edf7]">
                <th colSpan={displayMonths.length + 1} className="py-2.5 px-4 text-left bg-[#f8faff]">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    {activeSubCategoryLabel}
                  </span>
                </th>
              </tr>
            )}
            <tr className="border-b border-[#e8edf7] bg-white">
              <th className="sticky left-0 bg-white z-30 py-4 px-3 sm:px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px] sm:min-w-[220px] lg:min-w-[280px]">
                FUND
              </th>
              {displayMonths.map((m) => (
                <th
                  key={m.key}
                  className="py-4 px-2 text-center text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[75px] sm:min-w-[90px] bg-white"
                >
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {funds.map((fund, index) => (
              <motion.tr
                key={fund.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="group border-b border-[#e8edf7] last:border-0 hover:bg-[#f8faff]/80 transition-colors"
              >
                {/* Fund Name & Category Column */}
                <td className="sticky left-0 bg-white group-hover:bg-[#f8faff] z-10 py-3.5 px-3 sm:px-4 transition-colors">
                  <div className="flex flex-col overflow-hidden max-w-[140px] sm:max-w-[210px] lg:max-w-[270px]">
                    <p className="font-bold text-xs sm:text-sm text-gray-900 truncate leading-tight" title={fund.name}>
                      {fund.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-normal truncate mt-0.5 leading-tight">
                      {fund.category || fund.amc}
                    </p>
                  </div>
                </td>

                {/* Monthly Return Cells */}
                {displayMonths.map((m) => {
                  const val = getFundMonthlyReturn(fund, m);
                  const isNA = val === 'N/A' || val === 'N/L';

                  return (
                    <td key={m.key} className="p-1 sm:p-1.5">
                      <motion.div
                        whileHover={{ scale: 1.04, zIndex: 10 }}
                        onMouseMove={(e) => handleMouseMove(e, fund, m.label, val)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-full h-9 sm:h-11 rounded-lg flex items-center justify-center text-[10px] sm:text-xs cursor-pointer shadow-xs transition-transform ${getCellColor(
                          val
                        )}`}
                      >
                        {isNA ? (
                          <span className="text-gray-400 font-medium text-[10px] sm:text-[11px]">N/A</span>
                        ) : (
                          <span>{typeof val === 'number' ? `${val > 0 ? '+' : ''}${val.toFixed(2)}%` : val}</span>
                        )}
                      </motion.div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}

            {funds.length === 0 && (
              <tr>
                <td
                  colSpan={displayMonths.length + 1}
                  className="py-12 text-center text-gray-500 font-medium text-xs sm:text-sm"
                >
                  No funds available in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {tooltipData && (
        <HeatmapTooltip data={tooltipData} position={{ x: tooltipData.x, y: tooltipData.y }} />
      )}
    </div>
  );
}
