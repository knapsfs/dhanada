import { useState, useMemo } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo, faXmark, faPlus, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

const getRiskBadgeClasses = (risk) => {
  const r = String(risk || '').toLowerCase();
  if (r.includes('very high') || r === '5') return 'bg-red-50 text-red-700 border-red-200';
  if (r.includes('high') || r === '4') return 'bg-orange-50 text-orange-700 border-orange-200';
  if (r.includes('moderate') || r === '3') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (r.includes('low to moderate') || r === '2') return 'bg-lime-50 text-lime-700 border-lime-200';
  if (r.includes('low') || r === '1') return 'bg-green-50 text-green-700 border-green-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

export default function FundSelector({ selectedFunds, onFundSelect, onReset, availableFunds = [] }) {

  // Create options for react-select
  const options = useMemo(() => {
    return availableFunds.map(fund => ({
      value: fund.id,
      label: fund.name,
      category: fund.category || fund.subCategory || fund.strategy || 'Equity Long-Short',
      risk: fund.risk || fund.riskLevel || 'Very High',
      fund: fund
    }));
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
      zIndex: 9999
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
    <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-blue-900/10 border border-[#e8edf7] mb-12 relative z-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1e293b] font-serif mb-1">Select Funds</h2>
          <p className="text-[#64748b] text-sm font-medium">Choose up to 3 funds across any category to compare them side-by-side.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[0, 1, 2].map(index => {
          const currentFund = selectedFunds[index];
          const value = currentFund ? {
            value: currentFund.id,
            label: currentFund.name,
            category: currentFund.category || currentFund.subCategory || currentFund.strategy,
            risk: currentFund.risk || currentFund.riskLevel
          } : null;

          const fundCategory = currentFund ? (currentFund.category || currentFund.subCategory || currentFund.strategy || 'Equity Long-Short') : '';
          const fundRisk = currentFund ? (currentFund.risk || 'Very High') : '';

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
                      {/* {option.category && (
                        <span className={`text-[11px] font-medium mt-0.5 ${isSelectedInMenu ? 'text-blue-100 opacity-90' : 'text-gray-400'}`}>
                          {option.category}
                        </span>
                      )} */}
                    </div>
                  );
                }}
                noOptionsMessage={() => "No funds found"}
              />

              {/* Fund Category and Risk Band Display directly below the Select field */}
              {currentFund && (
                <div className="flex flex-wrap items-center gap-2 mt-3 animate-in fade-in duration-300">
                  {/* Fund Category Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#eef4ff] text-[#032e92] border border-blue-100/80 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#032e92]"></span>
                    {fundCategory}
                  </span>

                  {/* Risk Band Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-sm ${getRiskBadgeClasses(fundRisk)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {fundRisk.toLowerCase().includes('risk') ? fundRisk : `${fundRisk} Risk`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleReset} className="bg-gradient-to-r from-[#032e92] to-[#0a4fd4] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
          Reset
        </button>
      </div>
    </div>
  );
}