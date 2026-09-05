import { motion } from 'framer-motion';

export default function OurStory() {
  const timeline = [
    { year: '2010', title: 'Company Founded', desc: 'Started with a vision to democratize wealth management.' },
    { year: '2014', title: '1000+ Clients', desc: 'Reached our first major milestone of active investors.' },
    { year: '2018', title: 'Expanded Wealth Services', desc: 'Introduced PMS and AIF into our diverse portfolio.' },
    { year: '2022', title: 'Crossed ₹500Cr Assets', desc: 'A testament to the trust our clients place in us.' },
    { year: '2025', title: 'Digital Investment Platform', desc: 'Launched cutting edge digital solutions for modern investors.' },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Image Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-1 rounded-3xl overflow-hidden h-64 mt-12 shadow-xl"
              >
                <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" alt="Client Meeting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="col-span-1 rounded-3xl overflow-hidden h-64 shadow-xl"
              >
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop" alt="Office Space" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="col-span-2 rounded-3xl overflow-hidden h-72 shadow-xl"
              >
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" alt="Investment Planning" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#eef4ff] rounded-full blur-2xl -z-10"></div>
          </div>

          {/* Right Side: Story & Timeline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#032e92] font-semibold text-sm uppercase tracking-wider mb-4 block">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Journey Towards Financial Excellence</h2>
              <p className="text-gray-600 mb-12 leading-relaxed">
                Since our inception, our mission has been clear: to empower our clients to achieve financial freedom and build lasting generational wealth. We've continuously evolved our strategies, expanded our expertise, and embraced innovation to ensure our investors are always steps ahead.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative border-l-2 border-gray-100 ml-3">
              {timeline.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="mb-8 pl-8 relative group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#c10000] group-hover:bg-[#c10000] transition-colors duration-300"></div>
                  
                  <h4 className="text-xl font-bold text-[#032e92] mb-1">{item.year}</h4>
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h5>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
