import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeatmapHeader from "./HeatmapHeader";
import HeatmapTable from "./HeatmapTable";
import { fetchHeatmapFilters, fetchHeatmapData, fetchFundsSelectorList } from "../../api/funds";

export default function HeatmapSection() {
  const [timeFilter, setTimeFilter] = useState("12M");
  const [activeStrategy, setActiveStrategy] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [filtersList, setFiltersList] = useState([]);
  const [selectorFunds, setSelectorFunds] = useState([]);
  const [categoryFunds, setCategoryFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Lazy loading observer: Only activate when section is near viewport
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
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
      { rootMargin: "100px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 1. Fetch heatmap filters AND selector list when visible
  useEffect(() => {
    if (!isVisible) return;

    let isMounted = true;
    async function loadFilters() {
      try {
        const [filtersRes, selectorRes] = await Promise.allSettled([
          fetchHeatmapFilters(),
          fetchFundsSelectorList(),
        ]);

        if (isMounted) {
          if (filtersRes.status === "fulfilled" && Array.isArray(filtersRes.value)) {
            setFiltersList(filtersRes.value);
          }
          if (selectorRes.status === "fulfilled" && Array.isArray(selectorRes.value)) {
            setSelectorFunds(selectorRes.value);
          }
        }
      } catch (err) {
        console.error("Failed to load heatmap filters:", err);
      }
    }
    loadFilters();
    return () => {
      isMounted = false;
    };
  }, [isVisible]);

  // Process filters into hierarchical structure:
  // - "All" contains ALL distinct subcategories
  // - "Equity" contains only Equity subcategories
  // - "Hybrid" contains only Hybrid subcategories
  const groupedData = useMemo(() => {
    const strategySubcatsMap = {
      Equity: new Set(),
      Hybrid: new Set(),
    };
    const allSubcatsSet = new Set();

    // 1. Ingest from selectorFunds (comprehensive list of all active funds)
    selectorFunds.forEach((f) => {
      const strat = f.strategy || f.investmentStrategy || (f.category?.toLowerCase().includes("hybrid") ? "Hybrid" : "Equity");
      const cat = f.category || f.schemeSubcategory;
      if (cat) {
        allSubcatsSet.add(cat);
        if (!strategySubcatsMap[strat]) {
          strategySubcatsMap[strat] = new Set();
        }
        strategySubcatsMap[strat].add(cat);
      }
    });

    // 2. Ingest from filtersList (from SIF Scheme query)
    filtersList.forEach((item) => {
      const strat = item.investmentStrategy || item.strategy || (item.category?.toLowerCase().includes("hybrid") ? "Hybrid" : "Equity");
      const cat = item.category;
      if (cat) {
        allSubcatsSet.add(cat);
        if (!strategySubcatsMap[strat]) {
          strategySubcatsMap[strat] = new Set();
        }
        strategySubcatsMap[strat].add(cat);
      }
    });

    // 3. Fallback defaults if API lists are not yet populated
    if (allSubcatsSet.size === 0) {
      allSubcatsSet.add("Active Asset Allocator Long-Short Fund");
      allSubcatsSet.add("Equity Ex-Top 100 Long-Short Fund");
      allSubcatsSet.add("Equity Long-Short Fund");
      allSubcatsSet.add("Hybrid Long-Short Fund");
      allSubcatsSet.add("Sector Rotation Long-Short Fund");
    }

    if (!strategySubcatsMap.Equity.size) {
      strategySubcatsMap.Equity = new Set([
        "Active Asset Allocator Long-Short Fund",
        "Equity Ex-Top 100 Long-Short Fund",
        "Equity Long-Short Fund",
        "Sector Rotation Long-Short Fund",
      ]);
    }

    if (!strategySubcatsMap.Hybrid.size) {
      strategySubcatsMap.Hybrid = new Set([
        "Active Asset Allocator Long-Short Fund",
        "Hybrid Long-Short Fund",
      ]);
    }

    // Build Strategy Items
    const allStrategyGroup = {
      id: "All",
      label: "All",
      subCategories: [
        { id: "All", name: "All Categories" },
        ...Array.from(allSubcatsSet)
          .sort()
          .map((c) => ({ id: c, name: c })),
      ],
    };

    // Sort strategy keys (Equity, Hybrid, ...)
    const strategyKeys = Object.keys(strategySubcatsMap).sort();
    const strategyGroups = strategyKeys.map((strat) => {
      const subcats = Array.from(strategySubcatsMap[strat]).sort();
      return {
        id: strat,
        label: strat,
        subCategories: [
          { id: "All", name: `All ${strat} Categories` },
          ...subcats.map((c) => ({ id: c, name: c })),
        ],
      };
    });

    return [allStrategyGroup, ...strategyGroups];
  }, [filtersList, selectorFunds]);

  // Ensure active strategy & subcategory validity
  useEffect(() => {
    if (!isVisible) return;

    if (groupedData.length > 0) {
      if (!activeStrategy || !groupedData.find((g) => g.id === activeStrategy)) {
        setActiveStrategy("All");
        setActiveSubCategory("All");
      }
    }
  }, [isVisible, groupedData, activeStrategy]);

  // 2. Fetch targeted heatmap data when visible and active strategy, subcategory, or timeFilter changes
  useEffect(() => {
    if (!isVisible) return;

    let isMounted = true;
    async function loadActiveHeatmap() {
      try {
        setLoading(true);
        const data = await fetchHeatmapData({
          time_filter: timeFilter,
          strategy: activeStrategy === "All" ? undefined : activeStrategy,
          investment_strategy: activeStrategy === "All" ? undefined : activeStrategy,
          category: activeSubCategory === "All" ? undefined : activeSubCategory,
        });
        if (isMounted && Array.isArray(data)) {
          setCategoryFunds(data);
        }
      } catch (err) {
        console.error("Failed to load active heatmap data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadActiveHeatmap();
    return () => {
      isMounted = false;
    };
  }, [isVisible, activeStrategy, activeSubCategory, timeFilter]);

  const handleStrategyChange = (stratId) => {
    setActiveStrategy(stratId);
    setActiveSubCategory("All");
  };

  const currentStrategyData = groupedData.find((g) => g.id === activeStrategy) || groupedData[0];
  const activeSubCatData = currentStrategyData?.subCategories.find((s) => s.id === activeSubCategory);
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
            {/* Top Filter Bar with 2 sections: Investment Strategy and Category */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 pb-2 w-full">
              {/* 1. INVESTMENT STRATEGY */}
              <div className="flex flex-col gap-2.5 flex-shrink-0">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Investment Strategy
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {groupedData.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleStrategyChange(cat.id)}
                      className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                        activeStrategy === cat.id
                          ? "bg-[#032e92] text-white shadow-md shadow-blue-900/20"
                          : "text-gray-500 hover:text-[#032e92] font-semibold"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CATEGORY (Sub-Categories) */}
              {currentStrategyData && currentStrategyData.subCategories.length > 0 && (
                <div className="flex flex-col gap-2.5 lg:border-l lg:border-gray-100 lg:pl-10 flex-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Category
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {currentStrategyData.subCategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubCategory(sub.id)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          activeSubCategory === sub.id
                            ? "bg-[#032e92] text-white shadow-md shadow-blue-900/20"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
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
                  key={`${activeStrategy}-${activeSubCategory}-${timeFilter}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <HeatmapTable
                    funds={activeFunds}
                    timeFilter={timeFilter}
                    activeSubCategoryLabel={activeSubCategory !== "All" ? activeSubCatData?.name : undefined}
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
