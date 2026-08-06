"use client"

import { useState, useEffect, useRef } from 'react'

export default function LazyLoader({ children, threshold = 0.1, rootMargin = '50px' }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="min-h-[200px]" />}
    </div>
  )
}