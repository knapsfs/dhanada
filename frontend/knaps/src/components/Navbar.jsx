import { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web/build/player/lottie_light';
import giftBoxAnimationData from '../assets/Gift Box White.json';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/knaps-logo.png';
import { useLeadModal } from '../context/LeadModalContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'SIF',
    href: '/sif',
  },
  { label: 'Mutual Fund', href: '/funds' },
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: 'National Pension System (NPS)', href: '/services/nps' },
      { label: 'Small Savings Scheme', href: '/services/small-savings-schemes' },
      { label: 'Life Insurance', href: '/services/life-insurance' },
      { label: 'Health Insurance', href: '/services/health-insurance' },
      { label: 'General Insurance', href: '/services/general-insurance' },
      { label: 'ELSS Funds', href: '/services/elss' },
      { label: 'Fixed Deposits', href: '/services/fixed-deposits' },
      { label: 'Recurring Deposits', href: '/services/recurring-deposits' },
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
      { label: 'SIP + Lump Sum', href: '/calculators/sip-lumpsum' },
      { label: 'Retirement Calculator', href: '/calculators/retirement' },
      { label: 'Goal Based Calculator', href: '/calculators/future-value' },
    ],
  },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const location = useLocation();
  const { openLeadModal } = useLeadModal();

  const mobileGiftRef = useRef(null);
  const mobileGiftAnim = useRef(null);

  useEffect(() => {
    if (!mobileGiftRef.current) return;
    mobileGiftAnim.current = lottie.loadAnimation({
      container: mobileGiftRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: giftBoxAnimationData,
    });
    mobileGiftAnim.current.goToAndStop(0, true);

    const playWobble = () => {
      if (mobileGiftAnim.current) {
        mobileGiftAnim.current.playSegments([0, 35], true);
      }
    };
    const interval = setInterval(playWobble, 3400);

    const handleReset = () => {
      if (mobileGiftAnim.current) {
        mobileGiftAnim.current.goToAndStop(0, true);
      }
    };
    window.addEventListener('mystery-box-closed', handleReset);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mystery-box-closed', handleReset);
      mobileGiftAnim.current?.destroy();
    };
  }, []);

  const handleOpenGiftFromNavbar = () => {
    setMobileOpen(false);
    if (mobileGiftAnim.current) {
      mobileGiftAnim.current.playSegments([35, 55], true);
    }
    window.dispatchEvent(new CustomEvent('open-mystery-box'));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile dropdowns when mobile menu closes or location changes
  useEffect(() => {
    if (!mobileOpen) {
      setOpenMobileDropdown(null);
      setMobileLoginOpen(false);
    }
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
    setMobileLoginOpen(false);
  }, [location.pathname]);

  const toggleMobileDropdown = (label) => {
    setOpenMobileDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg shadow-blue-900/5' : 'bg-white shadow-lg shadow-blue-900/5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={logo}
                alt="KNAPS Logo"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
              >
                {link.href.startsWith('http') ? (
                  <a
                    href={link.href}
                    className="relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[14px] 2xl:text-[15px] font-medium text-gray-700 hover:text-[#032e92] hover:bg-[#eef5ff]/60 transition-all duration-300 group"
                  >
                    {link.label}
                    {link.dropdown && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-[10px] transition-transform duration-300 ${
                          activeDropdown === link.label ? 'rotate-180 text-[#032e92]' : ''
                        }`}
                      />
                    )}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[14px] 2xl:text-[15px] font-medium transition-all duration-300 group ${
                      activeDropdown === link.label || location.pathname === link.href
                        ? 'text-[#032e92] bg-[#eef5ff]'
                        : 'text-gray-700 hover:text-[#032e92] hover:bg-[#eef5ff]/60'
                    }`}
                  >
                    {link.label}
                    {link.dropdown && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-[10px] transition-transform duration-300 ${
                          activeDropdown === link.label ? 'rotate-180 text-[#032e92]' : ''
                        }`}
                      />
                    )}
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#c10000] transform origin-left scale-x-0 transition-transform duration-300 ease-out ${
                        activeDropdown === link.label || location.pathname === link.href
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

          {/* Right CTAs */}
          <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3">
            {/* Invest Now Button */}
            <button
              type="button"
              onClick={() => openLeadModal('Navbar Invest Now')}
              className="btn-ripple px-5 py-2.5 2xl:px-6 2xl:py-3 rounded-xl text-[14px] 2xl:text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Invest Now
            </button>

            {/* Login Button */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('LoginBtn')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="btn-ripple px-5 py-2.5 2xl:px-6 2xl:py-3 rounded-xl text-[14px] 2xl:text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 cursor-pointer"
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
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 py-3 overflow-hidden origin-top-right z-50"
                  >
                    <Link to="/#login-investor" className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium">Investor Login</Link>
                    <Link to="/#login-admin" className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium">Admin Login</Link>
                    <Link to="/#login-employee" className="block px-5 py-2.5 text-[14px] text-gray-600 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors font-medium">Employee Login</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Right Controls: Gift Box & Toggle */}
          <div className="xl:hidden flex items-center gap-3 sm:gap-4 relative z-50">
            {/* Gift Box Mobile Trigger (shifted left with bottom breathing room) */}
            <button
              type="button"
              onClick={handleOpenGiftFromNavbar}
              aria-label="Open financial toolkit mystery box"
              className="w-11 h-11 flex items-center justify-center relative transition-transform hover:scale-110 active:scale-90 cursor-pointer select-none shrink-0 mr-1.5"
            >
              <div
                ref={mobileGiftRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[57%] w-[114px] h-[68px] flex items-center justify-center filter drop-shadow-[0_3px_8px_rgba(0,0,0,0.15)] pointer-events-none"
              />
            </button>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#eef5ff] text-[#032e92] relative transition-transform hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto select-none shrink-0"
              aria-label="Toggle navigation menu"
            >
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="text-lg pointer-events-none" />
            </button>
          </div>
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
              <div className="p-4 sm:p-5 space-y-1 max-h-[75vh] overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.dropdown ? (
                      <div>
                        {/* Collapsible Dropdown Header Button */}
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(link.label)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all cursor-pointer ${
                            openMobileDropdown === link.label
                              ? 'bg-[#eef5ff] text-[#032e92]'
                              : 'text-gray-800 hover:bg-gray-50'
                          }`}
                        >
                          <span>{link.label}</span>
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`text-xs transition-transform duration-300 ${
                              openMobileDropdown === link.label ? 'rotate-180 text-[#032e92]' : 'text-gray-400'
                            }`}
                          />
                        </button>

                        {/* Collapsible Dropdown Items */}
                        <AnimatePresence>
                          {openMobileDropdown === link.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden bg-[#f8fbff] rounded-2xl my-1 p-2 border border-blue-50/80 space-y-0.5"
                            >
                              {link.dropdown.map((item) => (
                                item.href.startsWith('http') ? (
                                  <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3.5 py-2 text-[14px] font-medium text-gray-600 hover:bg-white hover:text-[#032e92] hover:shadow-xs rounded-xl transition-all"
                                  >
                                    {item.label}
                                  </a>
                                ) : (
                                  <Link
                                    key={item.label}
                                    to={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-3.5 py-2 text-[14px] font-medium rounded-xl transition-all ${
                                      location.pathname === item.href
                                        ? 'bg-white text-[#032e92] font-semibold shadow-xs'
                                        : 'text-gray-600 hover:bg-white hover:text-[#032e92]'
                                    }`}
                                  >
                                    {item.label}
                                  </Link>
                                )
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 rounded-2xl text-[15px] font-semibold text-gray-800 hover:bg-[#eef5ff] hover:text-[#032e92] transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-4 py-3 rounded-2xl text-[15px] font-semibold transition-colors ${
                            location.pathname === link.href
                              ? 'text-[#032e92] bg-[#eef5ff]'
                              : 'text-gray-800 hover:bg-[#eef5ff] hover:text-[#032e92]'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                  </div>
                ))}

                {/* Mobile Action Buttons */}
                <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      openLeadModal('Navbar Mobile: Invest Now');
                    }}
                    className="w-full py-3.5 px-5 rounded-2xl text-[15px] font-bold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/20 flex items-center justify-center transition-all cursor-pointer hover:shadow-xl active:scale-[0.99]"
                  >
                    Invest Now
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileLoginOpen(!mobileLoginOpen)}
                    className="w-full py-3.5 px-5 rounded-2xl text-[15px] font-bold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:shadow-xl active:scale-[0.99]"
                  >
                    <span>Login</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-xs transition-transform duration-300 ${
                        mobileLoginOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileLoginOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-[#f8fbff] rounded-2xl mt-2 p-2 border border-blue-100/80 space-y-1"
                      >
                        <Link
                          to="/#login-investor"
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-white hover:text-[#032e92] hover:shadow-xs transition-all"
                        >
                          Investor Login
                        </Link>
                        <Link
                          to="/#login-admin"
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-white hover:text-[#032e92] hover:shadow-xs transition-all"
                        >
                          Admin Login
                        </Link>
                        <Link
                          to="/#login-employee"
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-white hover:text-[#032e92] hover:shadow-xs transition-all"
                        >
                          Employee Login
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
