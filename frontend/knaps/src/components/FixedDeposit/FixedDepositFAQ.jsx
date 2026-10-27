import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCircleQuestion,
  faShieldHalved,
  faBuildingColumns,
  faLandmark,
  faFileContract,
  faRotateRight,
  faCoins,
  faHandHoldingDollar
} from "@fortawesome/free-solid-svg-icons";

const faqs = [
  {
    id: 1,
    icon: faShieldHalved,
    category: "Safety & Backing",
    question: "How safe are Fixed Deposits and Government of India (GoI) Bonds?",
    answer:
      "Government of India (GoI) Bonds carry an absolute 100% sovereign guarantee backed by the Reserve Bank of India, meaning there is zero default or credit risk on both principal and interest. Bank Fixed Deposits are insured by the DICGC (a subsidiary of RBI) up to ₹5,00,000 per depositor per bank. Corporate/NBFC FDs are uninsurable under DICGC and rely on issuer balance sheet strength, which is why KNAPS curates only AAA/AA rated corporate issuers."
  },
  {
    id: 2,
    icon: faLandmark,
    category: "Sovereign Bonds",
    question: "What are RBI Floating Rate Savings Bonds (FRSB 2020) and how is the yield calculated?",
    answer:
      "RBI Floating Rate Savings Bonds are 7-year sovereign debt instruments issued by RBI. The coupon rate is floating and linked to the prevailing National Savings Certificate (NSC) rate with an additional spread of 35 bps. The coupon resets semi-annually (currently 8.05% p.a.). Interest is paid every 6 months directly into your bank account on January 1st and July 1st."
  },
  {
    id: 3,
    icon: faBuildingColumns,
    category: "Corporate FDs",
    question: "How do Corporate / NBFC Fixed Deposits differ from Bank Fixed Deposits?",
    answer:
      "Corporate FDs are term deposits placed with financial institutions and manufacturing companies (such as Bajaj Finance, Mahindra Finance, HDFC). They typically offer 0.50% to 1.50% higher interest rates than traditional banks to reward investors for taking moderate credit risk. We strictly recommend only top-rated AAA/AA options with a proven track record of timely interest payments."
  },
  {
    id: 4,
    icon: faFileContract,
    category: "Tax Optimization",
    question: "How do Section 54EC Bonds help save tax on real estate and property sales?",
    answer:
      "Under Section 54EC of the Income Tax Act, individuals who have realized Long Term Capital Gains (LTCG) from the sale of land or building can invest up to ₹50 Lakhs into eligible bonds (issued by REC, PFC, IRFC, and NHAI) within 6 months of the sale date. The invested amount is 100% exempt from capital gains tax, and the bonds pay an assured 5.25% annual interest over a 5-year lock-in period."
  },
  {
    id: 5,
    icon: faCoins,
    category: "Sovereign Gold",
    question: "What are Sovereign Gold Bonds (SGB) and what makes them unique?",
    answer:
      "Sovereign Gold Bonds are government securities denominated in grams of 24K gold issued by the RBI. They provide dual benefits: a fixed cash interest of 2.50% per annum paid semi-annually, plus complete capital appreciation matching physical gold prices. Most importantly, redemption at the end of the 8-year maturity is 100% tax-free under Section 47."
  },
  {
    id: 6,
    icon: faRotateRight,
    category: "Liquidity & Exit",
    question: "Can I withdraw my Fixed Deposit or GoI Bond before maturity?",
    answer:
      "For Bank FDs, premature withdrawal is permitted subject to a minor penal interest reduction of 0.5% to 1.0% (except 5-year Tax Saving FDs which have a strict statutory lock-in). For RBI Floating Rate Savings Bonds, premature exit is not allowed for general investors, but is permitted for senior citizens: 4 years lock-in for ages 80+, 5 years for ages 70–80, and 6 years for ages 60–70. 54EC bonds have a non-negotiable 5-year lock-in."
  },
  {
    id: 7,
    icon: faHandHoldingDollar,
    category: "Senior Citizens",
    question: "What special privileges do senior citizens receive in fixed income products?",
    answer:
      "Senior citizens (aged 60+) receive an additional interest rate spread of 0.50% to 0.75% across bank and corporate FDs. Furthermore, under Section 80TTB, senior citizens enjoy tax exemption on deposit interest up to ₹50,000 per year. They can also register Form 15H at the beginning of the financial year to prevent TDS deduction if their total taxable income is zero."
  },
  {
    id: 8,
    icon: faBuildingColumns,
    category: "Execution & Advisory",
    question: "How does KNAPS assist in building a Fixed Income portfolio?",
    answer:
      "KNAPS provides seamless, paperless execution across top scheduled banks, AAA corporate issuers, RBI sovereign bonds, and 54EC capital gain allocations. Our certified financial planners assist in tenure laddering to ensure you have predictable liquidity while maximizing yield across market cycles."
  }
];

export default function FixedDepositFAQ() {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-[#032e92]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Get clear, factual answers to help you navigate Fixed Deposits and Government of India Bonds with complete confidence.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-blue-50/30 border-blue-200 shadow-md"
                    : "bg-[#f7f9fc] border-gray-200/80 hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors ${
                        isOpen
                          ? "bg-[#032e92] text-white"
                          : "bg-white text-gray-500 border border-gray-200"
                      }`}
                    >
                      <FontAwesomeIcon icon={faq.icon} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                        {faq.category}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#0a192f]">
                        {faq.question}
                      </span>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#032e92]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-blue-100/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
