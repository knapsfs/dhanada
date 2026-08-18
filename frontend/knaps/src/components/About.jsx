import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faShieldAlt, faUserTie, faCoins, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const features = [
  { icon: faChartLine, title: 'Data-Driven Insights', description: 'Advanced analytics for better portfolio performance.' },
  { icon: faShieldAlt, title: 'Secure Investments', description: 'Your wealth is protected with bank-level security.' },
  { icon: faUserTie, title: 'Expert Advisors', description: 'Dedicated relationship managers for your financial goals.' },
  { icon: faCoins, title: 'Wealth Maximization', description: 'Strategies focused on long-term compound growth.' },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side - Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[600px] bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional Financial Advisor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032e92]/80 via-transparent to-transparent"></div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-[#c10000]">15+</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Years Experience</h4>
                    <p className="text-sm text-gray-500">In Wealth Management</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -z-10 top-1/2 -right-8 w-64 h-64 bg-[#eef5ff] rounded-full blur-3xl opacity-60"></div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-[#fce8e8] text-[#c10000] font-semibold text-sm mb-6 uppercase tracking-wider">
              About Knaps
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-6 leading-tight">
              Helping You Make <span className="text-[#032e92]">Better</span> Financial Decisions
            </h2>

            <p className="text-lg text-[#6b7280] mb-10 leading-relaxed">
              We believe that true wealth management goes beyond just investing. It's about understanding your life goals, risk appetite, and providing a holistic approach to secure your financial future.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#eef5ff] flex items-center justify-center">
                    <FontAwesomeIcon icon={feature.icon} className="text-[#032e92] text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-semibold bg-[#032e92] text-white shadow-lg shadow-[#032e92]/20 flex items-center gap-2 hover:bg-[#021d63] transition-colors btn-ripple"
            >
              Learn More About Us
              <FontAwesomeIcon icon={faArrowRight} />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
