import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowsRotate,
  faFileCircleCheck,
  faGlobe,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';

const SmallSavingsImportantConsiderations = () => {
  const considerations = [
    {
      icon: faArrowsRotate,
      title: "Rate Locking on Deposit Date",
      badge: "Guaranteed Yield",
      color: "blue",
      description: "Interest rates are notified quarterly by the Ministry of Finance.",
      details: [
        "In POTD, KVP, and NSC, the notified interest rate prevailing on your date of deposit is locked in for the entire tenure.",
        "Your returns remain fully insulated from any subsequent quarterly rate reductions announced by the government."
      ]
    },
    {
      icon: faFileCircleCheck,
      title: "Mandatory PAN & Aadhaar KYC",
      badge: "Regulatory Compliance",
      color: "emerald",
      description: "Department of Posts mandates full KYC verification for all depositors.",
      details: [
        "Aadhaar and PAN are required at the time of opening accounts or purchasing certificates.",
        "Ensures seamless linking to bank accounts, automated maturity credits, and verification against government databases."
      ]
    },
    {
      icon: faBuildingColumns,
      title: "Nationwide Postal Transferability",
      badge: "Portability",
      color: "indigo",
      description: "Complete convenience when relocating across cities or states.",
      details: [
        "Post office accounts and certificates can be transferred seamlessly from one post office to any other post office across India.",
        "Passbooks and certificates provide tangible, tamper-proof proof of sovereign ownership."
      ]
    },
    {
      icon: faGlobe,
      title: "NRI Eligibility Restrictions",
      badge: "Residency Rules",
      color: "amber",
      description: "Post office small savings schemes are reserved exclusively for Indian residents.",
      details: [
        "Non-Resident Indians (NRIs) are not eligible to open new POTD, KVP, NSC, or PORD accounts.",
        "If a resident becomes an NRI after opening an account, the deposit can continue until maturity on a non-repatriable basis without renewal."
      ]
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faBuildingColumns} />
            <span>Important Operational Rules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Key Considerations for Post Office Savers
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Essential operational guidelines, rate lock-in mechanisms, and compliance norms before depositing in Post Office schemes.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {considerations.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-lg shadow-xs">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                {item.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="text-[#032e92] font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmallSavingsImportantConsiderations;
