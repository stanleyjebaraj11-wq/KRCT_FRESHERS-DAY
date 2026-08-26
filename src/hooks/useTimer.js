import { useState, useEffect, useRef } from 'react'

export function useTimer(active) {
  const [seconds, setSeconds] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (active) {
      startRef.current = Date.now()
      const tick = () => {
        setSeconds(Math.floor((Date.now() - startRef.current) / 1000))
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [active])

  const current = seconds

  return { current }
}