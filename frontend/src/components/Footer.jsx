import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import knapsLogo from '../assets/knaps-logo.png'
import {
  faChartLine, faArrowRight, faCircleCheck
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube
} from '@fortawesome/free-brands-svg-icons'

const footerLinks = {
  'Quick Links': [
    { label: 'Home', href: '/' },
    { label: 'Funds', href: '/funds' },
    { label: 'Compare', href: '/compare' },
    { label: 'Blogs', href: '/#blog' },
  ],
  'Calculators': [
    { label: 'SIP Calculator', href: '/calculators/sip' },
    { label: 'Step Up SIP', href: '/calculators/step-up-sip' },
    { label: 'SWP Calculator', href: '/calculators/swp' },
    { label: 'Lumpsum Calculator', href: '/calculators/lumpsum' },
    { label: 'Retirement Calculator', href: '/calculators/retirement' },
    { label: 'Future Value', href: '/calculators/future-value' },
  ]
}

const socials = [
  { icon: faFacebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: faTwitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: faInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: faLinkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  { icon: faYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
]

export default function Footer() {
  return (
    <footer className="bg-[#021c63] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <img src={knapsLogo} alt="Knaps" className="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-90" />
            </div>

            <p className="text-blue-200 text-sm font-medium leading-relaxed mb-6">
              A dedicated platform for exploring Specialized Investment Funds, with clear scheme information, detailed comparisons, and investor-focused insights to help you make informed decisions.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['AMFI Registered : ARN-367144'].map(cert => (
                <span key={cert} className="flex items-center gap-1 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs text-blue-200 font-medium">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-green-400 text-[10px]" />
                  {cert}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href}
                  className={`w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-blue-200 hover:text-white transition-all duration-200 ${s.color}`}
                  aria-label={s.label}>
                  <FontAwesomeIcon icon={s.icon} className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-5 text-sm">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-blue-300 text-sm font-medium hover:text-white transition-colors flex items-center gap-1.5 group">
                      <FontAwesomeIcon icon={faArrowRight} className="text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-4 mt-12 pt-10 border-t border-white/10">
          {[
            { label: 'Call Us', value: '+91-9810190934', sub: 'Toll Free, 9AM-9PM', link: 'tel:+919810190934' },
            { label: 'Email', value: 'connect@knaps.in', sub: 'Response within 2 hours', link: 'mailto:connect@knaps.in' },
            { label: 'Office', value: 'DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase 1, East Delhi, Delhi-110091', sub: 'Pan India presence', link: 'https://maps.google.com/?q=DG-206A,+DLF+Galleria,+Plot+No+1B,+Mayur+Vihar+Phase+1,+East+Delhi,+Delhi-110091' },
          ].map(item => (
            <a key={item.label} href={item.link} target={item.label === 'Office' ? "_blank" : "_self"} rel="noreferrer" className="block bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
              <p className="text-blue-300 text-xs font-semibold mb-1">{item.label}</p>
              <p className="text-white font-bold text-sm">{item.value}</p>
              <p className="text-blue-400 text-xs font-medium mt-0.5">{item.sub}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-blue-300 text-sm font-medium">
              © 2026 SIFinvest. All rights reserved. AMFI Registered : ARN-367144
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Cookie Policy'].map(link => (
                <a key={link} href="#" className="text-blue-400 hover:text-white text-xs font-medium transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <p className="text-blue-500 text-xs font-medium mt-3 leading-relaxed">
            Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  )
}
