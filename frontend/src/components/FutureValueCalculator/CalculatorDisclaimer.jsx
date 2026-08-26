import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { formatIndianCurrency } from './calculatorUtils';

export default function CalculatorDisclaimer({ initialInvestment, recurringInvestment, annualReturn, years, frequency }) {
  const recurringText = frequency === 'monthly' ? 'month' : 'year';
  
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
        <h4 className="font-bold text-[#032e92] mb-2">How it works</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {initialInvestment > 0 && `You start with an initial investment of ${formatIndianCurrency(initialInvestment)} and `}
          {initialInvestment === 0 && `You `}
          invest <strong>{formatIndianCurrency(recurringInvestment)}</strong> each {recurringText} for <strong>{years} years</strong>, 
          with an illustrative annual return assumption of <strong>{annualReturn}%</strong>. 
          The calculator applies {frequency} compounding to estimate a potential future value.
        </p>
      </div>

      <div className="border-t border-[#e8edf7] pt-6">
        <p className="text-xs text-gray-500 leading-relaxed text-justify">
          <strong>Disclaimer:</strong> This calculator is for illustrative and educational purposes only. 
          It does not constitute investment, financial, or tax advice. The assumed rate of return is hypothetical 
          and is not guaranteed. Actual investment returns may be higher or lower and can vary over time.
        </p>
      </div>

      <div className="pt-4">
        <h4 className="text-sm font-bold text-gray-800 mb-4">Explore Investment Planning</h4>
        <div className="flex flex-wrap gap-3">
          {['Mutual Funds', 'SIF', 'AIF', 'NPS'].map(type => (
            <a 
              key={type}
              href={`#${type.toLowerCase().replace(' ', '-')}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e8edf7] text-xs font-bold text-gray-600 hover:text-[#032e92] hover:border-[#032e92]/30 transition-all shadow-sm hover:shadow-md"
            >
              {type}
              <FontAwesomeIcon icon={faArrowRight} className="text-[#032e92]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
