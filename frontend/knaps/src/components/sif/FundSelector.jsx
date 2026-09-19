import { useMemo } from 'react';
import Select from 'react-select';
import { getRiskLevelConfig } from '../../utils/risk';



const getRiskDisplay = (fund) => {
  if (!fund) return null;
  const rawRisk = fund.risk != null ? fund.risk : fund.riskLevel;
  const config = getRiskLevelConfig(rawRisk);
  if (config && config.level !== 'N/A') {
    return {
      label: `Risk Band: ${config.level}`,
      classes: `${config.bg} ${config.text} ${config.border}`
    };
  }
  const strRisk = String(rawRisk || '5');
  const match = strRisk.match(/\d+/);
  const level = match ? parseInt(match[0], 10) : 5;
  const fallbackConfig = getRiskLevelConfig(level);
  return {
    label: `Risk Band: ${fallbackConfig.level !== 'N/A' ? fallbackConfig.level : 5}`,
    classes: `${fallbackConfig.bg} ${fallbackConfig.text} ${fallbackConfig.border}`
  };
};

export default function FundSelector({ selectedFunds = [null, null, null], onFundSelect, onReset, onCompare, availableFunds = [] }) {
  const activeCount = selectedFunds.filter(f => f !== null).length;
  const canCompare = activeCount >= 2;

  // Create options for react-select
  const options = useMemo(() => {
    return availableFunds.map(fund => {
      const riskInfo = getRiskDisplay(fund);
      return {
        value: fund.id,
        label: fund.name,
        category: fund.category || fund.subCategory || fund.strategy || 'Equity Long-Short',
        risk: riskInfo.label,
        fund: fund
      };
    });
  }, [availableFunds]);

  const handleSelect = (index, selectedOption) => {
    if (onFundSelect) {
      onFundSelect(index, selectedOption ? selectedOption.value : null);
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  // Custom styles for react-select to match the premium theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: '4px',
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#032e92' : '#e8edf7',
      backgroundColor: '#f7f9fc',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(3, 46, 146, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#032e92'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#032e92' : state.isFocused ? '#eef4ff' : 'white',
      color: state.isSelected ? '#ffffff' : state.isFocused ? '#032e92' : '#1e293b',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      ':active': {
        backgroundColor: state.isSelected ? '#032e92' : '#dbeafe'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 12px 30px -4px rgba(3, 46, 146, 0.15)',
      border: '1px solid #e8edf7',
      zIndex: 30
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '6px'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94a3b8',
      fontSize: '14px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1e293b',
      fontSize: '14px',
      fontWeight: '600'
    })
  };

  // Helper to get filtered options for a specific slot (excludes already selected funds)
  const getOptionsForSlot = (index) => {
    const selectedIds = selectedFunds
      .filter((fund, i) => i !== index && fund !== null)
      .map(fund => fund.id);

    return options.filter(opt => !selectedIds.includes(opt.value));
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-blue-900/10 border border-[#e8edf7] mb-12 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] font-serif mb-1">Select Funds</h2>
          <p className="text-[#64748b] text-sm font-medium">Choose up to 3 funds across any category to compare them side-by-side.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[0, 1, 2].map(index => {
          const currentFund = selectedFunds[index];
          const riskDisplay = currentFund ? getRiskDisplay(currentFund) : null;
          const value = currentFund ? {
            value: currentFund.id,
            label: currentFund.name,
            category: currentFund.category || currentFund.subCategory || currentFund.strategy,
            risk: riskDisplay ? riskDisplay.label : ''
          } : null;

          const fundCategory = currentFund ? (currentFund.category || currentFund.subCategory || currentFund.strategy || 'Equity Long-Short') : '';

          return (
            <div key={index} className="flex flex-col justify-start">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-1">
                Fund {index + 1}
              </label>

              <Select
                value={value}
                onChange={(option) => handleSelect(index, option)}
                options={getOptionsForSlot(index)}
                styles={customStyles}
                placeholder="Search fund..."
                isClearable
                isSearchable
                formatOptionLabel={(option, { context, selectValue }) => {
                  const isSelectedInMenu = context === 'menu' && selectValue?.some(s => s.value === option.value);
                  return (
                    <div className="flex flex-col py-0.5">
                      <span className={`font-semibold text-sm ${isSelectedInMenu ? 'text-white' : 'text-gray-900'}`}>
                        {option.label}
                      </span>
                    </div>
                  );
                }}
                noOptionsMessage={() => "No funds found"}
              />

              {/* Fund Category and Risk Band Display directly below the Select field */}
              {currentFund && riskDisplay && (
                <div className="flex flex-wrap items-center gap-2 mt-3 animate-in fade-in duration-300">
                  {/* Fund Category Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#eef4ff] text-[#032e92] border border-blue-100/80 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#032e92]"></span>
                    {fundCategory}
                  </span>

                  {/* Risk Band Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-sm ${riskDisplay.classes}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {riskDisplay.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleReset}
          className="bg-[#f7f9fc] text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-[#e8edf7] px-8 py-3 rounded-xl font-bold shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
        >
          Reset
        </button>
        <button
          onClick={onCompare}
          disabled={!canCompare}
          className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 ${
            canCompare
              ? 'bg-gradient-to-r from-[#032e92] to-[#0a4fd4] text-white shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
              : 'bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
          }`}
        >
          Compare
        </button>
      </div>
    </div>
  );
}