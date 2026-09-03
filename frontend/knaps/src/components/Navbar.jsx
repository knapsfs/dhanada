import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faXmark, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/knaps-logo.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'SIF',
    href: 'https://dev.knaps.app/sif',
    dropdown: [
      { label: 'All Funds', href: 'https://dev.knaps.app/funds' },
      { label: 'Compare', href: 'https://dev.knaps.app/compare' },
    ],
  },
  { label: 'Mutual Fund', href: '/funds' },
  { label: 'PMS', href: '/#pms' },
  { label: 'AIF', href: '/#aif' },
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: 'NPS', href: '/services#nps' },
      { label: 'Small Savings Scheme', href: '/services#sss' },
      { label: 'Life Insurance', href: '/services#life-insurance' },
      { label: 'Health Insurance', href: '/services#health-insurance' },
      { label: 'General Insurance', href: '/services#general-insurance' },
      { label: 'Child Marriage Planning', href: '/services#child-planning' },
      { label: 'Retirement Planning', href: '/services#retirement' },
    ],
  },
  {
    label: 'Calculators',
    href: '/calculators/sip',
    dropdown: [
      { label: 'SIP Calculator', href: '/calculators/sip' },
      { label: 'Step Up SIP', href: '/calculators/step-up-sip' },
      { label: 'SWP Calculator', href: '/calculators/swp' },
      { label: 'Lumpsum Calculator', href: '/calculators/lumpsum' },
      { label: 'Retirement Calculator', href: '/calculators/retirement' },
      { label: 'Future Value', href: '/calculators/future-value' },
    ],
  },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg shadow-blue-900/5' : 'bg-white shadow-lg shadow-blue-900/5'
        }`}
    >
      {/* Top Banner */}
      <div className="bg-[#000080] py-1.5 w-full overflow-hidden flex">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mx-6">
            <FontAwesomeIcon icon={faChartLine} className="text-[#a3e635]" />
            Smart Investing, Confident Living - AMFI Registered Mutual Fund Distributor
          </span>
          <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mx-6">
            <FontAwesomeIcon icon={faChartLine} className="text-[#a3e635]" />
            Grow Your Wealth with Expert Guidance
          </span>
          <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mx-6">
            <FontAwesomeIcon icon={faChartLine} className="text-[#a3e635]" />
            Over 500+ Cr AUM Managed
          </span>
        </div>
        <div className="flex whitespace-nowrap animate-marquee2" aria-hidden="true">
          <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mx-6">
            <FontAwesomeIcon icon={faChartLine} className="text-[#a3e635]" />
            Smart Investing, Confident Living - AMFI Registered Mutual Fund Distributor
          </span>
          <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mx-6">
            <FontAwesomeIcon icon={faChartLine} className="text-[#a3e635]" />
            Grow Your Wealth with Expert Guidance
          </span>
          <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mx-6">
            <FontAwesomeIcon icon={faChartLine} className="text-[#a3e635]" />
            Over 500+ Cr AUM Managed
          </span>
        </div>
      </div>

      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="KNAPS Financial Services"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.href.startsWith('http') ? (
                  <a
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[14px] 2xl:text-[15px] font-medium transition-all duration-300 group ${activeDropdown === link.label
                        ? 'text-[#032e92] bg-[#eef5ff]'
                        : 'text-gray-700 hover:text-[#032e92] hover:bg-[#eef5ff]/60'
                      }`}
                  >
                    {link.label}
                    {link.dropdown && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-[10px] transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180 text-[#032e92]' : ''
                          }`}
                      />
                    )}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[14px] 2xl:text-[15px] font-medium transition-all duration-300 group ${activeDropdown === link.label || location.pathname === link.href
                        ? 'text-[#032e92] bg-[#eef5ff]'
                        : 'text-gray-700 hover:text-[#032e92] hover:bg-[#eef5ff]/60'
                      }`}
                  >
                    {link.label}
                    {link.dropdown && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-[10px] transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180 text-[#032e92]' : ''
                          }`}
                      />
                    )}
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#c10000] transform origin-left scale-x-0 transition-transform duration-300 ease-out ${activeDropdown === link.label || location.pathname === link.href
                          ? 'scale-x-100'
                          : 'group-hover:scale-x-100'
                        }`}
                    ></span>
                  </Link>
                )}

                {/* Desktop Dropdown */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 py-3 overflow-hidden origin-top-left"
                      >
                        {link.dropdown.map((item) => (
                          item.href.startsWith('http') ? (
                            <a
                              key={item.label}
                              href={item.href}
                              className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium hover:pl-6 duration-300"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium hover:pl-6 duration-300"
                            >
                              {item.label}
                            </Link>
                          )
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          {/* Right CTA */}
          <div
            className="hidden xl:flex items-center relative"
            onMouseEnter={() => setActiveDropdown('LoginBtn')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2"
            >
              Login
              <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform duration-300 ${activeDropdown === 'LoginBtn' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'LoginBtn' && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 py-3 overflow-hidden origin-top-right"
                >
                  <Link to="/#login-investor" className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium">Investor Login</Link>
                  <Link to="/#login-admin" className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium">Admin Login</Link>
                  <Link to="/#login-employee" className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium">Employee Login</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-[#eef5ff] text-[#032e92] z-50 transition-transform hover:scale-105"
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="text-lg" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden bg-white rounded-3xl mt-4 shadow-2xl border border-gray-100 overflow-hidden absolute left-4 right-4"
            >
              <div className="p-5 space-y-2 max-h-[80vh] overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.dropdown ? (
                      <div className="space-y-1">
                        <div className="px-4 py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">
                          {link.label}
                        </div>
                        {link.dropdown.map((item) => (
                          item.href.startsWith('http') ? (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-4 py-2.5 ml-4 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link
                              key={item.label}
                              to={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-4 py-2.5 ml-4 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors"
                            >
                              {item.label}
                            </Link>
                          )
                        ))}
                      </div>
                    ) : (
                      link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 rounded-xl text-[15px] font-medium text-gray-800 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 rounded-xl text-[15px] font-medium text-gray-800 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors"
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                  </div>
                ))}
                <div className="pt-5 mt-2 border-t border-gray-100 flex flex-col gap-2">
                  <div className="px-4 py-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Access Portal
                  </div>
                  <Link
                    to="/#login-investor"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 ml-4 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-[#eef5ff] hover:text-[#032e92]"
                  >
                    Investor Login
                  </Link>
                  <Link
                    to="/#login-admin"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 ml-4 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-[#eef5ff] hover:text-[#032e92]"
                  >
                    Admin Login
                  </Link>
                  <Link
                    to="/#login-employee"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 ml-4 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-[#eef5ff] hover:text-[#032e92]"
                  >
                    Employee Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}