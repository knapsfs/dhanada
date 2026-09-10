import { motion } from 'framer-motion';

export default function ServicesCTA() {
  return (
    <section className="py-24 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-[#032e92] to-[#01123d] rounded-[32px] overflow-hidden px-8 py-16 md:p-20 text-center shadow-2xl"
        >
          {/* Abstract background graphics */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c10000]/10 rounded-full blur-[100px]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIweiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+')] opacity-50"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Need Help Choosing the Right Financial Solution?
            </h2>
            
            <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Speak with our experienced advisors and receive personalized financial guidance tailored specifically to your life goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-white text-[#032e92] px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg">
                Book Consultation
              </button>
              <button className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold transition-colors">
                Contact Our Team
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
