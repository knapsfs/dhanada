import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingColumns,
  faCertificate,
  faShieldHalved,
  faMagnifyingGlass,
  faArrowUpRightFromSquare,
  faChevronRight,
  faCircleCheck,
  faEnvelope,
  faPhone,
  faLocationDot,
  faScaleBalanced,
  faTriangleExclamation,
  faBuilding,
  faCopy,
  faCheck,
  faArrowDownAZ,
  faArrowUpZA,
  faCircleInfo,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

import {
  COMPANY_INFO,
  REGISTRATIONS,
  EMPANELLED_AMCS,
  GRIEVANCE_REDRESSAL,
  STATUTORY_DISCLAIMER
} from '../data/regulatoryData';

const NAV_TABS = [
  { id: 'company-info', label: 'Company Info' },
  { id: 'registrations', label: 'Our Registrations' },
  { id: 'amc-table', label: 'Mutual Fund AMCs (32)' },
  { id: 'grievance', label: 'Grievance Redressal' },
  { id: 'disclaimer', label: 'Regulatory Disclaimer' },
];

export default function RegulatoryDisclosures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'asc', 'desc'
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('company-info');

  // Set SEO title & meta description on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Registration & Regulatory Disclosures | KNAPS PRIVATE LIMITED';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Official regulatory registrations, AMFI ARN-367144 details, SIF authorisation, 32 empanelled SEBI-registered Mutual Fund AMCs, grievance redressal, and compliance disclosures of KNAPS PRIVATE LIMITED.'
      );
    }
  }, []);

  // Copy to clipboard helper
  const handleCopy = (text, key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Filtered and sorted AMCs
  const filteredAmcs = useMemo(() => {
    let list = [...EMPANELLED_AMCS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (amc) =>
          amc.name.toLowerCase().includes(q) ||
          amc.sebiReg.toLowerCase().includes(q) ||
          (amc.formerName && amc.formerName.toLowerCase().includes(q)) ||
          (amc.sponsor && amc.sponsor.toLowerCase().includes(q))
      );
    }

    if (sortOrder === 'asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      list.sort((a, b) => a.sno - b.sno);
    }

    return list;
  }, [searchQuery, sortOrder]);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-[#f8fafd] min-h-screen">
      <SEO
        {...PAGE_SEO.regulatory}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Regulatory Disclosures", url: "/regulatory-disclosures" }
        ]}
      />
      <Navbar />

      {/* Hero Header matching KNAPS Standard */}
      <section className="relative pt-[115px] pb-10 sm:pt-[130px] sm:pb-14 bg-gradient-to-b from-[#eef4ff] via-[#f4f7fc] to-[#f8fafd] border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-100 shadow-xs mb-4 text-[#032e92] text-xs font-bold tracking-widest uppercase">
              <FontAwesomeIcon icon={faScaleBalanced} className="text-[#032e92]" />
              <span>Statutory &amp; Regulatory Disclosures</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight mb-4">
              Registration &amp; Regulatory <span className="text-[#032e92]">Disclosures</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
              Public disclosure of our AMFI registration, authorised regulatory standing, 32 empanelled SEBI-registered Mutual Fund Asset Management Companies (AMCs), grievance redressal mechanism, and statutory compliance details for KNAPS PRIVATE LIMITED.
            </p>

            {/* Breadcrumb & Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-5 text-sm text-gray-500 font-medium">
              <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <span className="text-[#032e92] font-semibold">Regulatory Disclosures</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 text-[11px]" />
                AMFI Registered: ARN-367144
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#032e92] text-xs font-semibold border border-blue-100">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-[#032e92] text-[11px]" />
                32 Empanelled AMCs
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Quick-Jump Navigation Tabs */}
      <nav aria-label="Section Navigation" className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${isActive
                    ? 'bg-[#032e92] text-white shadow-xs font-bold'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">

        {/* =========================================================================
            SECTION 1: Company Information
        ========================================================================= */}
        <section id="company-info" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
              <FontAwesomeIcon icon={faBuilding} className="text-base" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] tracking-tight">
                Company Information
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Corporate identity, registered office address, and statutory communication coordinates.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            {/* Top Corporate Summary Banner */}
            <div className="bg-gradient-to-r from-[#032e92] via-[#022475] to-[#011850] p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {COMPANY_INFO.name}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 mt-1">
                  Formerly known as <span className="font-semibold text-white">{COMPANY_INFO.formerName}</span> • {COMPANY_INFO.entityType}
                </p>
              </div>


            </div>

            {/* 2-Column Details Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Column 1: Office & Corporate Coordinates */}
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Registered &amp; Corporate Office
                  </span>
                  <div className="flex items-start gap-3 mt-1.5">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[#032e92] mt-1 shrink-0 text-sm" />
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
                      {COMPANY_INFO.registeredOffice}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Corporate Identity (CIN)
                  </span>
                  <p className="text-sm text-gray-800 font-mono font-medium">
                    {COMPANY_INFO.cin}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    GSTIN Number
                  </span>
                  <p className="text-sm text-gray-800 font-mono font-medium">
                    {COMPANY_INFO.gstin}
                  </p>
                </div>


              </div>

              {/* Column 2: Communications & Official Touchpoints */}
              <div className="space-y-5 md:pl-8 pt-5 md:pt-0">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Telephone Contact
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <FontAwesomeIcon icon={faPhone} className="text-[#032e92] shrink-0 text-sm" />
                    <a
                      href="tel:+919990243143"
                      className="text-sm sm:text-base text-gray-800 hover:text-[#032e92] font-semibold transition-colors"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Official Email Addresses
                  </span>
                  <div className="space-y-2 mt-1.5">
                    <div className="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[#032e92]" />
                        <span className="font-semibold text-gray-800">{COMPANY_INFO.email}</span>
                        <span className="text-[10px] text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md font-semibold">General / Advisory</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(COMPANY_INFO.email, 'email')}
                        className="text-xs text-gray-500 hover:text-[#032e92] p-1 cursor-pointer"
                        title="Copy email"
                      >
                        <FontAwesomeIcon icon={copiedKey === 'email' ? faCheck : faCopy} className={copiedKey === 'email' ? 'text-emerald-600' : ''} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
                        <span className="font-semibold text-gray-800">{COMPANY_INFO.complianceEmail}</span>
                        <span className="text-[10px] text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded-md font-semibold">Compliance</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(COMPANY_INFO.complianceEmail, 'compEmail')}
                        className="text-xs text-gray-500 hover:text-[#032e92] p-1 cursor-pointer"
                        title="Copy email"
                      >
                        <FontAwesomeIcon icon={copiedKey === 'compEmail' ? faCheck : faCopy} className={copiedKey === 'compEmail' ? 'text-emerald-600' : ''} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Official Web Portal
                  </span>
                  <a
                    href={COMPANY_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#032e92] font-semibold hover:underline mt-1"
                  >
                    <span>{COMPANY_INFO.website}</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 2: Our Registrations
        ========================================================================= */}
        <section id="registrations" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
              <FontAwesomeIcon icon={faCertificate} className="text-base" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] tracking-tight">
                Our Regulatory Registrations
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Official regulatory standing, registration numbers, and validity periods.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REGISTRATIONS.map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header & Status */}
                  {/* <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {reg.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                      {reg.status}
                    </span>
                  </div> */}

                  <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-1">
                    {reg.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 font-medium">
                    Regulated / Monitored by: <span className="text-gray-700 font-semibold">{reg.regBody}</span>
                  </p>

                  {/* Main Identifier Box */}
                  <div className="bg-[#f8fafd] border border-blue-100/80 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {reg.regNumberLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(reg.regNumber, reg.id)}
                        className="text-xs text-[#032e92] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <FontAwesomeIcon icon={copiedKey === reg.id ? faCheck : faCopy} />
                        <span>{copiedKey === reg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-[#032e92] tracking-wide mt-1">
                      {reg.regNumber}
                    </div>

                    {/* Validity Dates */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200/60 text-xs">
                      <div>
                        <span className="text-gray-400 font-medium block">Validity From</span>
                        <span className="font-bold text-gray-800">{reg.validityFrom}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block">Validity To</span>
                        <span className="font-bold text-gray-800">{reg.validityTo}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {reg.description}
                  </p>

                  {/* Key Highlights */}
                  <ul className="space-y-1.5 mb-6 text-xs text-gray-600">
                    {reg.keyHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 mt-0.5 shrink-0 text-[11px]" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verification Action Link */}
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={reg.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#032e92] bg-blue-50 hover:bg-[#032e92] hover:text-white transition-all border border-blue-100"
                  >
                    <span>{reg.verificationLabel}</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[11px]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* =========================================================================
            SECTION 3: Empanelled Mutual Fund AMCs (32 AMCs Table)
        ========================================================================= */}
        <section id="amc-table" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
                  <FontAwesomeIcon icon={faBuildingColumns} className="text-base" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] tracking-tight">
                  Our Empanelled Mutual Fund AMCs
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mt-1 leading-relaxed">
                We are associated with leading SEBI-registered Asset Management Companies (AMCs), providing access to a wide range of mutual fund investment opportunities.
              </p>
            </div>

            {/* Total Count Badge */}
            <div className="shrink-0 bg-blue-50 text-[#032e92] px-4 py-2 rounded-xl border border-blue-100 text-xs font-bold self-start md:self-auto">
              Total Empanelled AMCs: {EMPANELLED_AMCS.length}
            </div>
          </div>

          {/* Search & Sort Controls Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AMC name or SEBI registration number (e.g. HDFC, MF/044)..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#f8fafd] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  title="Clear search"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">Sort:</span>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? 'default' : 'asc')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#f8fafd] hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={sortOrder === 'desc' ? faArrowUpZA : faArrowDownAZ}
                  className="text-[#032e92]"
                />
                <span>
                  {sortOrder === 'asc' ? 'Name (A → Z)' : sortOrder === 'desc' ? 'Name (Z → A)' : 'Default (S.No)'}
                </span>
              </button>
            </div>
          </div>

          {/* Results Summary if Filtering */}
          {searchQuery && (
            <div className="text-xs text-gray-500 mb-3 px-1 flex items-center justify-between">
              <span>
                Showing <strong className="text-gray-800">{filteredAmcs.length}</strong> matching AMC(s) for &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#032e92] hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* AMC Structured Table */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#032e92] to-[#021d63] text-white text-xs font-bold uppercase tracking-wider">
                    <th scope="col" className="py-4 px-4 sm:px-6 w-16 text-center">
                      S. No.
                    </th>
                    <th scope="col" className="py-4 px-4 sm:px-6">
                      Name of AMC
                    </th>
                    <th scope="col" className="py-4 px-4 sm:px-6">
                      SEBI Registration Number
                    </th>
                    <th scope="col" className="py-4 px-4 sm:px-6 text-center">
                      Status / Verification
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                  {filteredAmcs.length > 0 ? (
                    filteredAmcs.map((amc, index) => (
                      <tr
                        key={amc.sno}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        {/* Serial Number */}
                        <td className="py-3.5 px-4 sm:px-6 text-center font-bold text-gray-400">
                          {index + 1}
                        </td>

                        {/* AMC Name */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-bold text-gray-900 text-sm sm:text-[15px]">
                            {amc.name}
                          </div>
                          {amc.formerName && (
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              {amc.formerName}
                            </div>
                          )}
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {amc.amcEntity}
                          </div>
                        </td>

                        {/* SEBI Registration Number */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="inline-flex items-center gap-2 bg-[#f8fafd] border border-blue-100/90 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-[#032e92]">
                            <span>{amc.sebiReg}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(amc.sebiReg, `sebi-${amc.sno}`)}
                              className="text-gray-400 hover:text-[#032e92] cursor-pointer"
                              title="Copy SEBI registration number"
                            >
                              <FontAwesomeIcon
                                icon={copiedKey === `sebi-${amc.sno}` ? faCheck : faCopy}
                                className={copiedKey === `sebi-${amc.sno}` ? 'text-emerald-600' : ''}
                              />
                            </button>
                          </div>
                        </td>

                        {/* Verification Status */}
                        <td className="py-3.5 px-4 sm:px-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-[11px] text-emerald-600" />
                            <span>SEBI Registered</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-2xl text-gray-300 mb-2 block mx-auto" />
                        <p className="text-sm font-semibold text-gray-700">No matching Asset Management Company found</p>
                        <p className="text-xs text-gray-400 mt-1">Please try modifying your search query.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Verification Note */}
            <div className="bg-[#f8fafd] p-4 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92]" />
                <span>
                  All SEBI registration numbers verified against official SEBI and AMFI mutual fund directories.
                </span>
              </div>
              <a
                href="https://www.sebi.gov.in/intermediaries.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#032e92] font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Verify on SEBI Website</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
              </a>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 4: Grievance Redressal
        ========================================================================= */}
        <section id="grievance" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
              <FontAwesomeIcon icon={faShieldHalved} className="text-base" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] tracking-tight">
                Grievance Redressal Mechanism
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Transparent multi-tier escalation pathway and official regulatory complaint portals.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            {/* Officer Details Card Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-[#032e92] to-[#021d63] text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200 bg-white/10 px-2.5 py-1 rounded-md inline-block mb-2">
                    Designated Regulatory Authority
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {GRIEVANCE_REDRESSAL.officerName}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                    {GRIEVANCE_REDRESSAL.designation} • {GRIEVANCE_REDRESSAL.firmName}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-xs text-blue-100 space-y-1">
                  <div>
                    <span className="font-semibold text-white">Resolution Target:</span> {GRIEVANCE_REDRESSAL.timeline}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Working Hours:</span> {GRIEVANCE_REDRESSAL.officeHours}
                  </div>
                </div>
              </div>

              {/* Direct Contacts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15 text-xs">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-blue-200 block text-[10px] uppercase font-bold">Email (Grievances)</span>
                  <a href={`mailto:${GRIEVANCE_REDRESSAL.email}`} className="font-semibold text-white hover:underline mt-0.5 block">
                    {GRIEVANCE_REDRESSAL.email}
                  </a>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-blue-200 block text-[10px] uppercase font-bold">Telephone Helpline</span>
                  <a href="tel:+919990243143" className="font-semibold text-white hover:underline mt-0.5 block">
                    {GRIEVANCE_REDRESSAL.phone}
                  </a>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-blue-200 block text-[10px] uppercase font-bold">Postal Address</span>
                  <span className="font-medium text-white line-clamp-2 mt-0.5 block">
                    {GRIEVANCE_REDRESSAL.address}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Level Step-by-Step Escalation Hierarchy */}
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <h4 className="text-sm sm:text-base font-bold text-[#0a192f] mb-4">
                Escalation Hierarchy for Investor Grievances
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GRIEVANCE_REDRESSAL.escalationSteps.map((step, idx) => (
                  <div key={idx} className="bg-[#f8fafd] p-4 sm:p-5 rounded-2xl border border-gray-100 relative">
                    <span className="text-[11px] font-bold text-[#032e92] bg-blue-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                      {step.level}
                    </span>
                    <h5 className="text-sm font-bold text-gray-900 mb-1.5">{step.title}</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Portals (SCORES & SMART ODR) */}
            <div className="p-6 sm:p-8 bg-gray-50/70">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Official Regulatory Investor Grievance Portals
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {GRIEVANCE_REDRESSAL.externalPortals.map((portal, idx) => (
                  <a
                    key={idx}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-xl border border-gray-200/80 hover:border-[#032e92] hover:shadow-xs transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-[#032e92] transition-colors">
                          {portal.name}
                        </span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] text-gray-400 group-hover:text-[#032e92]" />
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{portal.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================================
            SECTION 5: Important Regulatory Disclaimer
        ========================================================================= */}
        <section id="disclaimer" className="scroll-mt-28">
          <div className="bg-amber-50/50 rounded-2xl sm:rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-base" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Important Regulatory &amp; Statutory Disclaimer
                </h2>
                <p className="text-xs text-gray-600">
                  Please read the following statutory information carefully before relying on any website content or investment products.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-[13px] text-gray-700 leading-relaxed divide-y divide-amber-200/60 pt-2">
              <p className="pt-2">
                <strong>1. Mutual Fund &amp; SIF Distribution Status:</strong> {STATUTORY_DISCLAIMER.mfdDisclaimer}
              </p>
              <p className="pt-3">
                <strong>2. Distinction Between Distribution &amp; Investment Advice:</strong> {STATUTORY_DISCLAIMER.noAdvisoryDisclaimer}
              </p>
              <p className="pt-3">
                <strong>3. Market Risk Warning:</strong> {STATUTORY_DISCLAIMER.marketRiskDisclaimer}
              </p>
              <p className="pt-3">
                <strong>4. No Guaranteed Returns:</strong> {STATUTORY_DISCLAIMER.noGuaranteeDisclaimer}
              </p>
              <p className="pt-3">
                <strong>5. Commission Disclosure:</strong> {STATUTORY_DISCLAIMER.commissionDisclosure}
              </p>
              <p className="pt-3">
                <strong>6. Investor Discretion &amp; Suitability:</strong> {STATUTORY_DISCLAIMER.suitabilityDisclaimer}
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
