import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck, faArrowRight, faArrowLeft, faRotateRight,
  faClock, faChartLine, faPhone, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
import { useLeadModal } from '../context/LeadModalContext'

const quizQuestions = [
  {
    id: 1,
    question: 'What matters most to you when you invest?',
    options: [
      { key: 'A', text: 'Keeping my money safe', score: 1 },
      { key: 'B', text: 'Regular income', score: 2 },
      { key: 'C', text: 'Growing my money over time', score: 3 },
      { key: 'D', text: 'I’m not sure', score: 1 },
    ],
  },
  {
    id: 2,
    question: 'Do you already invest in mutual funds?',
    options: [
      { key: 'A', text: 'No, not yet', score: 1 },
      { key: 'B', text: 'Yes, through SIPs', score: 2 },
      { key: 'C', text: 'Yes, through lump-sum investments', score: 3 },
      { key: 'D', text: 'Yes, through both SIPs and lump sums', score: 3 },
    ],
  },
  {
    id: 3,
    question: 'How do you balance risk and return?',
    options: [
      { key: 'A', text: 'I prefer lower risk, even if returns may be lower', score: 1 },
      { key: 'B', text: 'I want a balance between risk and return', score: 2 },
      { key: 'C', text: 'I’m willing to take more risk for higher return potential', score: 3 },
      { key: 'D', text: 'I’m not sure', score: 1 },
    ],
  },
  {
    id: 4,
    question: 'What size of investment are you considering?',
    options: [
      { key: 'A', text: 'Less than ₹10 lakh', score: 1, ticketWarning: true },
      { key: 'B', text: '₹10 - 25 lakh', score: 3 },
      { key: 'C', text: '₹25 lakh or more', score: 3 },
      { key: 'D', text: 'I haven’t decided yet', score: 2 },
    ],
  },
  {
    id: 5,
    question: 'What is your investment time frame?',
    options: [
      { key: 'A', text: '1 - 3 years', score: 1 },
      { key: 'B', text: '3 - 5 years', score: 2 },
      { key: 'C', text: '5 - 10 years', score: 3 },
      { key: 'D', text: '10+ years', score: 3 },
    ],
  },
]

export default function WhyChoose() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { openLeadModal } = useLeadModal()

  const [quizState, setQuizState] = useState('intro') // 'intro' | 'question' | 'result'
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})

  const handleSelectOption = (qId, opt) => {
    setAnswers((prev) => ({ ...prev, [qId]: opt }))

    // Smooth automatic advance after short visual feedback
    setTimeout(() => {
      if (currentIdx < quizQuestions.length - 1) {
        setCurrentIdx((prev) => prev + 1)
      } else {
        setQuizState('result')
      }
    }, 280)
  }

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1)
    } else {
      setQuizState('intro')
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setCurrentIdx(0)
    setQuizState('intro')
  }

  const currentQ = quizQuestions[currentIdx]
  const progressPct = ((currentIdx + 1) / quizQuestions.length) * 100

  // Result assessment
  const isLessThan10L = answers[4]?.key === 'A'
  const isHighMatch = !isLessThan10L

  return (
    <section id="why-choose" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Original Clean Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            🧠 Know Before You Invest
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Is SIF the <span className="gradient-text">right investment for you?</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Thinking about SIF? Before making a decision, see if SIF matches your investment goals.
          </p>
        </motion.div>

        {/* Interactive Quiz Container */}
        <div className="bg-[#f8faff] border border-[#e2e8f5] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-blue-900/5 relative">
          <AnimatePresence mode="wait">
            {/* 1. INTRO / START SCREEN */}
            {quizState === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6 sm:py-8"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#032e92] to-[#0a4fd4] text-white flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-blue-900/20 mb-6">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Find Out if SIF Fits Your Portfolio
                </h3>
                <p className="text-gray-600 font-medium max-w-xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
                  Answer 5 quick questions to evaluate whether Specialized Investment Funds (SIF) align with your financial goals, risk appetite, and investment horizon.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => {
                      setCurrentIdx(0)
                      setQuizState('question')
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#032e92] hover:bg-[#021d63] text-white font-bold text-base shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Start Quiz</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 mt-4">
                  <FontAwesomeIcon icon={faClock} className="text-[#032e92]" />
                  <span>Takes only ~ 3 mins</span>
                </div>
              </motion.div>
            )}

            {/* 2. QUESTION SCREEN */}
            {quizState === 'question' && (
              <motion.div
                key={`q-${currentIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="py-2"
              >
                {/* Quiz Header & Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-500 mb-2">
                    <span className="text-[#032e92] font-extrabold uppercase tracking-wider">
                      Question {currentIdx + 1} of {quizQuestions.length}
                    </span>
                    <span>{Math.round(progressPct)}% Completed</span>
                  </div>
                  <div className="w-full bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-[#032e92] to-[#0948cd] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Question Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options Grid (Clicking an option automatically transitions to next question) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id]?.key === opt.key
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt)}
                        className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer ${
                          isSelected
                            ? 'bg-[#032e92] border-[#032e92] text-white shadow-lg shadow-blue-900/15 ring-2 ring-[#032e92]/30 scale-[1.02]'
                            : 'bg-white border-gray-200 hover:border-[#032e92]/50 hover:bg-blue-50/40 text-gray-800 shadow-sm hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-[#eef4ff] group-hover:text-[#032e92]'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className={`text-sm sm:text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {opt.text}
                          </span>
                        </div>

                        {isSelected && (
                          <FontAwesomeIcon icon={faCircleCheck} className="text-white text-lg flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Navigation Bar (Back button only) */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/80">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back</span>
                  </button>

                  <span className="text-xs font-medium text-gray-400">
                    Select an option to proceed
                  </span>
                </div>
              </motion.div>
            )}

            {/* 3. RESULT SCREEN */}
            {quizState === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="py-4"
              >
                <div className="text-center max-w-2xl mx-auto">
                  {/* Result Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm font-bold mb-4">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-green-600" />
                    Assessment Complete
                  </div>

                  {/* Primary Heading */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    {isHighMatch ? (
                      <span>SIF could be a <span className="text-[#032e92]">good investment option</span> for you</span>
                    ) : (
                      <span>Explore SIF for your <span className="text-[#032e92]">future wealth goals</span></span>
                    )}
                  </h3>

                  {/* Highlight Box for ₹10 Lakh Threshold */}
                  <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-md shadow-blue-900/5 mb-6 text-left">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#032e92] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCircleInfo} />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-[#032e92] mb-1">
                          SIF requires a minimum investment of ₹10 lakh.
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                          Based on your answers, SIF is a good choice for you. SIF offers a range of schemes designed for investors looking for advanced strategies to manage their investments.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={openLeadModal}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#c10000] hover:bg-[#9d0000] text-white font-bold text-base shadow-xl shadow-red-900/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Invest Now</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>

                    <button
                      type="button"
                      onClick={openLeadModal}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#032e92] text-[#032e92] font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPhone} />
                      <span>Talk to Us</span>
                    </button>
                  </div>

                  {/* Retake Button */}
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#032e92] transition-colors cursor-pointer py-1"
                  >
                    <FontAwesomeIcon icon={faRotateRight} />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Educational Disclaimer */}
          <div className="mt-8 pt-5 border-t border-gray-200 text-center">
            <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> This quiz is for educational purposes only and does not constitute investment advice or a recommendation. Please consider your investment objectives, risk profile and applicable scheme documents before investing.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}