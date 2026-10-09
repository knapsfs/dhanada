import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { fetchTestimonials, getFrappeImageUrl } from '../api/testimonials';

const defaultTestimonialsRow1 = [
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

const defaultTestimonialsRow2 = [
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
    text: "From concept to execution, their financial strategy knows no bounds - a true game-changer for our family's long-term success."
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

const mapDocToTestimonial = (doc) => {
  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name1 || 'Client')}&background=032e92&color=fff`;
  return {
    id: doc.name,
    name: doc.name1 || 'Valued Client',
    designation: doc.position || '',
    image: doc.photo ? getFrappeImageUrl(doc.photo) : fallbackImg,
    fallbackImage: fallbackImg,
    text: doc.description || '',
  };
};

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
        onError={(e) => {
          if (testimonial.fallbackImage && e.target.src !== testimonial.fallbackImage) {
            e.target.src = testimonial.fallbackImage;
          }
        }}
        className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100"
      />
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
        <p className="text-xs text-gray-500 font-medium">{testimonial.designation}</p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  const [row1, setRow1] = useState(defaultTestimonialsRow1);
  const [row2, setRow2] = useState(defaultTestimonialsRow2);

  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      const data = await fetchTestimonials();
      if (isMounted && data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapDocToTestimonial);
        if (mapped.length === 1) {
          setRow1(mapped);
          setRow2(mapped);
        } else {
          const mid = Math.ceil(mapped.length / 2);
          setRow1(mapped.slice(0, mid));
          setRow2(mapped.slice(mid));
        }
      }
    }

    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayRow1 = row1.length < 4 ? [...row1, ...row1, ...row1, ...row1] : [...row1, ...row1];
  const displayRow2 = row2.length < 4 ? [...row2, ...row2, ...row2, ...row2] : [...row2, ...row2];

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 mb-10 sm:mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-4 uppercase tracking-wider"
          >
            Client Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto"
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
            {displayRow1.map((t, idx) => (
              <TestimonialCard key={`row1-${t.id || idx}-${idx}`} testimonial={t} />
            ))}
          </motion.div>

          {/* Bottom Row: Right to Left (Starts at 0%, moves to -50%) - Hidden on mobile screens */}
          <motion.div
            className="hidden md:flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 55 }}
          >
            {displayRow2.map((t, idx) => (
              <TestimonialCard key={`row2-${t.id || idx}-${idx}`} testimonial={t} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
