import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTriangleExclamation,
  faArrowsRotate,
  faUsers,
  faFileCircleCheck,
  faGlobe,
  faBuildingColumns,
  faUserCheck,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const SmallSavingsImportantConsiderations = () => {
  const considerations = [
    {
      icon: faArrowsRotate,
      title: "Quarterly Rate Revisions & Rate Locking",
      badge: "Interest Structure",
      color: "blue",
      description: "Interest rates are notified by the Ministry of Finance every quarter based on G-sec benchmarks.",
      details: [
        "Floating Rate Schemes: PPF and SSY interest rates adjust each quarter across the entire tenure for all active accounts.",
        "Fixed-at-Deposit Schemes: NSC, KVP, POTD, MSSC, and SCSS lock in the prevailing interest rate on the date of deposit for the entire duration."
      ]
    },
    {
      icon: faUsers,
      title: "Strict Statutory Deposit Ceilings",
      badge: "Compliance",
      color: "emerald",
      description: "Statutory investment caps apply on an aggregate PAN basis across all banks and post offices nationwide.",
      details: [
        "PPF: Strictly capped at ₹1.5 Lakh per financial year (including accounts opened as guardian for minors). Excess deposits earn 0% interest.",
        "POMIS: ₹9 Lakh for single accounts; ₹15 Lakh for joint accounts. Holding above this cap attracts penalty or refund.",
        "SCSS: Maximum ₹30 Lakh aggregate limit across all accounts opened by an eligible retiree."
      ]
    },
    {
      icon: faFileCircleCheck,
      title: "Mandatory PAN & Aadhaar KYC",
      badge: "Regulatory Mandate",
      color: "indigo",
      description: "Department of Posts and RBI regulations mandate strict verification for all small savings investments.",
      details: [
        "Aadhaar & PAN are mandatory at the time of account opening.",
        "Existing accounts without PAN/Aadhaar submitted face suspension of credit interest and restriction on withdrawals until verified.",
        "Ensure full match between bank/postal records and government databases to prevent operational freezes."
      ]
    },
    {
      icon: faGlobe,
      title: "NRI Eligibility Restrictions",
      badge: "Residency Rules",
      color: "amber",
      description: "Non-Resident Indians (NRIs) are generally ineligible to open new Small Savings Scheme accounts.",
      details: [
        "No New Accounts: NRIs cannot subscribe to PPF, NSC, KVP, POMIS, or SCSS post gaining non-resident status.",
        "Status Change During Tenure: If a resident opens a PPF and subsequently becomes an NRI, the account can run until its initial 15-year maturity on a non-repatriable basis without extension option."
      ]
    },
    {
      icon: faBuildingColumns,
      title: "Post Office vs Commercial Banks",
      badge: "Operational Channels",
      color: "sky",
      description: "Schemes can be held either through India Post or authorized public and private sector commercial banks.",
      details: [
        "India Post offers all 9 small savings schemes across 1.5+ lakh branches.",
        "Commercial banks (SBI, PNB, HDFC, ICICI, etc.) are authorized to offer select schemes like PPF, SSY, and SCSS.",
        "Inter-institutional portability: You can transfer your PPF or SSY account seamlessly between Post Offices and banks with original continuity preserved."
      ]
    },
    {
      icon: faUserCheck,
      title: "Compulsory Nomination & Joint Holding",
      badge: "Estate & Succession",
      color: "purple",
      description: "Safeguarding your beneficiaries requires accurate nomination declarations and joint account definitions.",
      details: [
        "Nomination is compulsory for all accounts at inception, allowing up to 4 nominees with designated percentage shares.",
        "Joint accounts are permitted under Joint 'A' (payable to both survivors jointly) or Joint 'B' (payable to either survivor).",
        "SCSS allows joint holding only with the lawful spouse, ensuring clear spousal security."
      ]
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden border-b border-slate-100" id="important-considerations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold mb-4">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-xs" />
            <span>Operational & Regulatory Guidelines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#021d63] tracking-tight">
            Important Considerations Before Investing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Government small savings schemes are governed by formal Gazette notifications and statutory rules. Review these operational guidelines to ensure hassle-free account management.
          </p>
        </div>

        {/* Considerations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {considerations.map((item, idx) => {
            return (
              <div 
                key={idx}
                className="bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-[#032e92]/30 hover:bg-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-300 shadow-sm">
                      <FontAwesomeIcon icon={item.icon} className="text-lg" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#021d63] mb-2 group-hover:text-[#032e92] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  <ul className="space-y-2.5 pt-3 border-t border-slate-200/70 text-xs text-slate-600">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-1.5 shrink-0" />
                        <span className="leading-normal">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory Callout Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#021d63] to-[#032e92] text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-blue-950/15">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-1 border border-white/20">
              <FontAwesomeIcon icon={faShieldHalved} className="text-amber-300 text-lg" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
                Government Gazette Rules Apply
              </h4>
              <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
                Rules governing interest rates, premature closure penalties, maturity extensions, and loan facilities are notified by the Ministry of Finance under the Government Savings Promotion Act and may be updated periodically.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <a 
              href="#faqs"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-white text-[#021d63] hover:bg-blue-50 font-bold text-sm transition-all shadow-sm"
            >
              <span>Read Detailed FAQs</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SmallSavingsImportantConsiderations;
