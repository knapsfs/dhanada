import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { fetchTestimonials } from '../api/testimonials';

const defaultTestimonialsRow1 = [
  {
    id: 1,
    name: 'Priyanshu',
    location: 'Uttar Pradesh',
    text: 'A refreshing and imaginative team that consistently delivers exceptional results - highly recommended for any complex financial planning.'
  },
  {
    id: 2,
    name: 'Nidhi',
    location: 'Rajasthan',
    text: "From concept to execution, their financial strategy knows no bounds - a true game-changer for our family's long-term success."
  },
  {
    id: 3,
    name: 'Yash Bansal',
    location: 'Haryana',
    text: 'Exceeded our expectations with innovative strategies that brought our vision to life - a truly remarkable and reliable wealth partner.'
  },
  {
    id: 4,
    name: 'Satyam',
    location: 'Bihar',
    text: 'A refreshing and imaginative team that consistently delivers exceptional results - highly recommended for any complex financial planning.'
  },
];

const defaultTestimonialsRow2 = [
  {
    id: 5,
    name: 'Rajesh',
    location: 'Bengaluru',
    text: 'Knaps has completely transformed how I manage my wealth. Their personalized approach and expert advice have helped my portfolio grow by 25% in just two years.'
  },
  {
    id: 6,
    name: 'Rajshree Pradhan',
    location: 'Odisha',
    text: 'Their holistic approach to wealth management, including insurance and AIFs, gives me complete peace of mind. The digital dashboard is also incredibly intuitive.'
  },
  {
    id: 7,
    name: 'Nitin Khandpa',
    location: 'New Delhi',
    text: 'As a busy professional, I never had time to actively manage my finances. The PMS services here are exceptional. They delivered beyond expectations.'
  },
  {
    id: 8,
    name: 'Priya Patel',
    location: 'New Delhi',
    text: 'The transparency and dedication of my relationship manager have been outstanding. I finally feel secure about my retirement planning and mutual fund investments.'
  },
];

const mapDocToTestimonial = (doc) => {
  return {
    id: doc.name,
    name: doc.name1 || 'Valued Client',
    location: doc.location || '',
    text: doc.description || '',
  };
};

const TestimonialCard = ({ testimonial }) => (
  <div className="w-[380px] sm:w-[400px] flex-shrink-0 bg-[#f8f9fc] rounded-[24px] p-7 sm:p-8 mx-3 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
    <div>
      {/* Huge Quote Icon */}
      <div className="text-4xl sm:text-5xl text-[#032e92] mb-5 sm:mb-6">
        <FontAwesomeIcon icon={faQuoteLeft} />
      </div>
      <p className="text-[#1a1a1a] text-[15px] sm:text-[16px] leading-relaxed mb-6 sm:mb-8 font-normal">
        {testimonial.text}
      </p>
    </div>

    <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
      <div>
        <h4 className="font-bold text-gray-900 text-sm sm:text-[15px] tracking-tight">{testimonial.name}</h4>
        {testimonial.location && (
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-1">
            <FontAwesomeIcon icon={faLocationDot} className="text-[#032e92] text-[11px]" />
            <span>{testimonial.location}</span>
          </p>
        )}
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

        {/* White gradient overlays for the edges on desktop, hidden on mobile */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

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
