"use client"

import { useEffect } from 'react'

export function usePerformance() {
  useEffect(() => {
    // Only client-side optimizations that can't be done with Next.js
    const optimizeFonts = () => {
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.body.classList.add('fonts-loaded')
        })
      }
    }

    optimizeFonts()
  }, [])
}

export function useIntersectionObserver(callback, options = {}) {
  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })

    return () => observer.disconnect()
  }, [callback, options])
}