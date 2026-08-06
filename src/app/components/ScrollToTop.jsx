"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            <div className="relative cursor-pointer w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-xl rounded-full flex items-center justify-center backdrop-blur-xl group-hover:border-[#B48811]/50 transition-all duration-300">
                <ChevronUp className="relative h-6 w-6 text-white group-hover:text-[#EBD197] transition-colors duration-300" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
} 