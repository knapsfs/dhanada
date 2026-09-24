import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck, faArrowRight, faArrowLeft, faRotateRight,
  faClock, faChartLine, faPhone, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
import { useLeadModal } from '../../context/LeadModalContext'

export const quizQuestions = [
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

export default function SifSuitabilityQuiz({ isModal = false, onClose }) {
  const { openLeadModal } = useLeadModal()
  const [quizState, setQuizState] = useState('intro') // 'intro' | 'question' | 'result'
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})

  const handleSelectOption = (qId, opt) => {
    setAnswers((prev) => ({ ...prev, [qId]: opt }))

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
  const isLessThan10L = answers[4]?.key === 'A'
  const isHighMatch = !isLessThan10L

  return (
    <div className={`w-full ${isModal ? 'p-0' : ''}`}>
      <div className={`bg-[#f8faff] border border-[#e2e8f5] ${isModal ? 'rounded-2xl p-4 sm:p-6 shadow-sm' : 'rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-blue-900/5'} relative`}>
        <AnimatePresence mode="wait">
          {/* 1. INTRO SCREEN */}
          {quizState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`text-center ${isModal ? 'py-1 sm:py-2' : 'py-4 sm:py-6'}`}
            >
              <div className={`mx-auto rounded-2xl bg-gradient-to-br from-[#032e92] to-[#0a4fd4] text-white flex items-center justify-center shadow-lg shadow-blue-900/20 ${
                isModal ? 'w-12 h-12 text-xl mb-3' : 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl mb-6'
              }`}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>

              <h3 className={`font-bold text-gray-900 ${isModal ? 'text-xl sm:text-2xl mb-2' : 'text-2xl sm:text-3xl mb-3'}`}>
                Find Out if SIF Fits Your Portfolio
              </h3>

              <p className={`text-gray-600 font-medium max-w-xl mx-auto ${isModal ? 'text-xs sm:text-sm mb-4 leading-relaxed' : 'text-sm sm:text-base mb-8'}`}>
                Specialized Investment Funds (SIF) offer structured, goal-oriented wealth strategies for high-conviction portfolios. Take this quick 1-minute suitability check.
              </p>

              <div className={`flex items-center justify-center gap-4 ${isModal ? 'mb-4 text-xs' : 'mb-8'}`}>
                <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-xs">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92]" />
                  <span>5 Quick Questions</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-xs">
                  <FontAwesomeIcon icon={faClock} className="text-[#c10000]" />
                  <span>1 Minute</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-xs">
                  <span>Min ₹10 Lakhs</span>
                </div>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto text-left ${isModal ? 'mb-4' : 'mb-8'}`}>
                <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${isModal ? 'p-2.5' : 'p-3.5'}`}>
                  <p className="text-[11px] font-bold text-[#032e92]">Targeted Themes</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">High-conviction strategies</p>
                </div>
                <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${isModal ? 'p-2.5' : 'p-3.5'}`}>
                  <p className="text-[11px] font-bold text-[#032e92]">Disciplined Process</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Structured portfolio execution</p>
                </div>
                <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${isModal ? 'p-2.5' : 'p-3.5'}`}>
                  <p className="text-[11px] font-bold text-[#032e92]">Long-Term Focus</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">For ₹10L+ allocation</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setQuizState('question')}
                className={`rounded-xl bg-[#032e92] hover:bg-[#022169] text-white font-bold shadow-lg shadow-blue-900/20 inline-flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isModal ? 'px-8 py-3 text-xs sm:text-sm' : 'px-10 py-4 text-base'
                }`}
              >
                <span>Start Assessment</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
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
              className={`max-w-2xl mx-auto ${isModal ? 'py-1' : 'py-2'}`}
            >
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="font-bold text-[#032e92]">
                  Question {currentIdx + 1} of {quizQuestions.length}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">
                  {Math.round(progressPct)}% Completed
                </span>
              </div>

              <div className="w-full h-1.5 bg-gray-200/80 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#032e92] to-[#0a4fd4] rounded-full"
                  initial={{ width: `${((currentIdx) / quizQuestions.length) * 100}%` }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <h3 className={`font-bold text-gray-900 leading-snug ${isModal ? 'text-base sm:text-lg mb-3.5' : 'text-lg sm:text-xl lg:text-2xl mb-6'}`}>
                {currentQ.question}
              </h3>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${isModal ? 'mb-4' : 'mb-8'}`}>
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id]?.key === opt.key
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2.5 group cursor-pointer ${
                        isModal ? 'p-3' : 'p-4 sm:p-5 rounded-2xl'
                      } ${
                        isSelected
                          ? 'bg-[#032e92] border-[#032e92] text-white shadow-md shadow-blue-900/15 ring-2 ring-[#032e92]/30 scale-[1.01]'
                          : 'bg-white border-gray-200 hover:border-[#032e92]/50 hover:bg-blue-50/40 text-gray-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 text-gray-600 group-hover:bg-[#eef4ff] group-hover:text-[#032e92]'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                          {opt.text}
                        </span>
                      </div>

                      {isSelected && (
                        <FontAwesomeIcon icon={faCircleCheck} className="text-white text-sm flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200/80">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-1.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back</span>
                </button>

                <span className="text-[11px] font-medium text-gray-400">
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
              transition={{ duration: 0.3 }}
              className={`text-center max-w-xl mx-auto ${isModal ? 'py-1' : 'py-2 sm:py-4'}`}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-3">
                <FontAwesomeIcon icon={faCircleCheck} className="text-green-600" />
                Assessment Complete
              </div>

              <h3 className={`font-extrabold text-gray-900 tracking-tight mb-3 ${isModal ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl mb-4'}`}>
                {isHighMatch ? (
                  <span>SIF could be a <span className="text-[#032e92]">good investment option</span> for you</span>
                ) : (
                  <span>Explore SIF for your <span className="text-[#032e92]">future wealth goals</span></span>
                )}
              </h3>

              <div className={`bg-white rounded-xl border border-blue-100 shadow-sm text-left ${isModal ? 'p-3.5 mb-4' : 'p-5 mb-6'}`}>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#eef4ff] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#032e92] mb-0.5">
                      SIF requires a minimum investment of ₹10 lakh.
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-medium">
                      Based on your answers, SIF is a strong match. SIF offers regulated schemes designed for investors seeking structured, high-conviction wealth strategies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose()
                    openLeadModal()
                  }}
                  className={`rounded-xl bg-[#c10000] hover:bg-[#9d0000] text-white font-bold shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    isModal ? 'px-6 py-2.5 text-xs sm:text-sm' : 'px-8 py-3.5 text-base'
                  }`}
                >
                  <span>Invest Now</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose()
                    openLeadModal()
                  }}
                  className={`rounded-xl bg-white hover:bg-gray-50 border-2 border-[#032e92] text-[#032e92] font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    isModal ? 'px-6 py-2.5 text-xs sm:text-sm' : 'px-8 py-3.5 text-base'
                  }`}
                >
                  <FontAwesomeIcon icon={faPhone} className="text-xs" />
                  <span>Talk to Us</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#032e92] transition-colors cursor-pointer py-1"
              >
                <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
                <span>Retake Quiz</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`border-t border-gray-200 text-center ${isModal ? 'mt-3 pt-2' : 'mt-6 pt-4'}`}>
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
            <strong>Disclaimer:</strong> This quiz is for educational purposes only and does not constitute investment advice.
          </p>
        </div>
      </div>
    </div>
  )
}
