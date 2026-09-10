import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { formatIndianCurrency } from './calculatorUtils';

export default function CalculatorDisclaimer({ initialInvestment, recurringInvestment, annualReturn, years, frequency }) {
  const exploreLinks = [
    { label: 'Mutual Funds', href: '#' },
    { label: 'SIF', href: '#' },
    { label: 'AIF', href: '#' },
    { label: 'NPS', href: '#' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-[#f7f9fc] p-6 rounded-2xl border border-[#e8edf7]">
        <h4 className="text-[#032e92] font-bold text-sm mb-2">How it works</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {initialInvestment > 0 && `You start with an initial investment of `}
          {initialInvestment > 0 && <strong className="text-gray-800">{formatIndianCurrency(initialInvestment)}</strong>}
          {initialInvestment > 0 && ` and invest `}
          {!initialInvestment && `You invest `}
          <strong className="text-gray-800">{formatIndianCurrency(recurringInvestment)}</strong> each month for <strong className="text-gray-800">{years} years</strong>, with an illustrative annual return assumption of <strong className="text-gray-800">{annualReturn}%</strong>. The calculator applies {frequency} compounding to estimate a potential future value.
        </p>
      </div>

      <div className="flex flex-col">
        <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">
          <strong className="text-gray-700">Disclaimer:</strong> This calculator is for illustrative and educational purposes only. It does not constitute investment, financial, or tax advice. The assumed rate of return is hypothetical and is not guaranteed. Actual investment returns may be higher or lower and can vary over time.
        </p>
        
        <div>
          <h4 className="font-bold text-gray-800 text-sm mb-3">Explore Investment Planning</h4>
          <div className="flex flex-wrap gap-3">
            {exploreLinks.map(link => (
              <a 
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8edf7] text-xs font-bold text-gray-700 hover:border-[#032e92] hover:text-[#032e92] transition-colors"
              >
                {link.label}
                <FontAwesomeIcon icon={faArrowRight} className="text-[#032e92]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
