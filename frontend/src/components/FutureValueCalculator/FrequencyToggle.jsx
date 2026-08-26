import React from 'react';

export default function FrequencyToggle({ frequency, setFrequency, convertInvestment }) {
  const handleToggle = (mode) => {
    if (mode === frequency) return;
    setFrequency(mode);
    convertInvestment(mode);
  };

  return (
    <div className="flex bg-[#f7f9fc] p-1.5 rounded-full border border-[#e8edf7] w-full max-w-xs mx-auto mb-8 relative">
      <div 
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out border border-[#e8edf7] ${
          frequency === 'monthly' ? 'left-1.5' : 'left-[calc(50%+4px)]'
        }`}
      />
      <button
        onClick={() => handleToggle('monthly')}
        className={`flex-1 py-2.5 text-sm font-bold text-center z-10 transition-colors rounded-full ${
          frequency === 'monthly' ? 'text-[#032e92]' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => handleToggle('annual')}
        className={`flex-1 py-2.5 text-sm font-bold text-center z-10 transition-colors rounded-full ${
          frequency === 'annual' ? 'text-[#032e92]' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Annual
      </button>
    </div>
  );
}
