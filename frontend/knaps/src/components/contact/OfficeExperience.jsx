import { motion } from 'framer-motion';

export default function OfficeExperience() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f4fd] text-[#032e92] font-semibold text-xs tracking-widest uppercase mb-6">
            Visit Our Office
          </div>
          <h2 className="text-4xl lg:text-[48px] font-bold text-[#0a192f] leading-tight mb-4">
            Experience Premium Wealth Advisory
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We welcome you to our headquarters for a bespoke consultation.
          </p>
        </div>

        {/* Embedded Google Map (Full Width) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full h-[500px] rounded-[40px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 group relative"
        >
          <div className="absolute inset-0 bg-[#032e92]/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112002.57682281862!2d77.12658864700772!3d28.6836758410292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1703248386382!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        </motion.div>

      </div>
    </section>
  );
}
