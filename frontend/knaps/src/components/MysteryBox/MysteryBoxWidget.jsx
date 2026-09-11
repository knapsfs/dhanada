import React, { useState, useEffect } from 'react'
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

// Interactive Modal Components
import RiskProfiler from '../RiskProfiler/RiskProfiler'
import FinanceMythQuiz from '../MythOrFactQuiz/FinanceMythQuiz'
import SifSuitabilityQuiz from '../sif/SifSuitabilityQuiz'

export default function MysteryBoxWidget() {
  const [isOpened, setIsOpened] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // null | 'risk' | 'myth' | 'sif'

  // Trigger Open Sequence
  const handleOpen = () => {
    setIsOpened(true)
  }

  // Trigger Close Sequence
  const handleClose = () => {
    setIsOpened(false)
  }

  const handleSelectOption = (key) => {
    setIsOpened(false)
    setTimeout(() => {
      setActiveModal(key)
    }, 350)
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
        } else if (isOpened) {
          handleClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModal, isOpened])

  const options = [
    {
      id: 'risk',
      title: 'Risk Profiler',
      subtitle: 'Investor Profile',
      tagline: 'Check Now',
      icon: faShieldHalved,
      bgGradient: 'from-[#032e92] via-[#0a4fd4] to-[#0284c7]',
      borderGlow: 'border-blue-300 shadow-[0_0_55px_rgba(37,99,235,0.65)]',
      iconColor: 'text-cyan-300',
      badgeBg: 'bg-blue-950/80 text-blue-200 border-blue-400/40',
      // Trajectory: Vertically centered on the left
      desktopPos: {
        x: ['0vw', '10vw', '18vw'],
        y: ['0vh', '-24vh', '-38vh'],
      },
      mobilePos: {
        x: ['0vw', '10vw', '20vw'],
        y: ['0vh', '-22vh', '-36vh'],
      },
      floatDelay: 0,
      animDelay: 0.22,
    },
    {
      id: 'myth',
      title: 'Myth or Fact?',
      subtitle: 'Finance Quiz',
      tagline: 'Test Your Knowledge',
      icon: faLightbulb,
      bgGradient: 'from-[#d97706] via-[#ea580c] to-[#c10000]',
      borderGlow: 'border-amber-300 shadow-[0_0_55px_rgba(234,88,12,0.65)]',
      iconColor: 'text-amber-200',
      badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-400/40',
      // Trajectory: Vertically centered in the middle (top of the arc)
      desktopPos: {
        x: ['0vw', '26vw', '48vw'],
        y: ['0vh', '-34vh', '-50vh'],
      },
      mobilePos: {
        x: ['0vw', '24vw', '48vw'],
        y: ['0vh', '-32vh', '-48vh'],
      },
      floatDelay: 0.4,
      animDelay: 0.32,
    },
    {
      id: 'sif',
      title: 'Is SIF Right For You?',
      subtitle: 'Suitability Assessment',
      tagline: '5 Quick Questions',
      icon: faCompass,
      bgGradient: 'from-[#059669] via-[#0d9488] to-[#032e92]',
      borderGlow: 'border-emerald-300 shadow-[0_0_55px_rgba(16,185,129,0.65)]',
      iconColor: 'text-emerald-200',
      badgeBg: 'bg-emerald-950/80 text-emerald-200 border-emerald-400/40',
      // Trajectory: Vertically centered on the right
      desktopPos: {
        x: ['0vw', '48vw', '76vw'],
        y: ['0vh', '-24vh', '-38vh'],
      },
      mobilePos: {
        x: ['0vw', '44vw', '72vw'],
        y: ['0vh', '-22vh', '-36vh'],
      },
      floatDelay: 0.8,
      animDelay: 0.42,
    },
  ]

  return (
    <>
      {/* 1. Fullscreen Dimmed Pop-up Backdrop Overlay covering ENTIRE Screen (including Navbar) */}
      <motion.div
        initial={false}
        animate={{
          opacity: isOpened ? 1 : 0,
          pointerEvents: isOpened ? 'auto' : 'none',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl cursor-pointer select-none overflow-hidden"
        onClick={handleClose}
      >
        {/* Ambient Radial Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] rounded-full bg-blue-600/20 blur-[170px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-amber-500/15 blur-[150px] pointer-events-none" />

        {/* Top Header Card */}
        <motion.div
          animate={{
            opacity: isOpened ? 1 : 0,
            y: isOpened ? 0 : -30,
          }}
          transition={{ duration: 0.4, delay: isOpened ? 0.25 : 0 }}
          className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-40 px-4"
        >
          <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm sm:text-base font-bold backdrop-blur-md shadow-2xl mb-1">
            <FontAwesomeIcon icon={faGift} className="text-amber-300 text-base" />
            <span>Click any sphere to open assessment or quiz</span>
          </div>
        </motion.div>

        {/* Close Button Top Right */}
        <motion.button
          type="button"
          onClick={handleClose}
          aria-label="Close interactive hub"
          animate={{
            opacity: isOpened ? 1 : 0,
            scale: isOpened ? 1 : 0.8,
          }}
          transition={{ duration: 0.3, delay: isOpened ? 0.3 : 0 }}
          className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 border border-white/25 flex items-center justify-center text-white/90 hover:text-white backdrop-blur-md transition-all duration-200 pointer-events-auto cursor-pointer shadow-lg hover:rotate-90"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </motion.button>
      </motion.div>

      {/* 2. Mystery Box & Animated Spheres Layer (Fixed Bottom-Left with high z-index) */}
      <div className="fixed bottom-6 left-6 z-[10000] pointer-events-none flex flex-col items-center">
        {/* Mystery Box SVG Container */}
        <motion.div
          animate={{
            opacity: isOpened ? 0 : 1,
            scale: isOpened ? 0.85 : 1,
          }}
          transition={{
            duration: isOpened ? 0.6 : 0.3,
            delay: isOpened ? 0.75 : 0,
            ease: 'easeInOut',
          }}
          onClick={!isOpened ? handleOpen : undefined}
          role="button"
          tabIndex={0}
          aria-label={isOpened ? 'Mystery box opened' : 'Open mystery box'}
          className={`gift-box-trigger ${!isOpened ? 'pointer-events-auto cursor-pointer hover:scale-110' : 'pointer-events-none'} w-20 h-20 sm:w-24 sm:h-24 select-none relative drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-transform duration-300`}
        >
          {/* Ambient idle magical pulse glow around box */}
          {!isOpened && (
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.35, 0.75, 0.35],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-tr from-blue-600/40 via-cyan-400/30 to-amber-400/30 blur-xl pointer-events-none"
            />
          )}

          {/* Warm Magical Light Glow pulsing from inside box when lid opens */}
          <motion.div
            animate={{
              opacity: isOpened ? [0, 1, 0] : 0,
              scale: isOpened ? [0.3, 1.4, 0.8] : 0.2,
            }}
            transition={{
              duration: 1.1,
              delay: isOpened ? 0.05 : 0,
              ease: 'easeOut',
            }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-t from-amber-400 via-yellow-300 to-cyan-300 blur-xl pointer-events-none z-10"
          />

          <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible" role="img">
            <defs>
              {/* 3D Shadows & Lighting Filters */}
              <radialGradient id="box3dGroundShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00081d" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#00081d" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00081d" stopOpacity="0" />
              </radialGradient>

              {/* 3D Box Body Gradient */}
              <linearGradient id="box3dBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#09359e" />
                <stop offset="15%" stopColor="#1a55d4" />
                <stop offset="45%" stopColor="#0a3fae" />
                <stop offset="85%" stopColor="#032578" />
                <stop offset="100%" stopColor="#011548" />
              </linearGradient>

              {/* Vertical Body Highlight */}
              <linearGradient id="box3dBodyHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
              </linearGradient>

              {/* 3D Lid Gradient */}
              <linearGradient id="box3dLidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0b3cb3" />
                <stop offset="15%" stopColor="#2264ed" />
                <stop offset="50%" stopColor="#0e48c4" />
                <stop offset="85%" stopColor="#042c8a" />
                <stop offset="100%" stopColor="#021a5a" />
              </linearGradient>

              {/* 3D Red Velvet Ribbon Body Gradient */}
              <linearGradient id="ribbon3dBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="25%" stopColor="#ef4444" />
                <stop offset="55%" stopColor="#dc2626" />
                <stop offset="85%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>

              {/* 3D Bow Left Loop Gradient */}
              <linearGradient id="bow3dLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="35%" stopColor="#ef4444" />
                <stop offset="75%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>

              {/* 3D Bow Right Loop Gradient */}
              <linearGradient id="bow3dRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="35%" stopColor="#ef4444" />
                <stop offset="75%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>

              {/* Bow Center Knot Radial 3D Gradient */}
              <radialGradient id="bow3dKnotGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="25%" stopColor="#ef4444" />
                <stop offset="70%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#6b1111" />
              </radialGradient>

              {/* Lid Drop Shadow */}
              <linearGradient id="lid3dDropShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00061a" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#00061a" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 3D Ground Shadow */}
            <ellipse cx="250" cy="426" rx="145" ry="18" fill="url(#box3dGroundShadow)" />

            <g className="gift-body">
              {/* Box Base 3D Body */}
              <path
                d="M125 215 H375 V382 C375 404 359 418 338 418 H162 C141 418 125 404 125 382 Z"
                fill="url(#box3dBodyGrad)"
              />

              {/* Top/Side Bevel Specular Highlights */}
              <path
                d="M125 215 H142 V382 C142 398 134 408 125 404 Z"
                fill="#ffffff"
                opacity="0.18"
              />

              {/* Right Side Shadow Depth */}
              <path
                d="M358 215 H375 V382 C375 404 365 418 358 416 Z"
                fill="#00061a"
                opacity="0.45"
              />

              {/* Box Center Ribbon 3D Shadow Edges */}
              <rect x="217" y="215" width="5" height="203" fill="#00061a" opacity="0.4" />
              <rect x="278" y="215" width="6" height="203" fill="#00061a" opacity="0.45" />

              {/* Box Center Ribbon 3D Body */}
              <rect x="222" y="215" width="56" height="203" fill="url(#ribbon3dBodyGrad)" />

              {/* Ribbon Gloss Highlight Sheen */}
              <rect x="232" y="215" width="10" height="203" fill="#ffffff" opacity="0.32" />
              <rect x="246" y="215" width="4" height="203" fill="#ffffff" opacity="0.2" />

              {/* Lid Cast Shadow onto Base */}
              <path d="M125 257 H375 V282 H125 Z" fill="url(#lid3dDropShadow)" />

              {/* Box Lid: Opens smoothly when isOpened is true */}
              <motion.g
                className="gift-lid"
                animate={{
                  transform: isOpened
                    ? 'translate(-105px, -95px) rotate(-46deg)'
                    : 'translate(0px, 0px) rotate(0deg)',
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: '50% 100%',
                }}
              >
                {/* 3D Lid Rim & Bevel */}
                <rect x="110" y="185" width="280" height="72" rx="12" fill="url(#box3dLidGrad)" />
                
                {/* Lid Top Specular Light Rim */}
                <rect x="118" y="187" width="264" height="7" rx="3.5" fill="#ffffff" opacity="0.35" />

                {/* Lid Bottom Underside Shadow */}
                <rect x="110" y="247" width="280" height="10" rx="4" fill="#00081d" opacity="0.5" />

                {/* Lid Ribbon Shadow Underneath */}
                <rect x="217" y="185" width="5" height="72" fill="#00061a" opacity="0.4" />
                <rect x="278" y="185" width="6" height="72" fill="#00061a" opacity="0.45" />

                {/* Lid Center Ribbon */}
                <rect x="222" y="185" width="56" height="72" fill="url(#ribbon3dBodyGrad)" />
                <rect x="232" y="185" width="10" height="72" fill="#ffffff" opacity="0.32" />

                {/* 3D Velvet Bow with Silk Luster */}
                <g>
                  {/* Left Loop Shadow & Body */}
                  <path
                    d="M250 185 C226 184 190 174 190 145 C190 126 206 115 220 122 C241 132 250 159 250 185 Z"
                    fill="url(#bow3dLeftGrad)"
                  />
                  {/* Left Loop Inner Fold Shadow */}
                  <path
                    d="M236 172 C222 170 208 160 208 147 C208 138 216 132 222 136 C232 142 238 157 236 172 Z"
                    fill="#6b1111"
                    opacity="0.8"
                  />
                  {/* Left Loop Specular Shine */}
                  <path
                    d="M222 124 C238 132 246 155 248 180"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.4"
                    fill="none"
                  />

                  {/* Right Loop Shadow & Body */}
                  <path
                    d="M250 185 C274 184 310 174 310 145 C310 126 294 115 280 122 C259 132 250 159 250 185 Z"
                    fill="url(#bow3dRightGrad)"
                  />
                  {/* Right Loop Inner Fold Shadow */}
                  <path
                    d="M264 172 C278 170 292 160 292 147 C292 138 284 132 278 136 C268 142 262 157 264 172 Z"
                    fill="#6b1111"
                    opacity="0.8"
                  />
                  {/* Right Loop Specular Shine */}
                  <path
                    d="M278 124 C262 132 254 155 252 180"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.4"
                    fill="none"
                  />

                  {/* 3D Spherical Bow Knot */}
                  <circle cx="250" cy="185" r="19" fill="url(#bow3dKnotGrad)" />
                  {/* Knot Specular Glint */}
                  <circle cx="244" cy="179" r="5" fill="#ffffff" opacity="0.65" />
                </g>
              </motion.g>
            </g>
          </svg>
        </motion.div>

        {/* 3. The 3 Big Spheres Emerge from Open Box & Settle in the Vertical Center Arc */}
        {options.map((opt) => {
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
          const trajectory = isMobile ? opt.mobilePos : opt.desktopPos

          return (
            <motion.div
              key={opt.id}
              initial={false}
              animate={
                isOpened
                  ? {
                    x: trajectory.x,
                    y: trajectory.y,
                    scale: [0.15, 0.8, 1],
                    opacity: [0, 1, 1],
                    pointerEvents: 'auto',
                  }
                  : {
                    x: trajectory.x[0],
                    y: trajectory.y[0],
                    scale: 0.1,
                    opacity: 0,
                    pointerEvents: 'none',
                  }
              }
              transition={
                isOpened
                  ? {
                    duration: 1.1,
                    delay: opt.animDelay,
                    times: [0, 0.4, 1],
                    ease: ['easeIn', 'easeOut'],
                  }
                  : {
                    duration: 0.3,
                    ease: 'easeInOut',
                  }
              }
              className="absolute z-50 cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: isMobile ? '-80px' : '-120px',
                marginTop: isMobile ? '-80px' : '-120px',
              }}
              onClick={() => handleSelectOption(opt.id)}
            >
              {/* Continuous Ambient Floating & Hover Pulse (starts seamlessly after emergence) */}
              <motion.div
                animate={
                  isOpened
                    ? {
                      y: [0, -12, 0],
                      x: [0, 6, 0],
                    }
                    : { y: 0, x: 0 }
                }
                transition={{
                  duration: 3.6 + opt.floatDelay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: isOpened ? (opt.animDelay + 1.1) : 0,
                }}
                whileHover={{ scale: 1.1, y: -16 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br ${opt.bgGradient} p-4 sm:p-6 text-center text-white border-[3px] sm:border-4 ${opt.borderGlow} shadow-2xl backdrop-blur-2xl group select-none`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/15 border border-white/30 flex items-center justify-center mb-1.5 sm:mb-2.5 text-lg sm:text-2xl lg:text-3xl shadow-lg group-hover:bg-white group-hover:text-gray-900 ${opt.iconColor} transition-all duration-300`}>
                  <FontAwesomeIcon icon={opt.icon} />
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-lg lg:text-xl font-black leading-tight tracking-tight px-1 drop-shadow-lg">
                  {opt.title}
                </h3>

                {/* Subtitle */}
                <p className="text-[10px] sm:text-xs font-semibold text-white/90 mt-0.5 sm:mt-1 hidden sm:block drop-shadow">
                  {opt.subtitle}
                </p>

                {/* Tagline Badge */}
                <div className={`mt-1.5 sm:mt-2.5 px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold ${opt.badgeBg} border shadow-md whitespace-nowrap flex items-center gap-1.5`}>
                  <span>{opt.tagline}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[9px] group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Hover Shimmer Pulse Effect */}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* 4. Dedicated Interactive Popups for the Selected Module */}
      <AnimatePresence>
        {activeModal && (
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
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
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {activeModal === 'risk' && (
                  <RiskProfiler isModal={true} onClose={handleCloseActiveModal} />
                )}
                {activeModal === 'myth' && (
                  <FinanceMythQuiz isModal={true} onClose={handleCloseActiveModal} />
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
