import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faFileContract,
  faScaleBalanced,
  faTriangleExclamation,
  faUserCheck,
  faShieldHalved,
  faCoins,
  faBan,
  faGavel,
  faEnvelope,
  faPhone,
  faLocationDot,
  faCircleCheck,
  faBuildingColumns,
} from '@fortawesome/free-solid-svg-icons';

const SECTIONS = [
  { id: 'acceptance', label: '1. Acceptance of Terms', icon: faFileContract },
  { id: 'regulatory', label: '2. Regulatory Status & Role', icon: faBuildingColumns },
  { id: 'market-risk', label: '3. Market Risk & Disclaimer', icon: faTriangleExclamation },
  { id: 'eligibility', label: '4. Eligibility & Information', icon: faUserCheck },
  { id: 'services', label: '5. Services & Tools', icon: faCoins },
  { id: 'transactions', label: '6. Transactions & Cut-off', icon: faShieldHalved },
  { id: 'intellectual-property', label: '7. Intellectual Property', icon: faScaleBalanced },
  { id: 'prohibited-conduct', label: '8. Prohibited Conduct', icon: faBan },
  { id: 'limitation-liability', label: '9. Limitation of Liability', icon: faTriangleExclamation },
  { id: 'governing-law', label: '10. Governing Law & Disputes', icon: faGavel },
  { id: 'grievance', label: '11. Grievance Redressal', icon: faEnvelope },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-[#f8fafd] min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-[120px] pb-10 sm:pt-[130px] sm:pb-14 bg-gradient-to-b from-[#eef4ff] via-[#f4f7fc] to-[#f8fafd] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-5 text-[#032e92] text-xs font-bold tracking-widest uppercase">
              <FontAwesomeIcon icon={faFileContract} className="text-[#032e92]" />
              <span>Legal Terms &amp; Policies</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight mb-4">
              Terms &amp; <span className="text-[#032e92]">Conditions</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Please read these terms and conditions carefully before utilizing our website, financial calculators, portfolio review tools, or distribution services.
            </p>

            {/* Breadcrumb & Metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-6 text-sm text-gray-500 font-medium">
              <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <span className="text-[#032e92] font-semibold">Terms and Conditions</span>
              <span className="text-gray-300">|</span>
              <span>Last Updated: October 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sticky Table of Contents Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-28 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {SECTIONS.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                        activeSection === sec.id
                          ? 'bg-[#032e92] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#032e92]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={sec.icon}
                        className={`text-xs ${activeSection === sec.id ? 'text-white' : 'text-gray-400'}`}
                      />
                      <span className="truncate">{sec.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-[#f0f4fd] p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">
                      Need clarification regarding our terms or distributor agreement?
                    </p>
                    <Link
                      to="/contact-us"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#032e92] hover:text-[#c10000] mt-2 transition-colors"
                    >
                      <span>Reach Support Team</span>
                      <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Terms Content */}
            <main className="lg:col-span-8 xl:col-span-9 space-y-10">
              {/* Important Statutory Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-lg mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 mb-1">Statutory Regulatory Notice</h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      KNAPS Private Limited is an AMFI-registered Mutual Fund Distributor (ARN Holder). Mutual fund investments are subject to market risks. Please read all scheme-related offer documents, Key Information Memorandum (KIM), and Scheme Information Document (SID) issued by respective Asset Management Companies (AMCs) carefully prior to investing.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Acceptance */}
              <section id="acceptance" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    01
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Acceptance of Terms
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    Welcome to the digital platform of <strong>KNAPS Private Limited</strong> (hereinafter referred to as &ldquo;<strong>KNAPS</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>our</strong>&rdquo;, or &ldquo;<strong>us</strong>&rdquo;). These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of our website (<span className="text-[#032e92] font-medium">www.knaps.in</span>), investment portals, calculators, financial tools, risk assessment profilers, and allied distribution services.
                  </p>
                  <p>
                    By browsing, accessing, registering, submitting an inquiry, or executing any mutual fund transaction through KNAPS, you expressly acknowledge and agree to be bound by these Terms, as well as our <Link to="/privacy-policy" className="text-[#032e92] font-semibold underline hover:text-[#c10000]">Privacy Policy</Link>. If you do not agree with any part of these Terms, you must discontinue using our services immediately.
                  </p>
                </div>
              </section>

              {/* 2. Regulatory Status */}
              <section id="regulatory" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    02
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Regulatory Status &amp; Scope of Services
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    KNAPS Private Limited operates as an <strong>AMFI-registered Mutual Fund Distributor</strong> (Association of Mutual Funds in India). Our role is strictly governed by the guidelines and circulars issued by the Securities and Exchange Board of India (SEBI) and AMFI:
                  </p>
                  <ul className="space-y-3 pl-2">
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Distributor Capacity:</strong> We facilitate the distribution and transaction execution of mutual fund schemes offered by various SEBI-registered Asset Management Companies (AMCs).</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Commission Disclosure:</strong> In accordance with SEBI circulars, KNAPS receives trail commissions directly from Asset Management Companies for mutual fund schemes distributed through us. We do not charge advisory fees from investors for mutual fund distribution.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Execution Platform:</strong> Transaction orders are routed via recognized transaction platforms including BSE Star MF, NSE NMF II, or directly with respective Mutual Fund AMCs/RTAs (CAMS, KFintech).</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 3. Market Risk */}
              <section id="market-risk" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c10000] flex items-center justify-center font-bold text-base">
                    03
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Market Risks &amp; Non-Guarantee of Returns
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <div className="p-4 rounded-xl bg-red-50/60 border border-red-100 text-red-950 font-semibold text-sm">
                    Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
                  </div>
                  <p>
                    All investments in mutual funds, equities, debt instruments, and related financial products are subject to market fluctuations, interest rate risks, credit risks, liquidity risks, and macroeconomic volatility.
                  </p>
                  <ul className="space-y-2.5 pl-2">
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#c10000] mt-1 text-sm flex-shrink-0" />
                      <span><strong>No Assured Returns:</strong> KNAPS does not guarantee, assure, or predict any specific returns, capital preservation, dividend payouts, or Net Asset Value (NAV) appreciation on any investment product.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#c10000] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Historical Performance:</strong> Past performance figures displayed on the website or marketing collateral are strictly indicative and do not guarantee future performance.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#c10000] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Investor Discretion:</strong> All decisions to purchase, switch, or redeem units of any mutual fund scheme are made solely at the investor’s own discretion and risk assessment.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 4. Eligibility */}
              <section id="eligibility" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    04
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Eligibility &amp; Information Accuracy
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    By engaging with KNAPS, you confirm and warrant that:
                  </p>
                  <ul className="space-y-3 pl-2">
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span>You are at least 18 years of age and legally competent to enter into binding legal agreements under the Indian Contract Act, 1872.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span>If you are a Non-Resident Indian (NRI) or Person of Indian Origin (PIO), your investments comply fully with the Foreign Exchange Management Act (FEMA), Reserve Bank of India (RBI) regulations, and AMC guidelines.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span>All information furnished by you (including PAN, Aadhaar, KYC status, bank account details, contact information, and risk profile answers) is truthful, accurate, and up-to-date.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span>You consent to receive communications (SMS, WhatsApp, emails, telephone calls) concerning your account status, order updates, OTPs, and statutory disclosures, even if your phone number is registered with the National Do Not Call (NDNC) Registry.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 5. Services & Tools */}
              <section id="services" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    05
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Calculators &amp; Informational Tools
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    Our platform provides various computational tools, including:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                      <strong>SIP &amp; Lumpsum Calculators:</strong> Mathematical models projecting compound growth based on user-entered hypothetical interest rates.
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                      <strong>Risk Profiler Assessment:</strong> Questionnaire-driven risk categorization to help you identify mutual fund categories suitable to your appetite.
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                      <strong>Goal Planning Tools:</strong> Illustrative estimates for retirement, child education, and major life goals.
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                      <strong>Portfolio Review Reports:</strong> Aggregated summary reports highlighting asset allocation, overlap, and category diversification.
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    Disclaimer: Calculations generated by these tools are illustrative and intended for educational planning purposes only. They do not constitute an offer, formal investment advice, or guaranteed outcome.
                  </p>
                </div>
              </section>

              {/* 6. Transactions & Cut-off */}
              <section id="transactions" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    06
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Transactions, Cut-off Timings &amp; Settlement
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    All transaction requests (purchases, additional purchases, SIP setups, redemptions, switches) processed through KNAPS or partner exchange portals are governed by strict SEBI regulations:
                  </p>
                  <ul className="space-y-3 pl-2">
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Cut-off Timings &amp; NAV Applicability:</strong> Applicable NAV for any mutual fund transaction is determined strictly based on SEBI cut-off rules and the actual realization/credit of funds in the AMC’s scheme account, not the time of order placement.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Banking &amp; Payment Gateway Third Parties:</strong> Funds for mutual fund transactions are transferred directly from your verified bank account to the clearing corporation (ICCL/NSE Clearing) or the AMC account. KNAPS never collects or handles investor funds in its own bank accounts.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span><strong>Third-Party Payment Delays:</strong> KNAPS shall not be held liable for delayed or rejected orders resulting from banking gateway failures, NPCI mandate delays, or network disruptions beyond our control.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 7. Intellectual Property */}
              <section id="intellectual-property" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    07
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Intellectual Property Rights
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    All content, including but not limited to logos, trademarks, website layouts, user interfaces, calculator source code, articles, research guides, graphical illustrations, and brand assets displayed on <span className="text-[#032e92] font-semibold">knaps.in</span> are the exclusive intellectual property of <strong>KNAPS Private Limited</strong> or its licensors.
                  </p>
                  <p>
                    You are granted a limited, personal, non-exclusive, non-transferable license to access the website for personal financial management. You may not reproduce, copy, distribute, modify, scrape, reverse-engineer, or commercially exploit any material from this site without our prior written consent.
                  </p>
                </div>
              </section>

              {/* 8. Prohibited Conduct */}
              <section id="prohibited-conduct" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    08
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Prohibited Conduct &amp; Platform Security
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>While using our platform, you agree NOT to:</p>
                  <ul className="space-y-2.5 pl-2">
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 mt-1 text-sm flex-shrink-0" />
                      <span>Provide forged, fraudulent, or impersonated KYC documents, PAN details, or bank records.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 mt-1 text-sm flex-shrink-0" />
                      <span>Use automated spiders, scrapers, data-mining tools, or bots to harvest data from our servers.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 mt-1 text-sm flex-shrink-0" />
                      <span>Introduce malicious computer viruses, trojans, worms, or code designed to compromise website security.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 mt-1 text-sm flex-shrink-0" />
                      <span>Engage in money laundering, unauthorized third-party investments, or illicit financial activities prohibited under the Prevention of Money Laundering Act (PMLA).</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 9. Limitation of Liability */}
              <section id="limitation-liability" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    09
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Limitation of Liability &amp; Indemnity
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    To the maximum extent permitted by applicable Indian law, KNAPS Private Limited, its directors, officers, employees, partners, and agents shall not be liable for:
                  </p>
                  <ul className="space-y-2.5 pl-2">
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span>Any direct, indirect, incidental, special, or consequential investment losses resulting from capital depreciation, NAV downward movements, or macroeconomic occurrences.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span>System interruptions, server downtime, telecommunication latency, or force majeure events preventing timely order placement.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 text-sm flex-shrink-0" />
                      <span>Actions, omissions, or delays caused by third-party financial intermediaries (AMCs, RTAs, BSE/NSE, banks, or payment gateways).</span>
                    </li>
                  </ul>
                  <p>
                    You agree to indemnify and hold harmless KNAPS and its representatives from any claims, damages, liabilities, or legal expenses arising from your violation of these Terms or infringement of statutory laws.
                  </p>
                </div>
              </section>

              {/* 10. Governing Law */}
              <section id="governing-law" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    10
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Governing Law &amp; Dispute Resolution
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    These Terms and Conditions shall be governed by, construed, and enforced in accordance with the laws of the Republic of India.
                  </p>
                  <p>
                    Any disputes, controversies, or claims arising out of or in connection with the use of our services or these Terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong>New Delhi, India</strong>.
                  </p>
                  <p>
                    We reserve the right to revise or update these Terms periodically to align with regulatory amendments or operational enhancements. Continued use of the platform following the publication of revised terms constitutes your acceptance of such updates.
                  </p>
                </div>
              </section>

              {/* 11. Grievance Redressal */}
              <section id="grievance" className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center font-bold text-base">
                    11
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                    Grievance Redressal &amp; Nodal Officer
                  </h2>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    If you have any queries, concerns, or grievances concerning these Terms and Conditions or your investment account, please contact our designated Grievance Officer:
                  </p>

                  <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/40 border border-blue-100">
                    <h3 className="text-base font-bold text-[#0a192f] mb-3">
                      KNAPS Private Limited
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#032e92] mt-1" />
                        <div>
                          <p className="font-semibold text-gray-800">Office Address</p>
                          <p className="text-gray-600">
                            DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase - 1, East Delhi, Delhi - 110091
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faEnvelope} className="text-[#032e92]" />
                          <div>
                            <p className="font-semibold text-gray-800">Email Address</p>
                            <a href="mailto:connect@knaps.in" className="text-[#032e92] hover:underline font-medium">
                              connect@knaps.in
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={faPhone} className="text-[#032e92]" />
                          <div>
                            <p className="font-semibold text-gray-800">Helpline Phone</p>
                            <a href="tel:+919990243143" className="text-[#032e92] hover:underline font-medium">
                              (+91) 9990243143
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 pt-2">
                    Additionally, in compliance with SEBI investor guidelines, investors may also lodge mutual fund related grievances on the SEBI SCORES portal (<span className="text-[#032e92]">scores.sebi.gov.in</span>) or via SMART ODR.
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
