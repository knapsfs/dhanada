import { motion } from 'framer-motion';

export default function OfficeMap() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-[36px] font-bold text-[#0a192f] mb-4">Visit Our Office</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">We are centrally located in the financial district. Drop by for a cup of coffee and a detailed consultation regarding your portfolio.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-white p-4 rounded-[40px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-gray-100"
        >
          {/* Embedded Google Map */}
          <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden bg-gray-100 relative">
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
          </div>
        </motion.div>

        {/* Map Details Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
          <div>
            <h5 className="font-bold text-[#0a192f] mb-2 uppercase tracking-wider text-sm">Office Address</h5>
            <p className="text-gray-500 text-sm">123 Financial District, Suite 500<br/>New Delhi, India 110001</p>
          </div>
          <div>
            <h5 className="font-bold text-[#0a192f] mb-2 uppercase tracking-wider text-sm">Parking Information</h5>
            <p className="text-gray-500 text-sm">Complimentary valet parking available for all clients.</p>
          </div>
          <div>
            <h5 className="font-bold text-[#0a192f] mb-2 uppercase tracking-wider text-sm">Nearest Landmark</h5>
            <p className="text-gray-500 text-sm">Opposite the National Stock Exchange Building.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
