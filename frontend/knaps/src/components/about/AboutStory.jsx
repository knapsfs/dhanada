import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faArrowTrendUp, faHeart, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function AboutStory() {
  const storyCards = [
    {
      icon: faCompass,
      title: "1996 Origins",
      subtitle: "A Woman Entrepreneur's Vision",
      text: "Founded by Ms. Neelam Sawhney at a time when families knew how to save, but had limited choices and clarity about life-goal investing."
    },
    {
      icon: faArrowTrendUp,
      title: "Navigating Growth",
      subtitle: "Beyond Cash, Gold & FDs",
      text: "As financial choices expanded, we helped families answer critical questions on what is right for education, home, and retirement."
    },
    {
      icon: faHeart,
      title: "Built on Trust",
      subtitle: "Relationship-Driven Wealth",
      text: "KNAPS grew through genuine relationships, deep domain experience, and the steadfast trust of clients who chose to grow with us."
    },
    {
      icon: faUsers,
      title: "Second Generation",
      subtitle: "Bridging Heritage & Modernity",
      text: "Today, the next generation has joined KNAPS with the same core values and a fresh perspective on contemporary investor goals."
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">


          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto mb-4"
          >
            The Story of <span className="text-[#032e92]">KNAPS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Built on relationships, experience, and the trust of people who chose to invest with us across market cycles.
          </motion.p>
        </div>

        {/* Story Narrative Box & Timeline Cards */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-10">

          {/* Main Story Narrative Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-9 shadow-sm border border-gray-100 flex flex-col justify-between"
          >
            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                Founded by a woman entrepreneur, <strong className="text-[#032e92] font-semibold">Ms. Neelam Sawhney</strong>, KNAPS was established in 1996.
              </p>
              <p>
                As investment choices grew from traditional bank deposits and gold, people often faced the challenge:  <strong className="text-[#032e92] font-semibold">Where to invest? How to plan for future needs?</strong>
              </p>
              <p>
                KNAPS helps investors find answers to these questions. Our role is to understand investor’s needs, risk appetite, time horizon and other factors to determine the best investment product for them.
              </p>
              <p>
                Over the years, KNAPS has grown through relationships, experience, and the trust of the people who chose to invest with us.
              </p>
              <p>
                Today, the second generation is taking this forward with the same belief and a better understanding of what next-gen investors aspire for.
              </p>
            </div>

            {/* Vision Banner inside Story Card */}
            <div className="pt-4 border-t border-gray-100 bg-[#eef5ff] rounded-2xl mt-5 p-5 border border-[#032e92]/10">
              <div className="flex items-center gap-3">
                <p className="text-base sm:text-md font-semibold text-[#032e92]">
                  “The foundation is 30 years old. The vision is for the next 30 - to “Make India Financially Free.”
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Key Pillars / Chapters */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {storyCards.map((card, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#032e92]/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eef5ff] text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={card.icon} className="text-sm" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#032e92] block mb-0.5">
                      {card.title}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-black mb-1">
                      {card.subtitle}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                      {card.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div> */}

        </div>

      </div>
    </section>
  );
}
