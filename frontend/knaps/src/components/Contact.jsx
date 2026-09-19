import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-[#eef5ff] text-[#032e92] font-semibold text-sm mb-4 uppercase tracking-wider"
          >
            Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a]"
          >
            Connect With Our <span className="text-[#032e92]">Experts</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* Left - Contact Form (Takes 3 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden"
          >
            {/* Form decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#eef5ff] to-transparent rounded-bl-full -z-10"></div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Consultation</h3>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Interest</label>
                  <select className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none text-gray-700 appearance-none">
                    <option value="" disabled selected>Select an option</option>
                    <option value="mutual-funds">Mutual Funds</option>
                    <option value="pms">Portfolio Management (PMS)</option>
                    <option value="aif">Alternative Investment Funds (AIF)</option>
                    <option value="insurance">Insurance Planning</option>
                    <option value="retirement">Retirement Planning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea rows="4" placeholder="How can we help you?" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none resize-none"></textarea>
              </div>

              <button type="button" className="w-full py-4 rounded-xl font-bold bg-[#032e92] text-white hover:bg-[#021d63] transition-colors shadow-lg shadow-[#032e92]/30 btn-ripple">
                Request Consultation
              </button>
            </form>
          </motion.div>

          {/* Right - Office Info (Takes 2 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Info Card */}
            <div className="bg-[#032e92] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full z-0"></div>

              <h3 className="text-2xl font-bold mb-8 relative z-10">Our Office</h3>

              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Headquarters</h5>
                    <p className="text-white leading-relaxed">
                      14th Floor, Financial District Tower,<br />
                      BKC, Mumbai, Maharashtra 400051
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faPhoneAlt} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Phone</h5>
                    <p className="text-white">+91 (22) 1234 5678</p>
                    <p className="text-white">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Email</h5>
                    <p className="text-white">contact@Knaps.com</p>
                    <p className="text-white">support@Knaps.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Working Hours</h5>
                    <p className="text-white">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-white">Sat: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-3xl h-64 overflow-hidden border border-gray-300 relative group">
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Interactive Map Integration</p>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.979148443319!2d72.8559074!3d19.0743606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e317c37617%3A0xc31920cd704953c8!2sBandra%20Kurla%20Complex%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) contrast(1.2)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              ></iframe>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
