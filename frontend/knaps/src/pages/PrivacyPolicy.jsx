import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faShieldHalved,
  faLock,
  faUserShield,
  faDatabase,
  faCookieBite,
  faScaleBalanced,
  faFileContract,
  faEnvelope,
  faPhone,
  faLocationDot,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

const SECTIONS = [
  { id: 'introduction', label: '1. Introduction', icon: faShieldHalved },
  { id: 'collection', label: '2. Information We Collect', icon: faDatabase },
  { id: 'usage', label: '3. How We Use Information', icon: faUserShield },
  { id: 'sharing', label: '4. Information Sharing', icon: faScaleBalanced },
  { id: 'security', label: '5. Data Security', icon: faLock },
  { id: 'cookies', label: '6. Cookies Policy', icon: faCookieBite },
  { id: 'rights', label: '7. Your Privacy Rights', icon: faFileContract },
  { id: 'retention', label: '8. Data Retention', icon: faDatabase },
  { id: 'grievance', label: '9. Grievance Officer', icon: faEnvelope },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

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

      {/* Hero Header matching website standard */}
      <section className="relative pt-[120px] pb-10 sm:pt-[130px] sm:pb-14 bg-gradient-to-b from-[#eef4ff] via-[#f4f7fc] to-[#f8fafd] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-5 text-[#032e92] text-xs font-bold tracking-widest uppercase">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92]" />
              <span>Legal &amp; Compliance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight mb-4">
              Privacy <span className="text-[#032e92]">Policy</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              At KNAPS Private Limited, safeguarding your confidential financial details and personal information is our utmost commitment.
            </p>

            {/* Breadcrumb & Metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-6 text-sm text-gray-500 font-medium">
              <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <span className="text-[#032e92]">Privacy Policy</span>
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-3">
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
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                        isActive
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
                  <h4 className="text-sm font-bold mb-1">Need Clarification?</h4>
                  <p className="text-xs text-blue-100 leading-relaxed mb-3">
                    Have any questions regarding how your data is handled?
                  </p>
                  <a
                    href="mailto:connect@knaps.in"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#032e92] px-3.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Email Compliance</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <main className="lg:col-span-8 space-y-10">

              {/* Section 1 */}
              <article id="introduction" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    1
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Introduction &amp; Scope
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    <strong>KNAPS Private Limited</strong> (&ldquo;KNAPS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an AMFI-registered financial services distributor dedicated to providing transparent, disciplined, and client-centric wealth creation solutions across India.
                  </p>
                  <p>
                    This Privacy Policy sets forth our policies and practices regarding the collection, handling, storage, processing, and disclosure of personal, financial, and technical information collected when you access our website (<a href="https://knaps.in" className="text-[#032e92] font-semibold underline">knaps.in</a>), use our mobile applications, consult with our advisors, or utilize our financial distribution services.
                  </p>
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-medium">
                    We comply strictly with the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023, and guidelines issued by the Securities and Exchange Board of India (SEBI) and Association of Mutual Funds in India (AMFI).
                  </div>
                </div>
              </article>

              {/* Section 2 */}
              <article id="collection" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    2
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Information We Collect
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    In order to deliver tailored wealth distribution services and comply with statutory financial regulations, we collect the following categories of data:
                  </p>
                  <ul className="space-y-3 pt-2">
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        <strong className="text-gray-900">Personal Identifiers:</strong> Name, email address, contact telephone/mobile number, date of birth, residential address, and identity verification details.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        <strong className="text-gray-900">Regulatory &amp; KYC Data:</strong> Permanent Account Number (PAN), Aadhaar details (offline verification/masking as per UIDAI norms), bank account details (for verification of investment transactions), and FATCA/CRS declarations.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        <strong className="text-gray-900">Financial Profile &amp; Risk Tolerance:</strong> Investment horizons, existing holdings, annual income brackets, risk appetite questionnaire responses, and stated financial goals.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-sm mt-1 shrink-0" />
                      <div>
                        <strong className="text-gray-900">Technical &amp; Log Data:</strong> IP address, browser type, device information, operating system, and interaction metrics with our calculators and site pages.
                      </div>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 3 */}
              <article id="usage" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    3
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    How We Use Your Information
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    We collect and process your information exclusively for legitimate business and regulatory purposes, including:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Execution of Investments</h4>
                      <p className="text-xs text-gray-500">Processing onboarding, KYC validation, and routing of investment instructions to asset management companies.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Risk Suitability</h4>
                      <p className="text-xs text-gray-500">Evaluating your investment horizon and risk profile to suggest appropriate products and asset allocations.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Regulatory Reporting</h4>
                      <p className="text-xs text-gray-500">Meeting mandatory record-keeping, anti-money laundering (AML), and SEBI/AMFI compliance requirements.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Customer Communication</h4>
                      <p className="text-xs text-gray-500">Delivering portfolio statements, transaction confirmations, market insights, and answering your service requests.</p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 4 */}
              <article id="sharing" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    4
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Information Sharing &amp; Disclosures
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold">
                    We do NOT sell, rent, or trade your personal data to any third party for commercial marketing under any circumstances.
                  </div>
                  <p>
                    Information may be shared exclusively with authorized entities involved directly in the investment lifecycle:
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-2 shrink-0"></span>
                      <span><strong>Asset Management Companies (AMCs) &amp; Issuers:</strong> To register folios, SIPs, and process fund subscriptions or redemptions.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-2 shrink-0"></span>
                      <span><strong>Registrar &amp; Transfer Agents (RTAs):</strong> CAMS, KFin Technologies, and similar entities responsible for unit accounting.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-2 shrink-0"></span>
                      <span><strong>Transaction Execution Platforms:</strong> SEBI-registered transaction switches such as BSE StAR MF and NSE NMF II.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-2 shrink-0"></span>
                      <span><strong>Statutory &amp; Law Enforcement Bodies:</strong> When formally subpoenaed or obligated by SEBI, Income Tax authorities, or judicial courts.</span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 5 */}
              <article id="security" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    5
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Data Security &amp; Storage
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    We implement defense-in-depth security standards to protect your electronic records and sensitive personal information against unauthorized disclosure, interception, or alteration:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <FontAwesomeIcon icon={faLock} className="text-[#032e92] text-xl mb-2" />
                      <h4 className="font-bold text-xs text-gray-900">TLS 1.3 Encryption</h4>
                      <p className="text-[11px] text-gray-500 mt-1">End-to-end encryption for all in-transit communications.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <FontAwesomeIcon icon={faDatabase} className="text-[#032e92] text-xl mb-2" />
                      <h4 className="font-bold text-xs text-gray-900">Encrypted Storage</h4>
                      <p className="text-[11px] text-gray-500 mt-1">AES-256 standard encryption for all database repositories.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <FontAwesomeIcon icon={faUserShield} className="text-[#032e92] text-xl mb-2" />
                      <h4 className="font-bold text-xs text-gray-900">Role-Based Access</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Strict least-privilege protocols for company personnel.</p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 6 */}
              <article id="cookies" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    6
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Cookies &amp; Tracking Technologies
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Our website utilizes essential session cookies and analytical tokens to maintain secure navigation, retain user preferences (such as calculator entries), and understand aggregate traffic patterns to improve site performance.
                  </p>
                  <p>
                    You may configure your browser settings to decline non-essential cookies; however, certain interactive functionalities (such as calculator projections or authenticated sessions) may be restricted.
                  </p>
                </div>
              </article>

              {/* Section 7 */}
              <article id="rights" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    7
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Your Rights &amp; Choices
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    Under applicable Indian data protection frameworks, you are entitled to:
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-2 shrink-0"></span>
                      <span><strong>Access &amp; Review:</strong> Request a summary of your personal information stored in our records.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-2 shrink-0"></span>
                      <span><strong>Rectification:</strong> Request correction of inaccurate, outdated, or incomplete contact/bank particulars.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] mt-2 shrink-0"></span>
                      <span><strong>Withdrawal of Consent:</strong> Withdraw consent for non-statutory communications (such as newsletters). Note that statutory retention required for active financial transactions cannot be prematurely purged.</span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Section 8 */}
              <article id="retention" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    8
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Data Retention Policy
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    In accordance with SEBI Regulations, Prevention of Money Laundering (PMLA) Rules, and relevant tax statutes, records pertaining to client identity, KYC records, and transactions are retained for a minimum statutory period of <strong>eight (8) years</strong> following the cessation of the account or transaction.
                  </p>
                  <p>
                    Following the expiration of statutory requirements, data is securely sanitized or anonymized from active operational databases.
                  </p>
                </div>
              </article>

              {/* Section 9 */}
              <article id="grievance" className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-base font-bold">
                    9
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Grievance Redressal Officer
                  </h2>
                </div>
                <div className="space-y-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    If you have questions, concerns, or grievances concerning our privacy practices or the handling of your data, you may reach our designated Grievance Officer:
                  </p>
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-3 mt-4 text-xs sm:text-sm">
                    <p className="font-bold text-gray-900 text-base">Grievance Officer &mdash; Compliance &amp; Legal</p>
                    <p className="text-gray-700"><strong>Entity:</strong> KNAPS Private Limited (AMFI Registered Distributor)</p>
                    <div className="flex items-start gap-2.5 text-gray-600">
                      <FontAwesomeIcon icon={faLocationDot} className="text-[#032e92] mt-1 shrink-0" />
                      <span>DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase - 1, East Delhi, Delhi - 110091</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <FontAwesomeIcon icon={faEnvelope} className="text-[#032e92] shrink-0" />
                      <a href="mailto:connect@knaps.in" className="text-[#032e92] hover:underline font-medium">connect@knaps.in</a>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <FontAwesomeIcon icon={faPhone} className="text-[#032e92] shrink-0" />
                      <a href="tel:+919990243143" className="text-[#032e92] hover:underline font-medium">(+91) 9990243143</a>
                    </div>
                  </div>
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
