import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faShieldHalved,
  faLightbulb,
  faCompass,
  faArrowRight,
  faGift
} from '@fortawesome/free-solid-svg-icons'

// Interactive Components to render in modal
import RiskProfiler from '../RiskProfiler/RiskProfiler'
import FinanceMythQuiz from '../MythOrFactQuiz/FinanceMythQuiz'
import SifSuitabilityQuiz from '../sif/SifSuitabilityQuiz'

export default function MysteryBoxWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showOptionsPopup, setShowOptionsPopup] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // null | 'risk' | 'myth' | 'sif'

  // Handle Box Click
  const handleBoxClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      // Show options popup after lid starts opening smoothly
      setTimeout(() => {
        setShowOptionsPopup(true)
      }, 500)
    } else {
      setShowOptionsPopup(false)
      setIsOpen(false)
    }
  }

  const handleCloseOptions = () => {
    setShowOptionsPopup(false)
    setIsOpen(false)
  }

  const handleSelectOption = (optionKey) => {
    setShowOptionsPopup(false)
    setIsOpen(false)
    setActiveModal(optionKey)
  }

  const handleCloseActiveModal = () => {
    setActiveModal(null)
  }

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeModal) {
          setActiveModal(null)
        } else if (showOptionsPopup) {
          handleCloseOptions()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModal, showOptionsPopup])

  return (
    <>
      {/* 1. Floating Mystery Box (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-center">
        {/* Animated SVG Gift Box */}
        <div
          onClick={handleBoxClick}
          role="button"
          tabIndex={0}
          aria-label={isOpen ? "Close gift box" : "Open gift box"}
          aria-pressed={isOpen}
          className={`gift-box-trigger ${isOpen ? 'is-open' : ''} w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 cursor-pointer drop-shadow-2xl hover:scale-105 transition-transform duration-200 select-none`}
        >
          <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible" role="img">
            {/* Main Gift Body */}
            <g className="gift-body">
              {/* Box */}
              <path
                d="M125 215 H375 V382 C375 404 359 418 338 418 H162 C141 418 125 404 125 382 Z"
                fill="#032e92"
                className="transition-colors"
              />

              {/* Box Center Ribbon */}
              <rect x="222" y="215" width="56" height="203" fill="#c10000" />

              {/* Lid Group */}
              <g className="gift-lid">
                {/* Lid top */}
                <rect x="110" y="185" width="280" height="72" rx="12" fill="#021d63" />

                {/* Lid Ribbon */}
                <rect x="222" y="185" width="56" height="72" fill="#c10000" />

                {/* Bow */}
                <g fill="#c10000">
                  <path d="M250 185 C226 184 190 174 190 145 C190 126 206 115 220 122 C241 132 250 159 250 185 Z" />
                  <path d="M250 185 C274 184 310 174 310 145 C310 126 294 115 280 122 C259 132 250 159 250 185 Z" />
                  <circle cx="250" cy="185" r="19" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* 2. Options Choice Popup Modal */}
      <AnimatePresence>
        {showOptionsPopup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            onClick={handleCloseOptions}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-100 relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-100/50 blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-red-100/40 blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

              {/* Header */}
              <div className="text-center mb-6 relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#eef4ff] text-[#032e92] mb-3 shadow-inner">
                  <FontAwesomeIcon icon={faGift} className="text-xl text-[#032e92]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Explore SIF
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  Discover more about SIF and find the right next step for you.
                </p>
              </div>

              {/* 3 Buttons */}
              <div className="flex flex-col gap-3 relative z-10">
                {/* 1. Risk Profiler */}
                <button
                  type="button"
                  onClick={() => handleSelectOption('risk')}
                  className="w-full p-4 rounded-2xl border border-gray-200 hover:border-[#032e92] bg-white hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-between group text-left cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center transition-colors">
                      <FontAwesomeIcon icon={faShieldHalved} className="text-base" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#032e92] transition-colors">
                        Risk Profiler
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        Understand your investor risk profile
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 group-hover:text-[#032e92] group-hover:translate-x-1 transition-all text-xs" />
                </button>

                {/* 2. Myth or Fact? */}
                <button
                  type="button"
                  onClick={() => handleSelectOption('myth')}
                  className="w-full p-4 rounded-2xl border border-gray-200 hover:border-[#032e92] bg-white hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-between group text-left cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-colors">
                      <FontAwesomeIcon icon={faLightbulb} className="text-base" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#032e92] transition-colors">
                        Myth or Fact?
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        Test your financial knowledge
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 group-hover:text-[#032e92] group-hover:translate-x-1 transition-all text-xs" />
                </button>

                {/* 3. SIF Suitability */}
                <button
                  type="button"
                  onClick={() => handleSelectOption('sif')}
                  className="w-full p-4 rounded-2xl border border-gray-200 hover:border-[#032e92] bg-white hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-between group text-left cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <FontAwesomeIcon icon={faCompass} className="text-base" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#032e92] transition-colors">
                        Know Is SIF the right investment for you?
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        5 quick questions suitability check
                      </p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 group-hover:text-[#032e92] group-hover:translate-x-1 transition-all text-xs" />
                </button>
              </div>

              {/* Close button */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleCloseOptions}
                  className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors underline cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Dedicated Interactive Popups for the Selected Section */}
      <AnimatePresence>
        {activeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={handleCloseActiveModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8faff] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]" />
                  <span className="text-sm font-bold text-gray-800">
                    {activeModal === 'risk' && 'Investor Risk Profiler'}
                    {activeModal === 'myth' && 'Myth or Fact? Finance Quiz'}
                    {activeModal === 'sif' && 'Is SIF Right For You?'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseActiveModal}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
              </div>

              {/* Modal Body with Scroll */}
              <div className="p-4 sm:p-8 overflow-y-auto flex-1">
                {activeModal === 'risk' && (
                  <RiskProfiler />
                )}

                {activeModal === 'myth' && (
                  <FinanceMythQuiz />
                )}

                {activeModal === 'sif' && (
                  <SifSuitabilityQuiz isModal={true} onClose={handleCloseActiveModal} />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
