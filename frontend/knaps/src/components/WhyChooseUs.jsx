import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faChartLine, faShieldHalved, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header matching reference image */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-6 tracking-wide"
          >
            Why Choose Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Why <span className="text-[#032e92] font-bold">Knaps</span> is The Right Choice for You
          </motion.h2>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left/Middle Columns Container (Takes up 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Top Row of small cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#f8f9fc] rounded-3xl p-8 flex flex-col h-full border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 mb-8">
                  <FontAwesomeIcon icon={faUserCheck} className="text-lg" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Client Centric</h3>
                {/* <p className="text-sm font-semibold text-[#032e92] mb-3">Your requirements are the top most priority</p> */}
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  We put your needs first, delivering personalized financial solutions tailored to your goals, challenges, and long-term success.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#f8f9fc] rounded-3xl p-8 flex flex-col h-full border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 mb-8">
                  <FontAwesomeIcon icon={faChartLine} className="text-lg" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Business Continuity</h3>
                {/* <p className="text-sm font-semibold text-[#032e92] mb-3">27+ years of continuous servicing</p> */}
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Since 1997, we've been delivering trusted financial solutions, helping clients navigate changing markets with confidence.
                </p>
              </motion.div>

            </div>

            {/* Bottom Row Wide Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#f8f9fc] rounded-3xl p-8 flex flex-col h-full border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 mb-8">
                <FontAwesomeIcon icon={faShieldHalved} className="text-lg" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Trust</h3>
              {/* <p className="text-sm font-semibold text-[#032e92] mb-3">Clients spanning 2 decades, serving 3 generation of clients</p> */}
              <p className="text-gray-500 text-[15px] leading-relaxed">
                We build lasting relationships by helping families protect and grow their wealth across generations.
              </p>
            </motion.div>

          </div>

          {/* Right Column Tall Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1 bg-[#032e92] rounded-3xl p-8 md:p-10 flex flex-col h-full relative overflow-hidden group"
          >
            {/* Subtle glow background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white mb-10 relative z-10">
              <FontAwesomeIcon icon={faLock} className="text-lg" />
            </div>

            <h3 className="text-3xl font-semibold text-white mb-3 tracking-tight relative z-10">Privacy</h3>
            {/* <p className="text-[15px] font-semibold text-blue-200 mb-6 relative z-10">We keep your financial data secure</p> */}

            <p className="text-white/80 text-[15px] leading-relaxed mb-10 relative z-10">
              We protect your financial information and keep every interaction secure, private, and confidential.
            </p>

            <button className="mt-auto relative z-10 bg-[#c10000] text-white py-4 px-8 rounded-full font-bold w-max hover:bg-red-700 transition-colors duration-300 flex items-center gap-3 group-hover:-translate-y-1">
              Book Consultation
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
