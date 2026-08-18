import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const testimonialsRow1 = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    designation: 'Business Owner',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Knaps has completely transformed how I manage my wealth. Their personalized approach and expert advice have helped my portfolio grow by 25% in just two years.'
  },
  {
    id: 2,
    name: 'Priya Patel',
    designation: 'IT Executive',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'The transparency and dedication of my relationship manager have been outstanding. I finally feel secure about my retirement planning and mutual fund investments.'
  },
  {
    id: 3,
    name: 'Amit Deshmukh',
    designation: 'Doctor',
    image: 'https://randomuser.me/api/portraits/men/86.jpg',
    text: 'As a busy professional, I never had time to actively manage my finances. The PMS services here are exceptional. They delivered beyond expectations.'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    designation: 'Entrepreneur',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Their holistic approach to wealth management, including insurance and AIFs, gives me complete peace of mind. The digital dashboard is also incredibly intuitive.'
  },
];

const testimonialsRow2 = [
  {
    id: 5,
    name: 'Vikram Singh',
    designation: 'Corporate Director',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    text: 'A refreshing and imaginative team that consistently delivers exceptional results - highly recommended for any complex financial planning.'
  },
  {
    id: 6,
    name: 'Anjali Desai',
    designation: 'Tech Lead',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    text: 'From concept to execution, their financial strategy knows no bounds - a true game-changer for our family\'s long-term success.'
  },
  {
    id: 7,
    name: 'Rohan Mehta',
    designation: 'Startup Founder',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    text: 'Creative advisors who listen, understand, and craft captivating portfolios - a wealth partner that truly understands our startup needs.'
  },
  {
    id: 8,
    name: 'Neha Kapoor',
    designation: 'Marketing Head',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    text: 'Exceeded our expectations with innovative strategies that brought our vision to life - a truly remarkable and reliable wealth partner.'
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="w-[400px] flex-shrink-0 bg-[#f8f9fc] rounded-[24px] p-8 mx-3 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
    <div>
      {/* Huge Quote Icon */}
      <div className="text-5xl text-[#032e92] mb-6">
        <FontAwesomeIcon icon={faQuoteLeft} />
      </div>
      <p className="text-[#1a1a1a] text-[17px] leading-relaxed mb-8">
        {testimonial.text}
      </p>
    </div>

    <div className="flex items-center gap-4">
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover shadow-sm"
      />
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
        <p className="text-xs text-gray-500 font-medium">{testimonial.designation}</p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-4 uppercase tracking-wider"
          >
            Client Success
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a]"
          >
            Don't Just Take Our <span className="text-[#032e92]">Word</span> For It
          </motion.h2>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative">

        {/* White gradient overlays for the edges to make the marquee fade in/out seamlessly */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex flex-col gap-6 overflow-hidden max-w-[100vw]">

          {/* Top Row: Left to Right (Starts at -50%, moves to 0%) */}
          <motion.div
            className="flex w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            {/* We duplicate the array to create the seamless loop */}
            {[...testimonialsRow1, ...testimonialsRow1].map((t, idx) => (
              <TestimonialCard key={`row1-${idx}`} testimonial={t} />
            ))}
          </motion.div>

          {/* Bottom Row: Right to Left (Starts at 0%, moves to -50%) */}
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 55 }}
          >
            {/* We duplicate the array to create the seamless loop */}
            {[...testimonialsRow2, ...testimonialsRow2].map((t, idx) => (
              <TestimonialCard key={`row2-${idx}`} testimonial={t} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
