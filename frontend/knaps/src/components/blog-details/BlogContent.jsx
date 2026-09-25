import stoppingSipImg from '../../assets/blogs/stopping-sip-when-the-market-falls.jpg';
import sifVsMfInfographic from '../../assets/blogs/mutual-funds-vs-specialised-investment-funds.jpg';
import mutualFundsRisksImg from '../../assets/blogs/mutual-funds-riks-goals-returns.jpg';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuoteLeft,
  faArrowsRotate,
  faKitMedical,
  faBullseye,
  faCircleCheck,
  faCircleInfo,
  faScaleUnbalancedFlip,
  faShieldHalved,
  faArrowTrendUp,
  faArrowTrendDown,
  faArrowsUpDown,
  faBuildingColumns,
  faQuestionCircle,
  faCompass,
  faPhone,
  faTriangleExclamation,
  faArrowRight,
  faClock,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { useLeadModal } from '../../context/LeadModalContext';

export default function BlogContent({ blog }) {
  const { openLeadModal } = useLeadModal();

  // 1. If blog is "7 Common Mistakes Beginners Make While Investing in Mutual Funds"
  if (blog?.slug === '7-common-mistakes-beginners-make-while-investing-in-mutual-funds' || blog?.id === 12) {
    return (
      <article className="bg-white pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-gray-700 text-[17px] leading-[1.85]">

          {/* Lead Paragraph */}
          <p className="text-xl sm:text-[22px] font-medium text-[#0a192f] leading-relaxed mb-8 border-l-4 border-[#032e92] pl-5 py-1">
            Most people tend to make wrong investments in mutual funds often when decisions are driven by <strong>fear, greed, FOMO, peer pressure</strong>, or simply by <strong>lack of knowledge and planning</strong>.
          </p>

          <p className="mb-8 text-gray-600">
            Investing in mutual funds is one of the most powerful wealth-creation tools for Indian investors. However, small behavioral errors early on can compound into substantial losses or missed opportunities over a 10 to 15 year horizon. Here are the <strong>7 common mistakes you should strictly avoid</strong> while investing in mutual funds:
          </p>

          {/* Quick Summary Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-14">
            {[
              { num: '01', title: 'Chasing Past Returns', desc: 'Investing based purely on last year\'s 35% return.' },
              { num: '02', title: 'Stopping SIPs in Dips', desc: 'Letting panic take over and selling when prices drop.' },
              { num: '03', title: 'Taking Unmatched Risk', desc: 'Over-allocating to volatile funds without assessing tolerance.' },
              { num: '04', title: 'Daily Portfolio Checking', desc: 'Converting profitable investments into loss-making exits.' },
              { num: '05', title: 'Investing Without Goals', desc: 'Treating all funds as one random bucket of cash.' },
              { num: '06', title: 'No Emergency Buffer', desc: 'Being forced to break equity investments at market bottoms.' },
              { num: '07', title: 'Expecting Fixed Returns', desc: 'Panicking when returns vary non-linearly across years.' },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/70 flex items-start gap-3 shadow-xs"
              >
                <span className="w-8 h-8 rounded-xl bg-[#032e92] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {m.num}
                </span>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-sm leading-snug">{m.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed 7 Mistakes Section */}
          <div className="space-y-12">

            {/* Mistake 1 */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-blue-50/40 via-white to-blue-50/20 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-[#032e92] text-white flex items-center justify-center text-base font-bold shadow-md shadow-blue-900/20">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                  Choosing a fund only because it gave the highest returns in the past
                </h2>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <p className="font-semibold text-[#0a192f] mb-2">The Common Trap:</p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You see a fund that gave a return of <strong>35% last year</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3 italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  Your first thought? <em>“I want to invest in this.”</em>
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You invest, and next year your returns turn out to be only <strong>10%</strong> (or negative).
                </p>
                <p className="font-bold text-[#c10000] m-0">
                  And that’s exactly where the mistake begins!
                </p>
              </div>

              <p className="mb-4">
                Because you’re looking at what the fund did in the <strong>past</strong>, not what it will do in the <strong>future</strong>.
              </p>

              <p className="mb-4">
                Any reason could contribute to that high return — maybe the fund took excessive risk, maybe that stellar performance came from a particular market cycle, or maybe it was a transient cyclic industrial change that won’t repeat.
              </p>

              <div className="bg-amber-50/70 border-l-4 border-amber-500 p-5 rounded-r-2xl my-6">
                <p className="text-sm sm:text-base text-amber-900 font-medium m-0 leading-relaxed">
                  A high return in the previous year can make a fund look very attractive on paper, <strong>but you are not investing for last year. You are investing for the future.</strong>
                </p>
              </div>

              <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-100 flex items-start gap-3.5">
                <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-xl mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-[#0a192f] text-base mb-1">What You Should Do Instead:</p>
                  <p className="text-sm text-gray-700 m-0">
                    Before chasing numbers, always ask yourself: <em>Does this fund actually fit my personal financial goal, my risk tolerance, and my investment time horizon?</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Mistake 2 */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-red-50/30 via-white to-red-50/20 border border-red-100 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-[#c10000] text-white flex items-center justify-center text-base font-bold shadow-md shadow-red-900/20">
                  2
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                  Stopping SIPs when the market falls
                </h2>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <p className="font-semibold text-[#0a192f] mb-3">Imagine this scenario:</p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  One fine day, you wake up and see that the market is down by <strong>15%</strong>.
                </p>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4 space-y-2">
                  <p className="text-gray-800 font-medium italic m-0">
                    You start thinking: <em>“Arre yaar, mutual fund me mera paisa kam ho raha hai!”</em>
                  </p>
                  <p className="text-gray-800 font-medium italic m-0">
                    You see your portfolio value tumbling, and… <strong>FEAR takes over!</strong>
                  </p>
                  <p className="text-red-700 font-bold m-0">
                    <em>“Isse pehle market aur gir jaaye, paise nikaal leta hoon.”</em>
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mb-2">
                  A few months ago, you were happily investing every month because the market was climbing higher. Now that prices are declining, you're terrified of losing money.
                </p>
                <p className="text-gray-900 font-bold m-0">
                  So you panic, pause your SIP, and exit your investments!?
                </p>
              </div>

              {/* The Irony Box */}
              <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-2xl shadow-md my-6">
                <p className="text-lg font-extrabold mb-2">Here is the big irony:</p>
                <p className="text-red-100 text-base leading-relaxed m-0">
                  You were buying units happily when they were <strong>expensive</strong>, and now you are selling or halting your purchases when units have become <strong>cheaper</strong>! That is not a strategy — that is pure emotion overruling logic.
                </p>
              </div>

              {/* Section Infographic Image */}
              <div className="my-8 rounded-3xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
                <img
                  src={stoppingSipImg}
                  alt="Stopping SIP when the market falls mistake"
                  className="w-full h-auto object-cover max-h-[500px]"
                />
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium m-0">
                    Halting SIPs in a correction destroys Rupee Cost Averaging. Dips are the exact time you accumulate more units for cheap.
                  </p>
                </div>
              </div>

              <p className="mb-4">
                Market falls are scary. But if your financial goal and investment time horizon haven’t changed, a temporary fall does not mean you should stop your SIP.
              </p>

              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-100 flex items-start gap-3.5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-700 text-xl mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950 text-base mb-1">The Long-Term Investor's Mindset:</p>
                  <p className="text-sm text-emerald-900 m-0">
                    If you are investing for the long term (5 to 10+ years), you cannot afford to change your financial roadmap every time the market changes its mood. Staying invested through dips is where true compounding is built.
                  </p>
                </div>
              </div>
            </div>

            {/* Mistake 3 */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 border border-amber-100 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-amber-900/20">
                  3
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                  Choosing a fund that is too risky
                </h2>
              </div>

              <p className="mb-4">
                You see an aggressive sectoral or small-cap fund delivering <strong>25% returns</strong> and think:
              </p>

              <blockquote className="bg-white p-4 sm:p-5 rounded-2xl border-l-4 border-amber-500 shadow-sm my-4 italic text-gray-800">
                “My existing large-cap or balanced fund is giving only 12% returns! Let me shift all my money to the 25% fund.”
              </blockquote>

              <p className="mb-4">
                You move your hard-earned capital into the high-flying fund — and completely ignore the risk profile. But high returns invariably carry significantly higher volatility and downside risk.
              </p>

              {/* The Acid Test Question */}
              <div className="bg-[#0a192f] text-white p-7 rounded-2xl shadow-lg my-6">
                <p className="text-amber-400 font-bold uppercase text-xs tracking-wider mb-2">The Acid Test Question</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
                  “What will I do if my ₹10 lakh investment becomes ₹7 lakh?”
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed m-0">
                  If you panic, lose your sleep, or feel compelled to sell in a hurry during a 30% drawdown, that fund is simply too risky for your psychological comfort zone.
                </p>
              </div>

              <p className="mb-4">
                The real test of an investor is never how you feel when the market is surging up — <strong>it is how you react when prices start crashing</strong>. High returns can be deeply tempting, but taking unnecessary risk without alignment will only lead to distress sales.
              </p>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#0a192f] text-base mb-1">Unsure About Your Risk Profile?</p>
                  <p className="text-sm text-gray-600 m-0">
                    Take a comprehensive risk assessment to find the exact asset allocation suitable for your temperament.
                  </p>
                </div>
                <button
                  onClick={() => openLeadModal('Risk Assessment: 7 Mistakes Blog')}
                  className="btn-ripple px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#032e92] text-white hover:bg-[#021d63] shadow-md shrink-0 cursor-pointer"
                >
                  Assess My Risk Profile
                </button>
              </div>
            </div>

            {/* Mistake 4 */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-indigo-50/30 via-white to-indigo-50/20 border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-700 text-white flex items-center justify-center text-base font-bold shadow-md shadow-indigo-900/20">
                  4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                  Checking the portfolio every single day
                </h2>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
                <p className="text-gray-700 leading-relaxed m-0">
                  You invest <strong>₹10 lakh</strong> in a diversified mutual fund portfolio.
                </p>
                <div className="pl-4 border-l-2 border-indigo-200 space-y-2 text-sm text-gray-700">
                  <p>Next month, you log into the app: It reads <strong>₹9.8 lakh</strong>!</p>
                  <p className="text-indigo-950 font-semibold italic">And your brain reacts: <em>“Arre! ₹20,000 kam ho gaya!”</em></p>
                  <p>You check again the following week. It dips a tiny bit further.</p>
                  <p className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-indigo-900 font-medium">
                    <em>“Bas, paise iss fund se nikal leta hoon. Jab market theek hoga, wapas daal dunga.”</em>
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed m-0">
                  Sounds sensible and cautious, right? So you hit withdraw and exit.
                </p>
                <p className="text-gray-700 leading-relaxed m-0">
                  Then within weeks, the market stabilizes and begins rallying. Now you think about entering again. <strong>My friend, you have already missed the sharpest part of the recovery!</strong> You exited at the trough and entered when prices were elevated again.
                </p>
              </div>

              <div className="bg-[#fff9db] border-l-4 border-[#f59f00] p-6 rounded-r-2xl my-6">
                <div className="flex items-center gap-2 mb-2 text-[#f59f00] font-bold text-base">
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  <span>The Real Hidden Danger of Daily Noise</span>
                </div>
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed m-0">
                  Checking your portfolio daily creates the illusion that you must take action on short-term noise. <strong>₹20,000 falling today is not your biggest problem — but missing years of uninterrupted compounding is!</strong>
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Mutual funds are structured for quarterly or annual reviews. Daily fluctuations are mere market breath — obsessing over them only converts profitable investments into loss-making premature exits.
              </p>
            </div>

            {/* Mistake 5 */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-teal-50/30 via-white to-teal-50/20 border border-teal-100 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center text-base font-bold shadow-md shadow-teal-900/20">
                  5
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                  Investing without a clear financial goal
                </h2>
              </div>

              <p className="mb-4">
                Many beginners start investing simply because colleagues or peers are talking about SIPs:
              </p>

              <p className="italic text-gray-600 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                ₹5,000 here, ₹10,000 there. A few schemes recommended on social media. Maybe an arbitrary SIP.
              </p>

              <p className="mb-4">
                But do you ever pause and ask: <strong>“What is this specific investment actually meant to achieve?”</strong>
              </p>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm my-6 space-y-3">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
                  <FontAwesomeIcon icon={faBullseye} />
                  <span>Why Goal-Tagging Protects Your Wealth</span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed m-0">
                  Without a goal, all your mutual funds look like one generic pool of money. The day an urgent cash requirement crops up, you might prematurely liquidate a high-return-generating equity fund at the wrong market cycle — when a debt fund or fixed deposit should have serviced that need instead.
                </p>
              </div>

              <p className="mb-4">
                The problem isn’t investing — investing is a stellar habit! <strong>The real issue is not knowing what each investment is meant to do.</strong>
              </p>

              <div className="bg-teal-50/60 p-5 rounded-2xl border border-teal-100 flex items-start gap-3.5">
                <FontAwesomeIcon icon={faCircleCheck} className="text-teal-700 text-xl mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-teal-950 text-base mb-1">Every Rupee Needs a Purpose:</p>
                  <p className="text-sm text-teal-900 m-0">
                    Whether it is your child’s higher education, daughter’s wedding, purchasing a home, or building a retirement corpus: when you know <em>why</em> you invested, you also know exactly <em>what you should and should not break</em>.
                  </p>
                </div>
              </div>
            </div>

            {/* Mistake 6 */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20 border border-rose-100 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-rose-900/20">
                  6
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                  Investing without an emergency fund in place
                </h2>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
                <p className="text-gray-700 leading-relaxed m-0">
                  You invest regularly. Your monthly SIP is running smoothly. Your portfolio is expanding. Everything feels on track.
                </p>
                <p className="font-bold text-rose-800 m-0">
                  Then life says: “Surprise!”
                </p>
                <p className="text-gray-700 leading-relaxed m-0">
                  A sudden family medical emergency arises, requiring an immediate deposit of <strong>₹5 lakhs</strong> at the hospital. But you have zero liquid emergency funds because all your savings were locked in equity mutual funds.
                </p>
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-950 text-sm leading-relaxed">
                  <strong>The Double Blow:</strong> If the broader equity market happens to be down 8% that very week, you might be forced to sell ₹5 lakh worth of original units for just <strong>₹4.6 lakh</strong>! You incur a permanent capital loss simply because you needed liquidity at the worst possible time.
                </div>
              </div>

              <p className="mb-4">
                Had you preserved that equity allocation, that capital could have continued compounding for decades.
              </p>

              {/* Emergency Fund Rule Box */}
              <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-7 rounded-2xl shadow-lg my-6">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faKitMedical} />
                  <span>Foundational Financial Rule</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
                  “Investments are for the future. Emergency money is for life’s surprises. You need both.”
                </h3>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed m-0">
                  Always maintain <strong>6 to 12 months</strong> of mandatory living expenses in safe liquid funds or high-yield sweep accounts before starting aggressive equity mutual fund investments.
                </p>
              </div>
            </div>

            {/* Mistake 7 */}
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center text-base font-bold shadow-md shadow-purple-900/20">
                  7
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                  Expecting guaranteed or fixed linear returns
                </h2>
              </div>

              <p className="mb-4">
                <em>“Mutual fund investments are subject to market risks, read all scheme related documents carefully.”</em> You have heard this mandatory disclaimer hundreds of times. But what does it truly mean in practice?
              </p>

              <p className="mb-4">
                It means returns are <strong>non-linear</strong>. Returns can surge in year one, flatten in year two, and dip into negative territory in year three.
              </p>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm my-6">
                <p className="font-semibold text-[#0a192f] mb-2">The Disappointment Trap:</p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Suppose you invest ₹10,000 every month. If you constantly expect a smooth 12% every single year like a bank fixed deposit, a negative year causes acute disappointment:
                </p>
                <p className="italic text-purple-900 bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 mb-3">
                  <em>“Mujhe toh 12% chahiye tha. Yeh fund bekaar hai, paise nikaal leta hoon.”</em>
                </p>
                <p className="text-gray-700 leading-relaxed m-0">
                  What happens next? You stop your SIP when prices are low, fail to give the market time to recover, and lock in a loss because the reality didn't match an artificial expectation.
                </p>
              </div>

              <p className="mb-4">
                A single negative or muted year does <strong>not</strong> mean the fund or investment strategy has failed. Over a 7 to 10 year horizon, bullish and bearish market cycles balance each other out to generate compelling inflation-beating wealth.
              </p>

              <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-100 flex items-start gap-3.5">
                <FontAwesomeIcon icon={faArrowsRotate} className="text-purple-700 text-xl mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-purple-950 text-base mb-1">Key Takeaway:</p>
                  <p className="text-sm text-purple-900 m-0">
                    Don’t invest expecting guaranteed linear returns. Invest with realistic expectations for a range of market outcomes, stay committed for the appropriate time horizon, and review schemes based on your financial goals rather than short-term fluctuations.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Inspirational Quote */}
          <blockquote className="relative p-8 sm:p-10 bg-gradient-to-r from-blue-50/50 via-gray-50 to-blue-50/50 rounded-3xl border border-blue-100/80 my-12 text-center shadow-sm">
            <FontAwesomeIcon icon={faQuoteLeft} className="absolute top-6 left-8 text-3xl text-blue-200" />
            <p className="relative z-10 text-xl sm:text-2xl text-[#0a192f] font-bold italic leading-relaxed m-0">
              "The investor’s chief problem — and even his worst enemy — is likely to be himself."
            </p>
            <footer className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">— Benjamin Graham</footer>
          </blockquote>

          {/* KNAPS AMFI / SEBI Registered Callout Box */}
          <div className="bg-gradient-to-br from-[#032e92] to-[#021d63] text-white p-8 sm:p-10 rounded-3xl shadow-xl my-12">
            <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2">
              <FontAwesomeIcon icon={faCompass} />
              <span>SEBI-Registered Advisory & Distribution</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Avoid Common Mistakes — Build Wealth With Confidence
            </h3>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
              <a href="https://knaps.in" target="_blank" rel="noopener noreferrer" className="text-white font-bold underline hover:text-cyan-200 transition-colors">
                KNAPS Private Limited
              </a>{' '}
              is a leading SEBI-registered Mutual Fund and SIF Distributor in India. You can contact our team of experts and avoid making the mistakes that beginners make while investing in Mutual Funds.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => openLeadModal('Blog: 7 Common Mistakes in Mutual Funds')}
                className="btn-ripple px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-[#032e92] hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                Schedule Free Consultation
              </button>
            </div>
          </div>

        </div>
      </article>
    );
  }


  // 1. If blog is "How to choose a Mutual fund scheme in India 2026?"
  if (blog?.slug === 'how-to-choose-a-mutual-fund-scheme-in-india-2026' || blog?.id === 11) {
    return (
      <article className="bg-white pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-gray-700 text-[17px] leading-[1.85]">

          {/* Lead Section */}
          <div className="text-xl sm:text-[22px] font-medium text-[#0a192f] leading-relaxed mb-8 border-l-4 border-[#032e92] pl-5 py-2 bg-blue-50/30 rounded-r-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-3">
              How to choose a Mutual fund scheme in India 2026?
            </h2>
            <p className="m-0 text-gray-700 text-lg sm:text-xl font-normal leading-relaxed">
              Choosing a mutual fund is simple. Start with shortlisting which category you want to invest in — <strong>Equity, debt, or hybrid</strong> based on these <strong>4 parameters</strong>:
            </p>
          </div>

          {/* 4 Parameters Cards */}
          <div className="space-y-8 my-10">

            {/* 1. Investment Objective */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 border border-blue-100/80 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-[#032e92] text-white flex items-center justify-center text-base font-bold shadow-md shadow-blue-900/20">
                  1
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                  Investment Objective
                </h3>
              </div>

              <p className="mb-6 font-medium text-gray-800">
                First, ask yourself what are you investing for? <strong>Income generation, capital preservation, or long-term wealth creation?</strong>
              </p>

              <div className="space-y-4">
                {/* Income generation */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-[#032e92] text-base mb-1.5 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]"></span>
                    Income Generation
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed m-0">
                    If your objective is to generate income from your investment, you can consider an <strong>SWP (Systematic Withdrawal Plan)</strong>, where you withdraw a fixed amount at regular intervals (mostly on a monthly basis), or the <strong>IDCW Payout option</strong>, where the fund may distribute dividend income to investors when declared. <em>The amount and frequency of IDCW are not guaranteed.</em>
                  </p>
                </div>

                {/* Capital preservation */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-[#032e92] text-base mb-1.5 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]"></span>
                    Capital Preservation
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed m-0">
                    If your objective is capital preservation, you can consider suitable debt-oriented categories, such as <strong>Liquid, Ultra Short Duration, Short Duration, Corporate Bond or Gilt Funds</strong>.
                  </p>
                </div>

                {/* Long-term wealth creation */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-[#032e92] text-base mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]"></span>
                    Long-Term Wealth Creation
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    If your objective is long-term wealth creation, you can consider equity mutual funds. The category can be chosen based on the type of companies or investment style you want:
                  </p>

                  <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                      <span><strong>Large Cap Funds:</strong> focus on the top 100 companies by market cap</span>
                    </li>
                    <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                      <span><strong>Large &amp; Mid Cap Funds:</strong> combine large and mid-sized companies</span>
                    </li>
                    <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                      <span><strong>Mid Cap Funds:</strong> focus on companies ranked 101st–250th by market cap</span>
                    </li>
                    <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                      <span><strong>Small Cap Funds:</strong> focus on companies ranked 251st onwards</span>
                    </li>
                    <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50 sm:col-span-2">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                      <span><strong>Multi Cap or Flexi Cap Funds:</strong> give you exposure across different company sizes</span>
                    </li>
                  </ul>

                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#032e92]">
                    <Link to="/blogs" className="inline-flex items-center gap-1.5 hover:underline">
                      <span>To know more about the different strategies, you can read this Blog &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Investment Horizon */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 border border-emerald-100/80 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-emerald-900/20">
                  2
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                  Investment Horizon
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                When will you need the money? If you are investing for the long term, you can consider equity-oriented mutual funds (a typical equity cycle lasts for 4-5 years usually) as you have more time to stay invested through market ups and downs. If you need to park money for a few months you can go for short term debt funds. Hybrids give the advantage of both words by having a combination of stocks and debt in your portfolio and can be used for medium term investments.
              </p>
            </div>

            {/* 3. Risk Level */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border border-amber-100/80 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-amber-900/20">
                  3
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                  Risk Level
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Check the risk level of the fund and ask yourself how much risk you are willing to take. Debt mutual funds carry a risk of interest-rate and credit risk, while equity and equity-oriented hybrid funds are mainly affected by market movements and changes in stock prices.
              </p>
              <div className="bg-white p-4 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-gray-700">
                <strong>The Riskometer:</strong> Every mutual fund has a Riskometer, which indicates the scheme’s risk level from <strong>1 (Low) to 5 (Very High)</strong>. Choose a fund whose risk level matches your ability and willingness to take risk.
              </div>
            </div>

            {/* 4. Performance */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30 border border-purple-100/80 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-purple-900/20">
                  4
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                  Performance
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Next, evaluate the fund’s performance over different periods (1month, 3 months, 6 months, 1 year, since inception) and look for consistency rather than choosing a fund simply because it delivered the highest return in the previous year, as higher return funds tends to have deeper cycles during market downturns.
              </p>
            </div>

          </div>

          {/* Scheme Selection Checkpoints */}
          <div className="mt-14 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faCircleCheck} />
              </span>
              Checkpoints to Choose a Particular Mutual Fund Scheme
            </h2>

            <p className="mb-4">
              Once you have shortlisted the right category, you can use these checkpoints to choose a particular mutual fund scheme:
            </p>

            <p className="mb-6 font-medium text-gray-800">
              Compare funds within the same category. You can pick <strong>3 - 4 schemes</strong> that follow a similar investment style and compare them on the following metrics:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-8">
              {/* Metric 1 */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                  Check long-term performance
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                  Look at the fund’s 3-year and 5-year returns and check if they have delivered consistent returns in the long term rather than just looking at the highest returns.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                  Compare performance with the benchmark
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                  Check whether the fund has consistently performed in line with or better than its benchmark.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                  Look at risk along with returns
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                  If two funds have delivered similar returns, check which one has taken less risk to achieve them. You can refer to the sharpe ratio for that. A higher Sharpe Ratio generally means that the fund has generated better returns for the level of risk taken.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                  Check the portfolio
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                  See where the fund is investing. Check the top holdings, sectors, and allocation to understand where your money is actually being invested.
                </p>
              </div>

              {/* Metric 5 */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 sm:col-span-2">
                <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                  Check the cost
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                  Compare the expense ratio with other funds in the same category. A lower expense ratio can help you keep more of your investment returns.
                </p>
              </div>
            </div>

            {/* Remove schemes that don't fit */}
            <div className="bg-[#fff9e6] border-l-4 border-amber-500 p-5 rounded-r-2xl my-6">
              <div className="flex items-center gap-2.5 mb-1.5 text-[#b45309] font-bold text-base">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>Remove schemes that don’t fit</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed m-0">
                Eliminate funds with inconsistent performance, unsuitable asset allocation, or higher risk without a corresponding difference in returns.
              </p>
            </div>

            {/* KNAPS Consultation Callout */}
            <div className="bg-[#eef5ff] border border-blue-200/70 p-6 rounded-2xl my-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm sm:text-base text-gray-700 m-0">
                  If you think you need to discuss further about your personal goals and objectives, you can talk to us at <strong>KNAPS</strong>.
                </p>
              </div>
              <button
                onClick={() => openLeadModal('Blog: Choose Mutual Fund 2026')}
                className="btn-ripple px-5 py-2.5 rounded-xl font-bold text-xs bg-[#032e92] text-white hover:bg-[#021d63] whitespace-nowrap shadow-md cursor-pointer shrink-0"
              >
                Book a consultation here &rarr;
              </button>
            </div>
          </div>

          {/* Section: How to review your mutual fund scheme? */}
          <div className="mt-14 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faCompass} />
              </span>
              How to review your mutual fund scheme?
            </h2>

            <blockquote className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-50/40 via-gray-50 to-blue-50/40 rounded-3xl border border-blue-100 my-6 text-center shadow-sm">
              <p className="text-lg sm:text-xl text-[#0a192f] font-bold leading-relaxed m-0">
                "The best way to review your mutual fund scheme is to give it enough time to work and avoid checking it too frequently."
              </p>
            </blockquote>

            <p className="mb-4">
              Mutual funds are meant for the long term, so checking your portfolio every day, week, or month can make you react to normal market movements and make unnecessary changes.
            </p>

            <p className="mb-4">
              Instead, give your investments time to work. A <strong>review once a year</strong> is generally enough for a long-term portfolio, or whenever there is a major change in your financial goal, income, or time horizon.
            </p>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 my-6 text-sm">
              <h4 className="font-bold text-gray-900 mb-2">Example: Changing Goals &amp; Life Stages</h4>
              <p className="text-gray-600 leading-relaxed m-0">
                If your goal, income or time period has changed, your investments may also need to change. For example, you may have started investing to build an emergency fund when your income was uncertain. A few years later, your income may have become more stable and your emergency fund may already be sufficient. You may now want to focus on long-term wealth creation. In that case, your investments should be reviewed based on your new goal.
              </p>
            </div>

            <p className="mb-4 font-medium text-gray-800">
              During the annual review, simply ask:
            </p>

            <div className="p-5 rounded-2xl bg-[#eef5ff] border-2 border-[#032e92]/30 text-center font-bold text-base sm:text-lg text-[#032e92] my-4 shadow-sm">
              "Is this investment still right considering the goal I invested for?"
            </div>

            <p className="text-sm text-gray-600">
              If the answer is <strong>yes</strong>, there may be no reason to make a change.
            </p>
          </div>

          {/* Section: When to exit? */}
          <div className="mt-14 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faShieldHalved} />
              </span>
              When to exit?
            </h2>

            <p className="mb-6">
              You can take an exit or withdraw money from a mutual fund scheme in any of the following <strong>5 cases</strong>:
            </p>

            <div className="space-y-3.5 my-8">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-base mb-1">Your goal is complete</h4>
                  <p className="text-xs sm:text-sm text-gray-600 m-0">If you have reached the amount you need for your goal, you can start withdrawing the money.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center font-bold text-sm shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-base mb-1">Your goal has changed</h4>
                  <p className="text-xs sm:text-sm text-gray-600 m-0">If you originally invested for a long-term goal but now need the money much sooner, you may need to withdraw your investment.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-base mb-1">The fund is consistently underperforming</h4>
                  <p className="text-xs sm:text-sm text-gray-600 m-0">One bad year is not enough. If a fund keeps performing poorly against its category and benchmark over a longer period, it deserves a review.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-base mb-1">The fund’s strategy has changed</h4>
                  <p className="text-xs sm:text-sm text-gray-600 m-0">If the fund starts investing in a way that no longer aligns with why you bought it earlier, you can reconsider holding it.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">5</span>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-base mb-1">You have taken more risk than you can handle</h4>
                  <p className="text-xs sm:text-sm text-gray-600 m-0">If market falls are causing panic or the portfolio has become too risky for your current situation, reducing risk, and switching to a safer fund may make sense.</p>
                </div>
              </div>
            </div>

            {/* Panic Exit Warning Callout */}
            <div className="bg-[#fff5f5] border-l-4 border-[#c10000] p-6 sm:p-7 rounded-r-3xl my-8 shadow-sm">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed mb-3 font-medium">
                Most of the investors panic and exit when the market is falling. But is that a good time to exit? <strong>No! Not at all.</strong> You should consider taking an exit when there is a good reason to.
              </p>
              <div className="bg-red-100/70 p-4 rounded-xl border border-red-200">
                <p className="text-sm sm:text-base text-gray-900 font-semibold leading-relaxed m-0">
                  In fact, falling markets are the best time to enter the markets and start investing as you can get a low price for the units you are investing in. Markets are cyclical in nature, you will be profitable when prices rise again.
                </p>
              </div>
            </div>
          </div>

          {/* Contact KNAPS WhatsApp / Consultation Banner */}
          <div className="bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#011442] text-white p-8 sm:p-10 rounded-3xl shadow-xl my-12 text-center sm:text-left sm:flex items-center justify-between gap-8">
            <div className="sm:max-w-xl mb-6 sm:mb-0">
              <span className="inline-block text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2">
                Expert Guidance
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Get Clarity on Your Investment Strategy
              </h3>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed m-0">
                You can contact <strong>KNAPS</strong> and get more clarity on How to choose a Mutual fund scheme in India 2026 as per your financial objectives, time horizon, and risk appetite.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://wa.me/+919990243143?text=How%20to%20choose%20a%20mutual%20fund%20scheme%20?"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ripple px-6 py-3.5 rounded-xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#20ba59] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                <span>Chat on WhatsApp &rarr;</span>
              </a>
              <button
                onClick={() => openLeadModal('Blog: Choose Mutual Fund 2026')}
                className="btn-ripple px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-[#032e92] hover:bg-blue-50 shadow-lg transition-all cursor-pointer"
              >
                Book Consultation
              </button>
            </div>
          </div>

        </div>
      </article>
    );
  }


  // 2. If blog is SIF vs Mutual Funds (id: 1 or matching slug)
  if (blog?.id === 1 || blog?.slug === 'sif-vs-mutual-funds') {
    return (
      <article className="bg-white pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-gray-700 text-[17px] leading-[1.85]">

          {/* Lead Paragraph */}
          <div className="text-xl sm:text-[22px] font-medium text-[#0a192f] leading-relaxed mb-10 border-l-4 border-[#032e92] pl-5 py-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-3">
              What’s the Difference between SIF and Mutual Funds?
            </h2>
            <p className="m-0 text-gray-700 text-lg sm:text-xl font-normal leading-relaxed">
              When it comes to investing, mutual funds have long been a popular choice for Indian investors. But with the introduction of <strong>Specialized Investment Funds (SIFs)</strong>, investors now have another option that sits between traditional mutual funds and portfolio management services (PMS).
            </p>
          </div>

          <p className="mb-6">
            While both SIFs and mutual funds pool money from multiple investors and are managed by professional fund managers, they differ in areas such as <strong>investment strategies, minimum investment, risk, flexibility, and regulatory framework</strong>.
          </p>

          <p className="mb-10">
            Understanding these differences can help investors assess which option may be more suitable for their investment goals, risk appetite, and portfolio needs. In this article, we compare SIFs vs mutual funds and look at their key features, benefits, risks, costs, and other important factors.
          </p>

          {/* Section 1: Why Were SIFs Introduced? */}
          <div className="mt-12 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-6 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
              Why Were SIFs Introduced?
            </h2>

            <p className="mb-4">
              SIFs were introduced because SEBI saw a gap between mutual funds and PMS.
            </p>
            <p className="mb-6">
              The easiest way to understand this gap is to look at what investors already had.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              {/* Mutual Funds Framework */}
              <div className="bg-[#f8faff] rounded-3xl p-7 border border-blue-100/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#032e92] flex items-center justify-center font-bold text-sm">
                      1
                    </span>
                    <h3 className="text-xl font-extrabold text-[#0a192f]">Mutual Funds Framework</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Mutual funds allow investors to pool their money and invest through a professional fund manager, but in a specific investment framework. <strong>Unhedged positions in derivatives are not allowed</strong> in mutual funds.
                  </p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#032e92] text-xs font-bold w-fit">
                  Entry: From ₹500
                </div>
              </div>

              {/* PMS Framework */}
              <div className="bg-[#f8faff] rounded-3xl p-7 border border-blue-100/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      2
                    </span>
                    <h3 className="text-xl font-extrabold text-[#0a192f]">Portfolio Management Services (PMS)</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    On the other end, there is PMS (Portfolio management Service). PMS allows the portfolio manager more freedom with the use of derivatives and to decide what to buy and sell for the investor. But the entry point to PMS is much higher and requires a <strong>minimum investment of ₹50 lakh</strong>. These advanced investment strategies are aimed at enhancing potential returns for the investors.
                  </p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold w-fit">
                  Entry: Min ₹50 Lakh
                </div>
              </div>
            </div>

            <p className="mb-4">
              This created a gap between mutual funds and PMS. Some investors wanted more flexibility in their investments, but ₹50 lakh was a much higher entry point.
            </p>

            <div className="bg-[#eef4ff] border-l-4 border-[#032e92] p-5 rounded-r-2xl my-6">
              <p className="text-base text-gray-800 font-medium leading-relaxed m-0">
                <strong>This is where Specialized Investment Funds (SIFs) were introduced</strong> — giving investors access to more flexible investment strategies, while keeping the minimum investment at <strong>₹10 lakh</strong>.
              </p>
            </div>
          </div>

          {/* Section 2: How Do Specialized Investment Funds (SIFs) Work? */}
          <div className="mt-14 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-6 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faArrowsRotate} />
              </span>
              How Do Specialized Investment Funds (SIFs) Work?
            </h2>

            <p className="mb-4">
              SIFs bring a wider range of investment strategies into the mutual fund structure.
            </p>
            <p className="mb-6">
              Instead of being limited to conventional long-only investing, SIFs can use strategies such as <strong>long-short equity</strong>, <strong>equity ex-top 100 long-short</strong>, <strong>hybrid long-short</strong>, and more.
            </p>

            <div className="space-y-5 my-8">
              {/* Strategy 1: Equity Long-Short */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-[#032e92]/40 transition-all">
                <h3 className="text-lg font-bold text-[#032e92] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]" />
                  Equity Long-Short
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 m-0">
                  The fund can go long on stocks it finds attractive, and short stocks through futures and options if it expects that stock to underperform. For instance, if the manager prefers HDFC Bank over ICICI Bank, the fund could go long HDFC Bank and short ICICI Bank. The trade is then driven by the expected relative performance of the two stocks, rather than simply by whether the overall market goes up.
                </p>
              </div>

              {/* Strategy 2: Equity Ex-Top 100 Long-Short */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-[#032e92]/40 transition-all">
                <h3 className="text-lg font-bold text-[#032e92] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]" />
                  Equity Ex-Top 100 Long-Short
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 m-0">
                  Here, the idea is to invest in companies outside the top 100 by market capitalisation. This gives the manager access to a broader mid- and small-cap universe while retaining the ability to take both long and short positions. For example, the manager could go long on a mid-cap company with strong earnings prospects and short another company where valuations appear stretched.
                </p>
              </div>

              {/* Strategy 3: Hybrid Long-Short */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-[#032e92]/40 transition-all">
                <h3 className="text-lg font-bold text-[#032e92] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#032e92]" />
                  Hybrid Long-Short
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 m-0">
                  This combines equity and debt exposure with the ability to take long and short positions. For example, the manager can buy shares of companies that are expected to grow, while using other positions, like short or hedge to protect the portfolio if the market falls.
                </p>
              </div>
            </div>

            {/* Other Strategies Links Card */}
            <div className="bg-[#f8faff] rounded-2xl p-6 border border-blue-100 my-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                See other strategies here:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Active Asset Allocator Long-Short Fund",
                  "Sector Rotation Long-Short Fund",
                  "Debt Long-Short Fund",
                  "Sectoral Debt Long-Short Fund",
                ].map((strat) => (
                  <Link
                    key={strat}
                    to="/sif"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-[#032e92] hover:bg-blue-50 hover:border-blue-200 shadow-2xs transition-all"
                  >
                    <span>{strat}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: How are SIFs different from Mutual Funds? */}
          <div className="mt-14 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-6 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faArrowsUpDown} />
              </span>
              How are SIFs different from Mutual Funds?
            </h2>

            <p className="mb-8">
              Here are 4 key differences between SIFs and traditional Mutual Funds:
            </p>

            {/* Difference 1: Entry point */}
            <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#032e92] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                Entry point
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#eef4ff] rounded-2xl p-5 border border-blue-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#032e92] block mb-1">
                    SIF
                  </span>
                  <p className="text-2xl font-black text-[#032e92] mb-1">₹10 Lakh</p>
                  <p className="text-xs text-gray-600 m-0">Minimum investment required.</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Mutual Fund
                  </span>
                  <p className="text-2xl font-black text-gray-800 mb-1">From ₹500</p>
                  <p className="text-xs text-gray-600 m-0">Can start from ₹500 through SIP or around ₹5,000 through lump sum, depending on the scheme.</p>
                </div>
              </div>
            </div>

            {/* Difference 2: Potential of better risk adjusted returns */}
            <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#032e92] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                Potential of better risk adjusted returns
              </h3>

              <p className="mb-3 text-sm sm:text-base leading-relaxed">
                Suppose an SIF holds <strong>₹1 crore in Nifty 50 stocks</strong>. The fund manager expects a short-term market fall but still wants to keep the stocks.
              </p>
              <p className="mb-4 text-sm sm:text-base leading-relaxed">
                The manager can use derivatives and sell Nifty 50 futures to protect the portfolio from the market downfall.
              </p>
              <p className="mb-5 text-sm sm:text-base font-semibold text-gray-800">
                For simplicity, assume the manager hedges ₹50 lakh of the ₹1 crore equity exposure.
              </p>

              {/* Table for Risk Adjusted Returns Example */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs my-6">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#032e92] text-white">
                      <th className="py-3.5 px-4 font-bold">Market movement</th>
                      <th className="py-3.5 px-4 font-bold bg-[#021d63]">
                        Without hedge:<br /><span className="text-xs font-normal text-blue-200">₹1 Cr stocks</span>
                      </th>
                      <th className="py-3.5 px-4 font-bold bg-[#032e92]">
                        With hedge:<br /><span className="text-xs font-normal text-blue-200">₹1 Cr stocks + ₹50 Lakh short Nifty futures</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-red-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Market falls 10%</td>
                      <td className="py-3.5 px-4 text-red-600 font-semibold bg-gray-50/50">
                        −₹10 lakh <span className="text-gray-700 block text-xs">→ ₹90 lakh</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-semibold bg-blue-50/30">
                        Stocks −₹10 lakh + futures +₹5 lakh <span className="text-[#032e92] block font-bold text-xs">→ ₹95 lakh</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Market stays flat</td>
                      <td className="py-3.5 px-4 text-gray-700 font-semibold bg-gray-50/50">
                        ₹0 gain/loss <span className="text-gray-700 block text-xs">→ ₹1 Cr</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-semibold bg-blue-50/30">
                        Stocks ₹0 + futures ₹0 <span className="text-[#032e92] block font-bold text-xs">→ ₹1 Cr</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-green-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Market rises 10%</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-semibold bg-gray-50/50">
                        +₹10 lakh <span className="text-gray-700 block text-xs">→ ₹1.10 Cr</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-semibold bg-blue-50/30">
                        Stocks +₹10 lakh − futures ₹5 lakh <span className="text-[#032e92] block font-bold text-xs">→ ₹1.05 Cr</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                That is what hedging means here: the derivative position moves in the opposite direction to the investment, helping offset part of the loss.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                SEBI’s SIF framework permits derivatives for hedging and portfolio rebalancing, and also permits specified unhedged short exposure.
              </p>
              <p className="text-xs text-gray-500 italic m-0">
                <strong>Disclaimer:</strong> This example uses a 50% hedge purely to explain the mechanism. The actual hedge ratio, derivative used, timing and outcome depend on the SIF’s investment strategy.
              </p>
            </div>

            {/* Difference 3: Limiting drawdowns in bear markets */}
            <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#032e92] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                Limiting drawdowns in bear markets
              </h3>

              <p className="mb-4 text-sm sm:text-base leading-relaxed">
                Limiting drawdowns in bear markets means trying to make the portfolio fall less when the market is falling.
              </p>
              <p className="mb-5 text-sm sm:text-base leading-relaxed font-semibold text-gray-800">
                Here is a simple example using the same ₹1 crore portfolio:
              </p>

              {/* Table for Drawdown Limiting Example */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs my-6">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#032e92] text-white">
                      <th className="py-3.5 px-4 font-bold">Market situation</th>
                      <th className="py-3.5 px-4 font-bold bg-[#021d63]">Without hedge</th>
                      <th className="py-3.5 px-4 font-bold bg-[#032e92]">With a 50% hedge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Portfolio before fall</td>
                      <td className="py-3.5 px-4 text-gray-700 font-semibold bg-gray-50/50">₹1 crore</td>
                      <td className="py-3.5 px-4 text-[#032e92] font-semibold bg-blue-50/30">₹1 crore</td>
                    </tr>
                    <tr className="hover:bg-red-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Market falls 20%</td>
                      <td className="py-3.5 px-4 text-red-600 font-semibold bg-gray-50/50">₹80 lakh</td>
                      <td className="py-3.5 px-4 text-gray-700 bg-blue-50/30">
                        ₹80 lakh from stocks
                      </td>
                    </tr>
                    <tr className="hover:bg-green-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Gain from ₹50 lakh short Nifty futures</td>
                      <td className="py-3.5 px-4 text-gray-400 bg-gray-50/50">—</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-bold bg-blue-50/30">+₹10 lakh</td>
                    </tr>
                    <tr className="hover:bg-blue-50/40 transition-colors bg-blue-50/20 font-bold">
                      <td className="py-3.5 px-4 text-gray-900">Portfolio after fall</td>
                      <td className="py-3.5 px-4 text-gray-800 bg-gray-50/50">₹80 lakh</td>
                      <td className="py-3.5 px-4 text-[#032e92] bg-blue-50/30 text-base">₹90 lakh</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors font-bold">
                      <td className="py-3.5 px-4 text-gray-900">Drawdown</td>
                      <td className="py-3.5 px-4 text-red-600 bg-gray-50/50">−20%</td>
                      <td className="py-3.5 px-4 text-emerald-700 bg-blue-50/30 text-base">−10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed m-0">
                That is the basic idea behind limiting drawdowns — the hedge acts as a cushion during a market fall. This does not mean every SIF will limit every bear-market loss. The actual result depends on the strategy, hedge size, instrument, timing and how closely the hedge moves with the portfolio.
              </p>
            </div>

            {/* Difference 4: Potential to make return in any market */}
            <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#032e92] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </span>
                Potential to make return in any market
              </h3>

              <p className="mb-4 text-sm sm:text-base leading-relaxed">
                SIF strategies can seek opportunities in rising, falling and sideways markets by using long and short positions.
              </p>
              <p className="mb-5 text-sm sm:text-base leading-relaxed font-semibold text-gray-800">
                Assume the SIF manager has ₹1 crore and uses ₹50 lakh in Nifty futures to take a market view. These numbers are purely illustrative:
              </p>

              {/* Table for Return in Any Market */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs my-6">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#032e92] text-white">
                      <th className="py-3.5 px-4 font-bold">Market condition</th>
                      <th className="py-3.5 px-4 font-bold">Manager’s action</th>
                      <th className="py-3.5 px-4 font-bold">What happens</th>
                      <th className="py-3.5 px-4 font-bold bg-[#021d63] text-cyan-200">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-green-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Market rises 10%</td>
                      <td className="py-3.5 px-4 text-gray-700">Takes a long Nifty futures position of ₹50 lakh</td>
                      <td className="py-3.5 px-4 text-gray-700">Nifty rises → futures position gains</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-extrabold bg-blue-50/30">+₹5 lakh</td>
                    </tr>
                    <tr className="hover:bg-red-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">Market falls 10%</td>
                      <td className="py-3.5 px-4 text-gray-700">Takes a short Nifty futures position of ₹50 lakh</td>
                      <td className="py-3.5 px-4 text-gray-700">Nifty falls → short position gains</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-extrabold bg-blue-50/30">+₹5 lakh</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Now assuming that the markets are <strong>sideways</strong> (Prices keep moving up and down within a range, without a clear overall rise or fall). The fund manager believes that Bank A will rise 5% while Bank B will fall 5%, he could potentially profit by being <strong>long Bank A and short Bank B</strong>.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed m-0">
                That is what “potential to make returns in different market conditions” actually means. It means the manager has more ways to express an investment view than simply buying an asset and waiting for its price to rise.
              </p>
            </div>
          </div>

          {/* Section 4: Mutual Fund or SIF: Which One Is Right for You? */}
          <div className="mt-14 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faShieldHalved} />
              </span>
              Mutual Fund or SIF: Which One Is Right for You?
            </h2>

            {/* Infographic Image */}
            <div className="my-8 rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white">
              <img
                src={sifVsMfInfographic}
                alt="Mutual Funds vs Specialized Investment Funds (SIF)"
                className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-500"
              />
            </div>

            <p className="mb-6 font-medium text-gray-800">
              Not sure whether you should invest in a mutual fund or a SIF? Let us help you get clarity on this.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              {/* Mutual Fund Checklist */}
              <div className="bg-emerald-50/40 border border-emerald-200 rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                    MF
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-emerald-950">Mutual Fund</h3>
                    <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">A Mutual Fund is better for you if:</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  {[
                    "You want to start investing with a smaller amount.",
                    "You are new to investing and prefer familiar investment plans.",
                    "You mainly want to participate when the market grows (not when it falls).",
                    "You want diversification across stocks rather than derivatives.",
                    "You want to invest in traditional equity, debt or hybrid strategies.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 mt-1 flex-shrink-0 text-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SIF Checklist */}
              <div className="bg-blue-50/40 border border-blue-200 rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#032e92] text-white flex items-center justify-center text-sm font-bold">
                    SIF
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0a192f]">SIF</h3>
                    <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider">An SIF is better for you if:</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  {[
                    "You can invest ₹10 lakh or more in SIF strategies.",
                    "You are comfortable with the fund taking short positions when the strategy allows it.",
                    "You want to benefit even when some stocks or sectors are expected to fall.",
                    "You already have traditional investments and want to add a different type of strategy to my portfolio.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] mt-1 flex-shrink-0 text-sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mb-4">
              Choosing between a mutual fund and SIF is not about finding which one is better. It is about finding which one <strong>fits your investment needs</strong>.
            </p>
            <p className="mb-6">
              Before making a decision, look at your investment goals, time horizon, existing portfolio and risk appetite. Ask yourself:
            </p>

            <div className="bg-gray-50 rounded-3xl p-7 border border-gray-200/80 my-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium text-gray-800">
                {[
                  "How much money can you invest?",
                  "For how long can you stay invested?",
                  "Will you need this money in the next 5 years?",
                  "What are you investing for?",
                  "What is your risk appetite?",
                  "How much loss can you comfortably handle if markets fall?",
                  "Do you need regular income from this investment?",
                ].map((q, i) => (
                  <div key={i} className={`flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm ${i === 6 ? 'sm:col-span-2' : ''}`}>
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-[#032e92] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 mb-4">
              Once you have answers to these questions, the choice between a mutual fund and SIF becomes much clearer.
            </p>
          </div>

          {/* Section 5: Should you invest in only one (Mutual Fund or SIF) or both? */}
          <div className="mt-14 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-6 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                <FontAwesomeIcon icon={faScaleUnbalancedFlip} />
              </span>
              Should you invest in only one (Mutual Fund or SIF) or both?
            </h2>

            <p className="mb-4">
              You usually don’t need to invest in both. Start with the product that matches your objectives and risk tolerance.
            </p>
            <p className="mb-4">
              If the goal is to build long-term wealth through a diversified portfolio, a Mutual Fund can be sufficient. If you have ₹10 lakh or more available to invest and you are comfortable with market movements in either direction, you can consider a SIF.
            </p>
            <p className="mb-6">
              You can consider investing in both mutual funds and SIF when they have different roles in your portfolio. For example, you could use Mutual Funds for my core long-term goals and add a SIF for a specific strategy that fits your risk profile and a different investment objective.
            </p>

            <div className="bg-[#f0fdf4] border-l-4 border-emerald-600 p-5 rounded-r-2xl my-6">
              <p className="text-base text-gray-800 font-semibold leading-relaxed m-0">
                So the real questions would be: <br />
                <span className="font-normal text-gray-700">What is the goal? How much do you want to invest? How long can you stay invested? How much risk can you take?</span>
              </p>
            </div>

            <p className="mb-4">
              Once these things are clear, choosing between MF, SIF, or a combination becomes much more straightforward.
            </p>
            <p className="mb-4">
              And if you are still unsure, speak with us at KNAPS{" "}
              <a
                href="https://wa.me/+919990243143?text=I%20want%20to%20understand%20difference%20between%20Mutual%20Funds%20and%20SIFs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600 text-sm" />
                <span>(whatsapp)</span>
              </a>{" "}
              who can guide you based on your personal objectives and financial situation.
            </p>
          </div>

          {/* Inspirational Quote */}
          <blockquote className="relative p-8 sm:p-10 bg-gradient-to-r from-blue-50/50 via-gray-50 to-blue-50/50 rounded-3xl border border-blue-100/80 my-12 text-center shadow-sm">
            <FontAwesomeIcon icon={faQuoteLeft} className="absolute top-6 left-8 text-3xl text-blue-200" />
            <p className="relative z-10 text-xl sm:text-2xl text-[#0a192f] font-bold italic leading-relaxed m-0">
              “The right investment is not the one that sounds more advanced. It is the one that fulfills your goals.”
            </p>
          </blockquote>

          {/* KNAPS Consultation Callout Box */}
          <div className="bg-gradient-to-br from-[#032e92] to-[#021d63] text-white p-8 sm:p-10 rounded-3xl shadow-xl my-12">
            <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2">
              <FontAwesomeIcon icon={faCompass} />
              <span>Expert Financial Guidance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Speak with a KNAPS Advisor
            </h3>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
              Get personalized clarity on which type of investment works best as per your financial objectives, time horizon, and risk appetite.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => openLeadModal("Blog: SIF vs Mutual Funds")}
                className="btn-ripple px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-[#032e92] hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                Schedule Free Consultation
              </button>
              <a
                href="https://wa.me/+919990243143?text=I%20want%20to%20understand%20difference%20between%20Mutual%20Funds%20and%20SIFs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ripple px-6 py-3.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </article>
    );
  }

  // 3. Generic fallback article template for other blogs
  return (
    <article className="bg-white pb-20 pt-4">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-gray-700 text-[17px] leading-[1.85]">
        <p className="text-xl sm:text-[22px] font-medium text-[#0a192f] leading-relaxed mb-8 border-l-4 border-[#032e92] pl-5 py-1">
          {blog?.description}
        </p>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mt-12 mb-6">
          1. Understanding the Core Principles
        </h2>
        <p className="mb-6">
          In today’s dynamic financial landscape, having a well-structured approach is fundamental to long-term wealth accumulation and risk mitigation. Successful financial planning requires a deep understanding of macroeconomic trends, risk tolerance, and consistent discipline.
        </p>

        <div className="bg-[#eef5ff] border-l-4 border-[#032e92] p-6 rounded-r-2xl my-8">
          <div className="flex items-center gap-2.5 mb-2 text-[#032e92] font-bold text-base">
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Key Takeaway</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed m-0">
            Disciplined execution and asset diversification remain the most effective shields against short-term market turbulence. Rebalance periodically to ensure alignment with your financial milestones.
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mt-12 mb-6">
          2. Strategic Execution and Best Practices
        </h2>
        <p className="mb-6">
          Whether constructing a retirement corpus, diversifying into specialized funds, or optimizing tax liabilities, taking an informed approach with proper advisory oversight helps avoid common behavioral traps such as panic selling or market timing.
        </p>

        <blockquote className="relative p-8 sm:p-10 bg-gray-50 rounded-3xl border border-gray-100 my-10 text-center">
          <FontAwesomeIcon icon={faQuoteLeft} className="absolute top-6 left-8 text-3xl text-gray-300" />
          <p className="relative z-10 text-xl text-[#0a192f] font-semibold italic leading-relaxed m-0">
            "Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas."
          </p>
          <footer className="mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">— Paul Samuelson</footer>
        </blockquote>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mt-12 mb-6">
          3. Partnering with the Right Advisors
        </h2>
        <p className="mb-8">
          At KNAPS, our dedicated team of AMFI-registered mutual fund advisors guides you through every step of your financial roadmap, customizing allocations to match your time horizon, risk profile, and future goals.
        </p>

        <div className="text-center my-10">
          <button
            onClick={() => openLeadModal(`Blog: ${blog?.title}`)}
            className="btn-ripple px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all cursor-pointer"
          >
            Speak with an Advisor
          </button>
        </div>
      </div>
    </article>
  );
}
