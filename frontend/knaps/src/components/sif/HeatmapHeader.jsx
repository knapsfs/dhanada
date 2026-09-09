import { motion } from 'framer-motion';

export default function HeatmapHeader({ timeFilter, setTimeFilter }) {
  const tabs = [
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '12M', value: '12M' },
    { label: 'All', value: 'All' },
  ];

  const getSubTitle = () => {
    switch (timeFilter) {
      case '3M':
        return 'Compare the performance of SIF schemes in terms of absolute returns over the last 3 months.';
      case '6M':
        return 'Compare the performance of SIF schemes in terms of absolute returns over the last 6 months.';
      case '12M':
        return 'Compare the performance of SIF schemes in terms of absolute returns over the last 12 months.';
      case 'All':
      default:
        return 'Compare the performance of SIF schemes in terms of absolute returns across all available months.';
    }
  };

  return (
    <div className="bg-[#032e92] text-white rounded-t-3xl p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl lg:text-3xl font-bold mb-2 font-serif">
          SIF Performance Heatmap
        </motion.h2>
        <motion.p
          key={timeFilter}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-blue-100 text-sm max-w-2xl">
          {getSubTitle()}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-wrap sm:flex-nowrap p-1 bg-white/10 rounded-xl border border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTimeFilter(tab.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              timeFilter === tab.value
                ? 'bg-white text-[#032e92] shadow-md'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}>
            {tab.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
