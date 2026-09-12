import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const solutions = [
  { 
    id: 'sif',
    title: 'SIF',
    description: 'Smart Investment Fund optimizing asset allocation across market cycles.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    link: '#sif'
  },
  { 
    id: 'mutual-funds',
    title: 'Mutual Funds',
    description: 'Diversified portfolios managed by top-tier professionals.',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=800&q=80',
    link: '/funds'
  },
  { 
    id: 'pms',
    title: 'PMS',
    description: 'Bespoke direct equity portfolios for high-net-worth individuals.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
    link: '#pms'
  },
  { 
    id: 'aif',
    title: 'AIF',
    description: 'Exclusive private equity and hedge fund strategies.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    link: '#aif'
  }
];

export default function InvestmentSolutions() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-[#eef5ff] text-[#032e92] font-semibold text-sm mb-4 uppercase tracking-wider"
            >
              Wealth Creation
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a]"
            >
              Exclusive Investment <span className="text-[#032e92]">Solutions</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="#all-solutions" className="px-6 py-3 rounded-xl border-2 border-[#032e92] text-[#032e92] font-semibold hover:bg-[#032e92] hover:text-white transition-all duration-300 inline-flex items-center gap-2">
              View All Solutions
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, idx) => (
            <motion.div 
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl overflow-hidden h-[400px] shadow-lg"
            >
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={solution.image} 
                  alt={solution.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#032e92]/40 to-[#032e92] opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 transition-transform duration-300">
                  {solution.title}
                </h3>
                <p className="text-blue-100 mb-6 transition-all duration-300">
                  {solution.description}
                </p>
                <div className="overflow-hidden">
                  <Link 
                    to={solution.link} 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#032e92] font-bold text-sm transition-colors duration-300 hover:bg-[#c10000] hover:text-white"
                  >
                    Explore
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
