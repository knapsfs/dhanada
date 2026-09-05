import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faChartLine, faArrowRight, faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/knaps-logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] pt-24 pb-8 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#032e92] via-[#c10000] to-[#032e92]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">

          {/* Company Info - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center group mb-6 inline-flex">
              <img src={logo} alt="Knaps" className="h-14 md:h-14 w-auto group-hover:scale-105 transition-all duration-300 brightness-0 invert opacity-90 hover:opacity-100" />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 pr-4">
              Premium financial institution dedicated to building, protecting, and growing wealth for individuals and businesses through expert guidance and personalized strategies.
            </p>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-[#032e92] hover:text-white hover:border-[#032e92] transition-all duration-300">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-[#032e92] hover:text-white hover:border-[#032e92] transition-all duration-300">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-[#c10000] hover:text-white hover:border-[#c10000] transition-all duration-300">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-all duration-300">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6">Products</h4>
            <ul className="space-y-4">
              <li><Link to="/sif" className="text-gray-400 hover:text-white text-sm transition-colors">SIF</Link></li>
              <li><Link to="/#mf" className="text-gray-400 hover:text-white text-sm transition-colors">Mutual Fund</Link></li>
              <li><Link to="/#pms" className="text-gray-400 hover:text-white text-sm transition-colors">PMS</Link></li>
              <li><Link to="/sif" className="text-gray-400 hover:text-white text-sm transition-colors">AIF</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          {/* <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link to="/#about" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/#blogs" className="text-gray-400 hover:text-white text-sm transition-colors">Blogs</Link></li>
              <li><Link to="/#contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div> */}

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="https://www.sebi.gov.in/filings/mutual-funds.html" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">SID/SAI/KIM</Link></li>
              <li><Link to="https://www.amfiindia.com/uploads/Revised_Codeof_Conductfor_Mutual_Fund_Distributors_April2022_57d91fe1c4.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Code of Conduct</Link></li>
              <li><Link to="https://www.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">SEBI Circulars</Link></li>
              <li><Link to="https://www.amfiindia.com/investor/knowledge-center-info?zoneName=riskInMutualFunds" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">AMFI Risk Factors</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#99a1af] mt-1" />
                <span className="text-gray-400 text-sm">G-6, Vardhman Plaza, LSC, Mayur Vihar Phase - 2, New Delhi - 110091</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-[#99a1af]" />
                <a href="tel:+919990243143" className="text-gray-400 hover:text-white text-sm transition-colors">(+91) 9990243143</a>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#99a1af]" />
                <a href="mailto:connect@knaps.in" className="text-gray-400 hover:text-white text-sm transition-colors">connect@knaps.in</a>
              </li>
            </ul>

            {/* <h4 className="text-white font-bold mb-6">Newsletter</h4> */}
            {/* <p className="text-gray-400 text-sm mb-4">Subscribe to our weekly insights and market updates.</p> */}
            {/* <form className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#032e92] transition-colors"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#032e92] text-white flex items-center justify-center hover:bg-[#021d63] transition-colors"
              >
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </button>
            </form> */}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {currentYear} Knaps Wealth Management. All rights reserved. SEBI Registered.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/#terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/#disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
