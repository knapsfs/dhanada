import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';
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
  faPhone,
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
      <SEO
        {...PAGE_SEO.terms}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Terms and Conditions", url: "/terms-and-conditions" }
        ]}
      />
      <Navbar />

      {/* Hero Header matching website standard */}
      <section className="relative pt-[120px] pb-10 sm:pt-[130px] sm:pb-14 bg-gradient-to-b from-[#eef4ff] via-[#f4f7fc] to-[#f8fafd] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
              Terms &amp; <span className="text-[#032e92]">Conditions</span>
            </h1>

            {/* Breadcrumb & Metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-6 text-sm text-gray-500 font-medium">
              <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <span className="text-[#032e92]">Terms and Conditions</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="text-xs bg-blue-50 text-[#032e92] px-3 py-1 rounded-full font-semibold border border-blue-100">
                Effective: October 2026
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Sticky Table of Contents Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 px-3">
                Contents
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${isActive
                        ? 'bg-[#eef5ff] text-[#032e92] font-bold shadow-xs'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <FontAwesomeIcon
                        icon={sec.icon}
                        className={`text-xs ${isActive ? 'text-[#032e92]' : 'text-gray-400'}`}
                      />
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#021d63] text-white">
                  <h4 className="text-sm font-bold mb-1">Need further Clarification?</h4>
                  <p className="text-xs text-blue-100 leading-relaxed mb-3">
                    Need clarification regarding our terms or distributor agreement?
                  </p>
                  <a
                    href="tel:+918850257971"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#032e92] px-3.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPhone} />
                    <span>Talk to us</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <main className="lg:col-span-8 space-y-10">

              {/* 1. Acceptance */}
              <article id="acceptance" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    1
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Acceptance of Terms
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    Welcome to the digital platform of <strong>KNAPS Private Limited</strong> (hereinafter referred to as &ldquo;<strong>KNAPS</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>our</strong>&rdquo;, or &ldquo;<strong>us</strong>&rdquo;). These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of our website (<a href="https://knaps.in" className="text-[#032e92] font-semibold underline">knaps.in</a>), investment portals, calculators, financial tools, risk assessment profilers, and allied distribution services.
                  </p>
                  <p>
                    By browsing, accessing, registering, submitting an inquiry, or executing any mutual fund transaction through KNAPS, you expressly acknowledge and agree to be bound by these Terms, as well as our <Link to="/privacy-policy" className="text-[#032e92] font-semibold underline hover:text-[#021d63]">Privacy Policy</Link>. If you do not agree with any part of these Terms, you must discontinue using our services immediately.
                  </p>
                </div>
              </article>

              {/* 2. Regulatory Status */}
              <article id="regulatory" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    2
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Regulatory Status &amp; Scope of Services
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    KNAPS Private Limited facilitates investments across a wide range of financial products, including Mutual Funds, PMS, SIF, AIF, NPS, Fixed Deposits and Post Office schemes.
                  </p>
                  <p>
                    We facilitate the distribution and execution of mutual fund investments offered by SEBI-registered Asset Management Companies (AMCs).
                  </p>
                  <p>
                    We do not charge investors any advisory fees for mutual fund distribution services.
                  </p>

                </div>
              </article>

              {/* 3. Market Risk */}
              <article id="market-risk" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    3
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Market-linked Returns &amp; Disclaimers
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.
                  </p>
                  <p>
                    We encourage investors to consider equity investments only when they have a long-term investment horizon, typically 5 years or more. Past performance may offer insights but does not guarantee future returns.
                  </p>
                  <p>
                    Markets move through different cycles. We help investors make informed investment decisions along the way.
                  </p>
                </div>
              </article>

              {/* 4. Eligibility */}
              <article id="eligibility" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    4
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Eligibility &amp; Information Accuracy
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    By engaging with KNAPS, you confirm and warrant that:
                  </p>
                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        You are at least 18 years of age and legally competent to enter into binding legal agreements under the Indian Contract Act, 1872.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        If you are a Non-Resident Indian (NRI) or Person of Indian Origin (PIO), your investments comply fully with the Foreign Exchange Management Act (FEMA), Reserve Bank of India (RBI) regulations, and AMC guidelines.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        All information furnished by you (including PAN, Aadhaar, KYC status, bank account details, contact information, and risk profile answers) is truthful, accurate, and up-to-date.
                      </div>
                    </li>
                  </ul>
                </div>
              </article>

              {/* 5. Services & Tools */}
              <article id="services" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    5
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Calculators &amp; Informational Tools
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    KNAPS provides various computational tools like SIP and lump sum calculators, risk profiling, goal planning tools, and portfolio review reports to help investors evaluate their investments, plan financial goals, and make informed decisions.
                  </p>
                  <p>
                    These calculations are illustrative and for educational purposes only. They do not constitute investment advice or guarantee returns.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <strong className="text-gray-900 block mb-1">SIP &amp; Lumpsum Calculators:</strong>
                      <span className="text-xs sm:text-sm text-gray-600">Mathematical models projecting compound growth based on user-entered hypothetical interest rates.</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <strong className="text-gray-900 block mb-1">Risk Profiler Assessment:</strong>
                      <span className="text-xs sm:text-sm text-gray-600">Questionnaire-driven risk categorization to help you identify mutual fund categories suitable to your appetite.</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <strong className="text-gray-900 block mb-1">Goal Planning Tools:</strong>
                      <span className="text-xs sm:text-sm text-gray-600">Illustrative estimates for retirement, child education, and major life goals.</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <strong className="text-gray-900 block mb-1">Portfolio Review Reports:</strong>
                      <span className="text-xs sm:text-sm text-gray-600">Aggregated summary reports highlighting asset allocation, overlap, and category diversification.</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* 6. Transactions & Cut-off */}
              <article id="transactions" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    6
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Transactions, Cut-off Timings &amp; Settlement
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    All transaction requests (purchases, additional purchases, SIP setups, redemptions, switches) processed through KNAPS or partner exchange portals are governed by strict SEBI regulations:
                  </p>
                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        <strong className="text-gray-900">Cut-off Timings &amp; NAV Applicability:</strong> Applicable NAV for any mutual fund transaction is determined strictly based on SEBI cut-off rules and the actual realization/credit of funds in the AMC’s scheme account, not the time of order placement.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        <strong className="text-gray-900">Banking &amp; Payment Gateway Third Parties:</strong> Funds for mutual fund transactions are transferred directly from your verified bank account to the clearing corporation (ICCL/NSE Clearing) or the AMC account. KNAPS never collects or handles investor funds in its own bank accounts.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        <strong className="text-gray-900">Third-Party Payment Delays:</strong> KNAPS shall not be held liable for delayed or rejected orders resulting from banking gateway failures, NPCI mandate delays, or network disruptions beyond our control.
                      </div>
                    </li>
                  </ul>
                </div>
              </article>

              {/* 7. Intellectual Property */}
              <article id="intellectual-property" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    7
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Intellectual Property Rights
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    All content, including but not limited to logos, trademarks, website layouts, user interfaces, calculator source code, articles, research guides, graphical illustrations, and brand assets displayed on <a href="https://knaps.in" className="text-[#032e92] font-semibold underline">knaps.in</a> are the exclusive intellectual property of <strong>KNAPS Private Limited</strong> or its licensors.
                  </p>
                  <p>
                    Website content, including text, graphics, and other materials, may be accessed and used for personal, non-commercial purposes. Copying, reproducing, modifying, distributing, or using any content for commercial purposes requires prior written permission from KNAPS Private Limited.
                  </p>
                </div>
              </article>

              {/* 8. Prohibited Conduct */}
              <article id="prohibited-conduct" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    8
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Prohibited Conduct &amp; Platform Security
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>While using our platform, you agree NOT to:</p>
                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 text-sm mt-1 shrink-0" />
                      <div>Provide forged, fraudulent, or impersonated KYC documents, PAN details, or bank records.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 text-sm mt-1 shrink-0" />
                      <div>Use automated spiders, scrapers, data-mining tools, or bots to harvest data from our servers.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 text-sm mt-1 shrink-0" />
                      <div>Introduce malicious computer viruses, trojans, worms, or code designed to compromise website security.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faBan} className="text-red-500 text-sm mt-1 shrink-0" />
                      <div>Engage in money laundering, unauthorized third-party investments, or illicit financial activities prohibited under the Prevention of Money Laundering Act (PMLA).</div>
                    </li>
                  </ul>
                </div>
              </article>

              {/* 9. Limitation of Liability */}
              <article id="limitation-liability" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    9
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Limitation of Liability &amp; Indemnity
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
                  <p>
                    To the maximum extent permitted by applicable Indian law, KNAPS Private Limited, its directors, officers, employees, partners, and agents shall not be liable for:
                  </p>
                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>Any direct, indirect, incidental, special, or consequential investment losses resulting from capital depreciation, NAV downward movements, or macroeconomic occurrences.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>System interruptions, server downtime, telecommunication latency, or force majeure events preventing timely order placement.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>Actions, omissions, or delays caused by third-party financial intermediaries (AMCs, RTAs, BSE/NSE, banks, or payment gateways).</div>
                    </li>
                  </ul>
                  <p className="pt-2">
                    You agree to indemnify and hold harmless KNAPS and its representatives from any claims, damages, liabilities, or legal expenses arising from your violation of these Terms or infringement of statutory laws.
                  </p>
                </div>
              </article>

              {/* 10. Governing Law */}
              <article id="governing-law" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    10
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Governing Law &amp; Dispute Resolution
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-md text-gray-600 leading-relaxed">
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
              </article>

            </main>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
