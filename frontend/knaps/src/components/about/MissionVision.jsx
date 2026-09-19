import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faRocket } from '@fortawesome/free-solid-svg-icons';

export default function MissionVision() {
  return (
    <section className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 md:p-12 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-[#032e92]/5 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#eef4ff] to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#021d63] flex items-center justify-center shadow-lg shadow-[#032e92]/20 mb-8">
              <FontAwesomeIcon icon={faBullseye} className="text-white text-2xl" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To demystify financial planning and provide accessible, transparent, and highly effective wealth management strategies. We aim to empower our clients with the knowledge and tools they need to secure their financial futures and navigate markets with absolute confidence.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-10 md:p-12 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-[#c10000]/5 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fce8e8] to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

            <div className="w-16 h-16 rounded-2xl bg-[#c10000] flex items-center justify-center shadow-lg shadow-[#c10000]/20 mb-8">
              <FontAwesomeIcon icon={faRocket} className="text-white text-2xl" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To be the most trusted and innovative wealth management partner globally. We envision a future where every individual and business has the financial backing and strategic guidance required to turn their grandest visions into sustainable realities.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
