'use client'

import { useEffect, useRef } from 'react'

/**
 * Wraps children and fades them up when scrolled into view.
 * Uses IntersectionObserver (lightweight, no GSAP timeline needed for a simple
 * reveal). The brief lists GSAP as "polish / nice-to-have" — this gives the
 * same effect reliably. Swap to gsap.from() here if you want richer motion.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('is-visible'), delay)
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
