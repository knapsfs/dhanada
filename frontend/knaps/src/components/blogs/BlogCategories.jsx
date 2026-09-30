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
    <section className="bg-white border-b border-gray-100 py-5 sticky top-[72px] sm:top-[80px] z-40 shadow-sm shadow-blue-900/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-3 pb-1 md:pb-0 items-center justify-start md:justify-center">
          {categories.map((category) => {
            const isSelected =
              activeCategory === category.name ||
              activeCategory === category.title ||
              (activeCategory === 'All' && category.name === 'All');

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => handleSelect(category)}
                className={`relative px-5 py-2.5 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#032e92]'
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

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
