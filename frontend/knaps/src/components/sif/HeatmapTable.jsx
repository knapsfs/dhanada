import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import HeatmapTooltip from './HeatmapTooltip';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const getCellColor = (val) => {
  if (val === undefined || val === null || val === 'N/A' || val === 'N/L' || val === 'NL' || val === '') {
    return 'bg-[repeating-linear-gradient(135deg,#f9fafb,#f9fafb_5px,#f1f5f9_5px,#f1f5f9_8px)] text-gray-400 font-semibold italic border border-gray-200/50';
  }
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) {
    return 'bg-[repeating-linear-gradient(135deg,#f9fafb,#f9fafb_5px,#f1f5f9_5px,#f1f5f9_8px)] text-gray-400 font-semibold italic border border-gray-200/50';
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

// Compute monthly return from backend heatmap records or return N/A
function getFundMonthlyReturn(fund, month, heatmapLookup) {
  // Check launch date if available
  if (fund.launchDate) {
    const launch = new Date(fund.launchDate);
    const monthEnd = new Date(month.year, month.monthIndex + 1, 0, 23, 59, 59);
    if (launch > monthEnd) {
      return 'N/A';
    }
  }

  // Canonical lookup using scheme_plan or sif_code or fund identifier
  const record =
    (fund.scheme_plan && heatmapLookup[fund.scheme_plan]?.[month.year]) ||
    (fund.sif_code && heatmapLookup[fund.sif_code]?.[month.year]) ||
    (fund.id && heatmapLookup[fund.id]?.[month.year]) ||
    (fund.sebi_code && heatmapLookup[fund.sebi_code]?.[month.year]);

  if (!record) {
    return 'N/A';
  }

  const val = record[month.monthKey];
  if (val === null || val === undefined || val === '') {
    return 'N/A';
  }

  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) {
    return 'N/A';
  }

  return num;
}

export default function HeatmapTable({
  funds = [],
  heatmapRecords = [],
  timeFilter = '12M',
  activeSubCategoryLabel,
}) {
  const [tooltipData, setTooltipData] = useState(null);

  // Build lookup index: lookup[identifier][year] = record
  const heatmapLookup = useMemo(() => {
    const lookup = {};
    (heatmapRecords || []).forEach((r) => {
      if (r.scheme_plan) {
        if (!lookup[r.scheme_plan]) lookup[r.scheme_plan] = {};
        lookup[r.scheme_plan][r.year] = r;
      }
      if (r.sif_code) {
        if (!lookup[r.sif_code]) lookup[r.sif_code] = {};
        lookup[r.sif_code][r.year] = r;
      }
    });
    return lookup;
  }, [heatmapRecords]);

  // Determine chronological available months dynamically from actual data
  const displayMonths = useMemo(() => {
    let maxYear = 2026;
    let maxMonthIdx = 8; // Default to Sep (index 8)

    if (heatmapRecords && heatmapRecords.length > 0) {
      const years = [...new Set(heatmapRecords.map((r) => r.year))].sort((a, b) => b - a);
      let found = false;
      for (const y of years) {
        const yearRecords = heatmapRecords.filter((r) => r.year === y);
        for (let m = 11; m >= 0; m--) {
          const mKey = MONTH_KEYS[m];
          // Check if any scheme has actual data for this month
          const hasData = yearRecords.some(
            (r) => r[mKey] !== null && r[mKey] !== undefined && r[mKey] !== '' && Number(r[mKey]) !== 0
          );
          if (hasData) {
            maxYear = y;
            maxMonthIdx = m;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    // Build descending list of available months starting from (maxYear, maxMonthIdx)
    const allMonthsDesc = [];
    let curY = maxYear;
    let curM = maxMonthIdx;

    for (let i = 0; i < 24; i++) {
      const monthKey = MONTH_KEYS[curM];
      const label = `${MONTH_LABELS[curM]} '${String(curY).slice(2)}`;
      const date = `${curY}-${String(curM + 1).padStart(2, '0')}-01`;

      allMonthsDesc.push({
        key: `${monthKey}_${String(curY).slice(2)}`,
        monthKey,
        monthIndex: curM,
        year: curY,
        label,
        date,
      });

      curM -= 1;
      if (curM < 0) {
        curM = 11;
        curY -= 1;
      }
    }

    // Slice based on timeFilter (1M, 3M, 6M, 12M)
    if (timeFilter === '1M') {
      return allMonthsDesc.slice(0, 1);
    } else if (timeFilter === '3M') {
      return allMonthsDesc.slice(0, 3);
    } else if (timeFilter === '6M') {
      return allMonthsDesc.slice(0, 6);
    } else {
      // 12M default
      return allMonthsDesc.slice(0, 12);
    }
  }, [heatmapRecords, timeFilter]);

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

  return (
    <div className="flex-1 w-full bg-white relative">
      <div className="overflow-x-auto w-full no-scrollbar pb-4">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            {/* Category label indicator header */}
            {activeSubCategoryLabel && (
              <tr className="bg-[#f8faff] border-b border-[#e8edf7]">
                <th colSpan={displayMonths.length + 1} className="py-2.5 px-4 text-left">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    {activeSubCategoryLabel}
                  </span>
                </th>
              </tr>
            )}
            <tr className="border-b border-[#e8edf7]">
              <th className="sticky left-0 bg-white z-20 py-4 px-3 sm:px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px] sm:min-w-[220px] lg:min-w-[280px]">
                FUND
              </th>
              {displayMonths.map((m) => (
                <th
                  key={m.key}
                  className="py-4 px-2 text-center text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[75px] sm:min-w-[90px]"
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
                  const val = getFundMonthlyReturn(fund, m, heatmapLookup);
                  const isNA = val === 'N/A' || val == null;

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
                          <span className="text-gray-400 font-semibold italic text-[10px] sm:text-[11px]">N/A</span>
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

