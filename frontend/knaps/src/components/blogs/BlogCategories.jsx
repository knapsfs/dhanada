import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  "All",
  "Investment",
  "Mutual Funds",
  "Insurance",
  "Retirement",
  "Tax Planning",
  "Financial Planning"
];

export default function BlogCategories() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <section className="bg-white border-b border-gray-100 py-6 sticky top-[80px] z-40 shadow-sm shadow-blue-900/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-4 pb-2 md:pb-0 items-center justify-start md:justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`relative px-5 py-2.5 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === category 
                  ? 'text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#032e92]'
              }`}
            >
              {activeTab === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#032e92] rounded-full shadow-md shadow-blue-900/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* CSS to hide scrollbar but keep functionality */}
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
