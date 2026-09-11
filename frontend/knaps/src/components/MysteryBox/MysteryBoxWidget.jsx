import React, { useState, useEffect, useRef } from 'react'
import lottie from 'lottie-web/build/player/lottie_light'
import giftBoxAnimationData from '../../assets/Gift Box White.json'
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
  const lottieContainerRef = useRef(null)
  const animRef = useRef(null)

  // Initialize Lottie Animation
  useEffect(() => {
    if (!lottieContainerRef.current) return

    animRef.current = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: giftBoxAnimationData,
    })

    // Start at frame 0 (resting idle)
    animRef.current.goToAndStop(0, true)

    return () => {
      animRef.current?.destroy()
    }
  }, [])

  // Idle Attention Struggle / Wobble Animation (plays every 3.2s when closed)
  useEffect(() => {
    if (isOpened) return

    const playWobble = () => {
      if (animRef.current && !isOpened) {
        animRef.current.playSegments([0, 35], true)
      }
    }

    playWobble()
    const interval = setInterval(playWobble, 3200)
    return () => clearInterval(interval)
  }, [isOpened])

  // Trigger Open Sequence: Lid flies open and stays open
  const handleOpen = () => {
    setIsOpened(true)
    if (animRef.current) {
      animRef.current.playSegments([35, 55], true)
    }
  }

  // Trigger Close Sequence: Lid closes back down smoothly
  const handleClose = () => {
    setIsOpened(false)
    if (animRef.current) {
      animRef.current.playSegments([119, 142], true)
    }
  }

  // Quick playful wobble on hover when closed
  const handleHover = () => {
    if (!isOpened && animRef.current) {
      animRef.current.playSegments([0, 35], true)
    }
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
      {/* 3D Box Embedded CSS Styles (Clean & Tag-Free) */}
      <style>{`
        /* Smooth subtle pulse for ambient light */
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
      `}</style>

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

      {/* 2. Compact 3D Gift Box & Animated Spheres Layer (Fixed Bottom-Left with high z-index) */}
      <div className="fixed bottom-10 left-6 sm:bottom-12 sm:left-8 z-[10000] pointer-events-none flex flex-col items-center select-none">
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
          onMouseEnter={handleHover}
          className={`gift-box-trigger ${!isOpened ? 'pointer-events-auto cursor-pointer hover:scale-110' : 'pointer-events-none'} w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center relative transition-transform duration-300`}
        >
          {/* Ambient idle magical pulse glow */}
          {!isOpened && (
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 -m-3 rounded-full bg-gradient-to-tr from-blue-600/35 via-cyan-400/25 to-amber-400/25 blur-xl pointer-events-none"
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

          {/* Animated Gift Box (Lottie Vector Animation sized prominently) */}
          <div
            ref={lottieContainerRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[245px] h-[144px] sm:w-[285px] sm:h-[168px] flex items-center justify-center pointer-events-none z-20 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
          />
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
              {/* Continuous Ambient Floating & Hover Pulse */}
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
