'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CoverPage from './pages/CoverPage'
import IntroductionPage from './pages/IntroductionPage'
import CouponPage from './pages/CouponPage'
import FinalPage from './pages/FinalPage'
import MemoriesGallery from './pages/MemoriesGallery'
import DateNightPage from './pages/DateNightPage'
import DateNightAdventureBook from './pages/DateNightAdventureBook'
import HubPage from './pages/HubPage'
import { coupons } from '@/data/coupons'
import { clearAllRedeemedCoupons } from '@/utils/storage'

const TOTAL_PAGES = 2 + coupons.length + 1 // Cover + Intro + Coupons + Final

export default function Book() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showHub, setShowHub] = useState(true)
  const [showGallery, setShowGallery] = useState(false)
  const [showDateNight, setShowDateNight] = useState(false)
  const [showAdventureBook, setShowAdventureBook] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentPage < TOTAL_PAGES - 1) {
      goToNextPage()
    }
    if (isRightSwipe && currentPage > 0) {
      goToPreviousPage()
    }
  }

  const goToNextPage = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsFlipping(false)
      }, 300)
    }
  }, [currentPage, isFlipping])

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setIsFlipping(false)
      }, 300)
    }
  }, [currentPage, isFlipping])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Reset all redeemed coupons with Ctrl+Shift+R (or Cmd+Shift+R on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        clearAllRedeemedCoupons()
        window.location.reload()
        return
      }
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPreviousPage()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToNextPage, goToPreviousPage])

  const handleNavigate = (section: 'book' | 'memories' | 'date-nights') => {
    setShowHub(false)
    if (section === 'book') {
      setCurrentPage(0)
    } else if (section === 'memories') {
      setShowGallery(true)
    } else if (section === 'date-nights') {
      setShowDateNight(true)
    }
  }

  const renderPage = () => {
    if (showHub) {
      return <HubPage onNavigate={handleNavigate} />
    }
    
    if (showAdventureBook) {
      return <DateNightAdventureBook onBack={() => setShowAdventureBook(false)} />
    }
    
    if (showGallery) {
      return <MemoriesGallery onBack={() => setShowHub(true)} />
    }
    
    if (showDateNight) {
      return (
        <DateNightPage 
          onBack={() => setShowHub(true)} 
          onViewAdventureBook={() => setShowAdventureBook(true)}
        />
      )
    }
    
    if (currentPage === 0) {
      return <CoverPage onNext={goToNextPage} />
    } else if (currentPage === 1) {
      return <IntroductionPage onNext={goToNextPage} onPrevious={goToPreviousPage} />
    } else if (currentPage === TOTAL_PAGES - 1) {
      return <FinalPage onPrevious={goToPreviousPage} />
    } else {
      const couponIndex = currentPage - 2
      return (
        <CouponPage
          coupon={coupons[couponIndex]}
          onNext={goToNextPage}
          onPrevious={goToPreviousPage}
        />
      )
    }
  }

  return (
    <div
      className="relative h-full w-full"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute inset-0 h-full w-full"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Hub Button */}
      {!showHub && (
        <button
          onClick={() => setShowHub(true)}
          className="absolute top-4 left-4 z-20 px-4 py-2 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-lg shadow-lg"
          style={{ fontFamily: 'var(--font-handwritten)' }}
        >
          🏠 Hub
        </button>
      )}

      {/* Page Indicator Dots */}
      {!showHub && !showGallery && !showDateNight && !showAdventureBook && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 pb-2">
        {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isFlipping) {
                setIsFlipping(true)
                setTimeout(() => {
                  setCurrentPage(index)
                  setIsFlipping(false)
                }, 300)
              }
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentPage
                ? 'bg-rose w-8'
                : 'bg-soft-gray/40 hover:bg-soft-gray/60'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
        </div>
      )}

      {/* Navigation Arrows (Desktop) */}
      {!showHub && !showGallery && !showDateNight && !showAdventureBook && currentPage > 0 && (
        <button
          onClick={goToPreviousPage}
          disabled={isFlipping}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block p-4 text-warm-gray hover:text-rose transition-colors disabled:opacity-50"
          aria-label="Previous page"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {!showHub && !showGallery && !showDateNight && !showAdventureBook && currentPage < TOTAL_PAGES - 1 && (
        <button
          onClick={goToNextPage}
          disabled={isFlipping}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block p-4 text-warm-gray hover:text-rose transition-colors disabled:opacity-50"
          aria-label="Next page"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

