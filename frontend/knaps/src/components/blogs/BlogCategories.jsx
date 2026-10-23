import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBlogCategories } from '../../services/blogService';

export default function BlogCategories({ activeCategory = 'All', onSelectCategory }) {
  const [categories, setCategories] = useState([{ name: 'All', title: 'All' }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const cats = await getBlogCategories();
        if (isMounted && cats && cats.length > 0) {
          setCategories([{ name: 'All', title: 'All' }, ...cats]);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat.name === 'All' ? 'All' : cat.name);
    }
  };

  return (
    <section className="bg-white border-b border-gray-100 py-3 sm:py-4 top-[72px] sm:top-[80px] z-40 shadow-sm shadow-blue-900/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Mobile: card container without horizontal scroll; Desktop: clean row aligned to start */}
        <div className="bg-slate-50/80 md:bg-transparent border border-slate-200/80 md:border-0 rounded-2xl p-3.5 sm:p-4 md:p-0 shadow-sm md:shadow-none">
          <div className="flex flex-wrap items-center justify-start gap-2 md:gap-3">
            {/* Category Name Label */}
            <span className="text-[13px] sm:text-[14px] font-bold text-gray-800 tracking-tight whitespace-nowrap flex items-center gap-1.5 mr-1 sm:mr-2">
              Category :
            </span>

            {/* Category Buttons */}
            {categories.map((category) => {
              const isSelected =
                activeCategory === category.name ||
                activeCategory === category.title ||
                activeCategory?.toLowerCase() === category.name?.toLowerCase() ||
                activeCategory?.toLowerCase() === category.title?.toLowerCase() ||
                activeCategory?.toLowerCase().replace(/-/g, ' ') === category.title?.toLowerCase() ||
                activeCategory?.toLowerCase() === category.title?.toLowerCase().replace(/\s+/g, '-') ||
                (activeCategory === 'All' && category.name === 'All');

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => handleSelect(category)}
                  className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${isSelected
                      ? 'text-white'
                      : 'text-gray-600 bg-white md:bg-transparent border border-gray-200/70 md:border-transparent hover:bg-gray-100 hover:text-[#032e92]'
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeBlogCategory"
                      className="absolute inset-0 bg-[#032e92] rounded-full shadow-md shadow-blue-900/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category.title || category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
