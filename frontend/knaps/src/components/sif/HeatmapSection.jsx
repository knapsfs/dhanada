import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeatmapHeader from './HeatmapHeader';
import HeatmapTable from './HeatmapTable';
import { fetchHeatmapFilters, fetchHeatmapData } from '../../api/funds';

export default function HeatmapSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [timeFilter, setTimeFilter] = useState('12M'); 
  const [filtersList, setFiltersList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Open Ended');
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const [categoryFunds, setCategoryFunds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Viewport intersection observer to lazy load only when scrolled into view
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 1. Fetch distinct heatmap filters ONLY when visible in viewport
  useEffect(() => {
    if (!isVisible) return;

    let isMounted = true;
    async function loadFilters() {
      try {
        const rows = await fetchHeatmapFilters();
        if (isMounted && Array.isArray(rows) && rows.length > 0) {
          setFiltersList(rows);
        }
      } catch (err) {
        console.error('Failed to load heatmap filters:', err);
      }
    }
    loadFilters();
    return () => { isMounted = false; };
  }, [isVisible]);

  // Process filters into hierarchical structure (schemeType -> subCategories)
  const groupedData = useMemo(() => {
    const dataMap = {};
    const sourceRows = filtersList.length > 0 ? filtersList : [
      { schemeType: 'Open Ended', category: 'Equity Long-Short Fund' },
      { schemeType: 'Interval', category: 'Hybrid Long-Short Fund' }
    ];

    sourceRows.forEach(item => {
      const st = item.schemeType || "Open Ended";
      const cat = item.category;
      if (!cat) return;

      if (!dataMap[st]) {
        dataMap[st] = { id: st, label: st, subCategories: {} };
      }
      if (!dataMap[st].subCategories[cat]) {
        dataMap[st].subCategories[cat] = { id: cat, name: cat };
      }
    });

    const finalData = Object.values(dataMap).sort((a, b) => a.label.localeCompare(b.label));
    finalData.forEach(ac => {
      ac.subCategories = Object.values(ac.subCategories).sort((a, b) => a.name.localeCompare(b.name));
    });

    return finalData;
  }, [filtersList]);

  // Set default active categories when filters load
  useEffect(() => {
    if (!isVisible) return;

    if (groupedData.length > 0) {
      if (!activeCategory || !groupedData.find(g => g.id === activeCategory)) {
        const defaultCat = groupedData[0];
        setActiveCategory(defaultCat.id);
        if (defaultCat.subCategories.length > 0) {
          setActiveSubCategory(defaultCat.subCategories[0].id);
        }
      } else if (!activeSubCategory) {
        const cat = groupedData.find(g => g.id === activeCategory);
        if (cat && cat.subCategories.length > 0) {
          setActiveSubCategory(cat.subCategories[0].id);
        }
      }
    }
  }, [isVisible, groupedData, activeCategory, activeSubCategory]);

  // 2. Fetch targeted heatmap data when visible and active category, subcategory, or timeFilter changes
  useEffect(() => {
    if (!isVisible) return;
    if (!activeCategory && !activeSubCategory) return;

    let isMounted = true;
    async function loadActiveHeatmap() {
      try {
        setLoading(true);
        const data = await fetchHeatmapData({
          time_filter: timeFilter,
          scheme_type: activeCategory,
          category: activeSubCategory,
        });
        if (isMounted && Array.isArray(data)) {
          setCategoryFunds(data);
        }
      } catch (err) {
        console.error('Failed to load active heatmap data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadActiveHeatmap();
    return () => { isMounted = false; };
  }, [isVisible, activeCategory, activeSubCategory, timeFilter]);

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
  const activeFunds = categoryFunds;

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
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
              {/* 1. SCHEME TYPE */}
              <div className="flex flex-col gap-2.5 flex-shrink-0">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Scheme Type
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
