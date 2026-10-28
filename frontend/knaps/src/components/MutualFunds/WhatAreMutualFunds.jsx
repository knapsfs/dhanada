import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPeopleGroup,
  faUserTie,
  faLayerGroup,
  faArrowTrendUp,
  faLightbulb,
  faCheck,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export default function WhatAreMutualFunds() {
  const steps = [
    {
      step: '01',
      title: 'Pooling of Capital',
      desc: 'Thousands of retail and institutional investors pool their individual savings (from ₹500/mo) into a single fund managed as a collective trust.',
      icon: faPeopleGroup,
      highlight: 'Collective Strength'
    },
    {
      step: '02',
      title: 'Professional Fund Management',
      desc: 'Expert SEBI-registered fund managers and quantitative research teams conduct company visits, read financial balance sheets, and formulate investment strategies.',
      icon: faUserTie,
      highlight: 'Deep Research'
    },
    {
      step: '03',
      title: 'Diversified Asset Allocation',
      desc: 'The pooled capital is deployed across 50 to 100+ carefully selected stocks, government securities, or corporate debentures to mitigate single-stock risk.',
      icon: faLayerGroup,
      highlight: 'Spread Across Assets'
    },
    {
      step: '04',
      title: 'Net Asset Value (NAV) Growth',
      desc: 'Each investor receives units proportional to their investment. As underlying securities appreciate and pay dividends, the NAV increases, compounding your wealth.',
      icon: faArrowTrendUp,
      highlight: 'Proportional Gains'
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faLightbulb} className="text-[#2490ef]" />
            <span>Core Investment Concept</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            What Are Mutual Funds?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            A mutual fund is an investment vehicle that pools money from many investors to purchase a diversified portfolio of securities like stocks, bonds, or money market instruments. Instead of buying individual shares yourself, professional fund managers do the heavy lifting for you.
          </p>
        </div>

        {/* 4-Step Visual Journey */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative p-6 sm:p-7 rounded-3xl bg-[#f8fbff] border border-blue-100/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100/70 text-[#032e92]">
                    STEP {item.step}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-[#032e92] shadow-xs">
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100/60 flex items-center justify-between text-xs font-semibold text-[#032e92]">
                <span>{item.highlight}</span>
                <span className="text-blue-400">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison: Direct Stock Investing vs Mutual Funds */}
        <div className="mt-16 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 rounded-3xl p-6 sm:p-8 lg:p-10 border border-blue-100 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#032e92]">
              Direct Stocks vs. Mutual Funds: Which Is Right For You?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Understanding why mutual funds are the preferred vehicle for disciplined, sustainable wealth creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct Stocks */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-800">Direct Stock Picking</h4>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  DIY Investing
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faXmark} className="text-rose-500 mt-1 flex-shrink-0" />
                  <span>High concentration risk if individual companies underperform.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faXmark} className="text-rose-500 mt-1 flex-shrink-0" />
                  <span>Demands continuous tracking of quarterly earnings, news, and market shifts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faXmark} className="text-rose-500 mt-1 flex-shrink-0" />
                  <span>Requires large initial capital to achieve meaningful sector diversification.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faXmark} className="text-rose-500 mt-1 flex-shrink-0" />
                  <span>Susceptible to emotional panic selling during volatile market drawdowns.</span>
                </li>
              </ul>
            </div>

            {/* Mutual Funds */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[#032e92]/30 shadow-md shadow-blue-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#032e92] text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl">
                Recommended for Most
              </div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-[#032e92]">Mutual Funds via KNAPS</h4>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#032e92]">
                  Managed Wealth
                </span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mt-1 flex-shrink-0 font-bold" />
                  <span>Instant diversification across 50 to 100+ vetted companies with just ₹500.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mt-1 flex-shrink-0 font-bold" />
                  <span>Full-time professional fund managers and analyst teams handle research.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mt-1 flex-shrink-0 font-bold" />
                  <span>Automated SIP removes emotional bias and provides Rupee Cost Averaging.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-600 mt-1 flex-shrink-0 font-bold" />
                  <span>Stringent SEBI regulation, daily NAV audits, and custodian asset protection.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
