import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faShieldHalved,
  faArrowRight,
  faCalculator,
  faCheckCircle,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function MfHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 lg:pt-36 lg:pb-12 overflow-hidden bg-gradient-to-b from-blue-50/70 via-[#f7f9fc] to-white">
      {/* Decorative Blur Background Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center pb-4 sm:pb-5 gap-3 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-600" />
          <Link to="/products" className="hover:text-[#032e92] transition-colors">Products</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-600" />
          <span className="text-[#032e92]">Mutual Funds</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & Headlines */}
          <div className="lg:col-span-7 space-y-6">

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Invest in Mutual Funds with <span className="text-[#032e92]">Confidence</span>
            </h1>

            {/* Hero Copy */}
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed mt-3.5">
              Mutual funds are SEBI-regulated investments that are professionally managed and diversified across a range of securities. With a wide choice of AMCs and fund houses, you can choose investments that match your financial goals and risk profile.
            </p>

            {/* Trust Points Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-gray-900 text-sm font-medium">
                {/* <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" /> */}
                <span>Power of Compounding</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-900 text-sm font-medium">
                {/* <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" /> */}
                <span>SEBI-Regulated</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-900 text-sm font-medium">
                {/* <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" /> */}
                <span>Highly Liquid & Flexible</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-900 text-sm font-medium">
                {/* <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" /> */}
                <span>Start Small, Build Long term Wealth</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => openLeadModal('Mutual Funds: Hero Start SIP')}
                className="btn-ripple px-6 py-3 rounded-xl text-md font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <span>Invest in Mutual Funds</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Infographic Feature Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl shadow-blue-950/5">
              {/* Floating Top Badge */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  {/* <div className="text-xs font-semibold text-gray-600 uppercase">KNAPS Smart Wealth</div> */}
                  <div className="text-lg font-bold text-[#032e92]">Power Of Compounding</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
                  <FontAwesomeIcon icon={faChartLine} className="text-xl" />
                </div>
              </div>

              {/* Mini Compounding Simulation Graphic */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8fbff] to-blue-50/50 border border-blue-100/80">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-1">
                    <span>Monthly SIP of ₹10,000 for 15 Years</span>
                    <span className="text-[#032e92] font-bold">@ 12% p.a.*</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-gray-600 font-medium">Invested Amount</div>
                      <div className="text-base font-bold text-gray-900">₹18,00,000</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 font-medium">Est. Wealth Value</div>
                      <div className="text-xl font-extrabold text-[#032e92]">₹50,45,760</div>
                    </div>
                  </div>
                  {/* Progress Bar Visual */}
                  <div className="mt-3 w-full bg-gray-200 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-gray-400 h-full w-[36%]" title="Invested" />
                    <div className="bg-gradient-to-r from-[#2490ef] to-[#032e92] h-full w-[64%]" title="Potential Gains" />
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600 mt-1.5 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                      Invested (36%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#032e92] inline-block"></span>
                      Estimated Gain (64%)
                    </span>
                  </div>
                </div>




              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
