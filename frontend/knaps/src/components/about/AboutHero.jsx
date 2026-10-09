import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function AboutHero() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="relative pt-[110px] pb-12 sm:pt-[120px] sm:pb-16 lg:pt-[120px] lg:pb-16 overflow-hidden bg-gradient-to-b from-[#eef4ff] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Header: Breadcrumb & Headline Above the Columns */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          {/* Breadcrumb Navigation */}
          <div className="flex items-center pb-4 sm:pb-5 gap-3 text-[15px] font-medium text-gray-500">
            <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
            <span className="text-[#032e92]">About Us</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl">
            We make investment choices <span className="text-[#032e92]">easier for you</span>
          </h1>
        </motion.div>

        {/* 2-Column Aligned Layout: Story on Left, Office Image on Right */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">

          {/* Left Column: Story & Philosophy Paragraphs + Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col justify-between space-y-6"
          >
            {/* Story & Philosophy Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
              <p>
                At KNAPS, we help people invest to achieve the goals they work hard for - seeing their child graduate, giving them the wedding they dreamed of, buying their first home, or enjoying a worry-free retirement.
              </p>
              <p>
                We know that feeling of <span className="font-semibold text-[#032e92]">‘sukoon’</span> that comes after seeing your dream come true after years of hard work, savings and sacrifices.
              </p>
              <p>
                Our role is to understand what life-stage you are in, when you need the money, how much risk you can take, and help you choose investments that are suited to you.
              </p>
              <p>
                So when that day finally comes, you can look back and say, <span className="font-semibold text-[#032e92]">“I planned for this. And today, I can live it.”</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={openLeadModal}
                className="btn-ripple px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-[#032e92] hover:bg-[#022169] text-white shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <span>Plan Your Goals With Us</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Office Image Top-Aligned with the Story Paragraphs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 h-full min-h-[300px] sm:min-h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                alt="KNAPS Financial Services Office"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
