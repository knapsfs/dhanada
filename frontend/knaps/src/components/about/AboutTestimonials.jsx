import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    designation: 'Business Owner',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Dhanada has completely transformed how I manage my wealth. Their personalized approach and expert advice have helped my portfolio grow by 25% in just two years. Highly recommended for any serious investor.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Patel',
    designation: 'IT Executive',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'The transparency and dedication of my relationship manager have been outstanding. I finally feel secure about my retirement planning and mutual fund investments.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Amit Deshmukh',
    designation: 'Doctor',
    image: 'https://randomuser.me/api/portraits/men/86.jpg',
    text: 'As a busy professional, I never had time to actively manage my finances. The PMS services here are exceptional. They took the time to understand my risk profile and delivered beyond expectations.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    designation: 'Entrepreneur',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Their holistic approach to wealth management, including insurance and AIFs, gives me complete peace of mind. The digital dashboard is also incredibly intuitive.',
    rating: 5,
  },
];

export default function AboutTestimonials() {
  return (
    <section className="py-24 bg-[#032e92] relative overflow-hidden">
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#021d63] to-transparent opacity-50 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-white/20 text-blue-100 bg-white/5 backdrop-blur-sm font-semibold text-sm mb-4 tracking-wider uppercase"
          >
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Clients Say</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-16 px-4"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <div className="bg-white rounded-[32px] p-8 shadow-xl h-full flex flex-col group relative overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                  
                  <div className="absolute top-8 right-8 text-gray-100 text-6xl group-hover:text-[#eef4ff] transition-colors duration-300 z-0">
                    <FontAwesomeIcon icon={faQuoteRight} />
                  </div>
                  
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-[#f59e0b] text-sm" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-8 flex-1 relative z-10 italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 relative z-10 border-t border-gray-100 pt-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.designation}</p>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

      </div>
    </section>
  );
}
