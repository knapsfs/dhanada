import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeatmapHeader from './HeatmapHeader';
import HeatmapTable from './HeatmapTable';

export default function HeatmapSection({ fundsData = [] }) {
  const [timeFilter, setTimeFilter] = useState('12M'); 
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState('');

  // Process live fundsData into a hierarchical structure
  const groupedData = useMemo(() => {
    const dataMap = {};
    fundsData.forEach(fund => {
      // Use assetClass as parent, category as sub-category
      // Skip funds without proper taxonomy
      if (!fund.assetClass || !fund.category) return;
      
      const ac = fund.assetClass;
      const cat = fund.category;

      if (!dataMap[ac]) {
        dataMap[ac] = { id: ac, label: ac, subCategories: {} };
      }
      if (!dataMap[ac].subCategories[cat]) {
        dataMap[ac].subCategories[cat] = { id: cat, name: cat, funds: [] };
      }
      dataMap[ac].subCategories[cat].funds.push(fund);
    });

    // Convert to sorted arrays
    const finalData = Object.values(dataMap).sort((a, b) => a.label.localeCompare(b.label));
    finalData.forEach(ac => {
      ac.subCategories = Object.values(ac.subCategories).sort((a, b) => a.name.localeCompare(b.name));
    });

    return finalData;
  }, [fundsData]);

  // Set default active tabs when data loads
  useEffect(() => {
    if (groupedData.length > 0) {
      if (!activeCategory || !groupedData.find(g => g.id === activeCategory)) {
        const defaultCat = groupedData[0];
        setActiveCategory(defaultCat.id);
        if (defaultCat.subCategories.length > 0) {
          setActiveSubCategory(defaultCat.subCategories[0].id);
        }
      }
    }
  }, [groupedData, activeCategory]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const catData = groupedData.find(g => g.id === catId);
    if (catData && catData.subCategories.length > 0) {
      setActiveSubCategory(catData.subCategories[0].id);
    } else {
      setActiveSubCategory('');
    }
  };

  const currentCategoryData = groupedData.find(g => g.id === activeCategory);
  const activeSubCatData = currentCategoryData?.subCategories.find(s => s.id === activeSubCategory);
  const activeFunds = activeSubCatData ? activeSubCatData.funds : [];

  if (groupedData.length === 0) return null; // Don't render if no data

  return (
    <section className="py-16 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-[#e8edf7] overflow-hidden flex flex-col"
        >
          <HeatmapHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

          <div className="flex flex-col p-4 sm:p-6 lg:p-8 gap-6 bg-white w-full">
            {/* Top Filter Bar with 2 sections: Asset Class and Category */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 pb-2 w-full">
              {/* 1. ASSET CLASS */}
              <div className="flex flex-col gap-2.5 flex-shrink-0">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Asset Class
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {groupedData.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                        activeCategory === cat.id
                          ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                          : 'text-gray-500 hover:text-[#032e92] font-semibold'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CATEGORY (Sub-Categories) */}
              {currentCategoryData && currentCategoryData.subCategories.length > 0 && (
                <div className="flex flex-col gap-2.5 lg:border-l lg:border-gray-100 lg:pl-10 flex-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Category
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {currentCategoryData.subCategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubCategory(sub.id)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                          activeSubCategory === sub.id
                            ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Center Content - Table */}
            <div className="w-full overflow-hidden bg-white pt-2 border-t border-[#e8edf7]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${activeSubCategory}-${timeFilter}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <HeatmapTable 
                    funds={activeFunds} 
                    timeFilter={timeFilter} 
                    activeSubCategoryLabel={activeSubCatData?.name} 
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
