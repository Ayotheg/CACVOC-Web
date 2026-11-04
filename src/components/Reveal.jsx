import { useEffect, useRef, useState } from 'react'

/* Fades its content in the first time it scrolls into view. Wrap the content of every section
   with it, but not the SectionTape. Use `still` when the content holds something sticky, so it
   fades without moving. Visitors with reduced motion see the content straight away. */
function Reveal({ children, className = '', delay = 0, still = false }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const hidden = still ? 'motion-safe:opacity-0' : 'motion-safe:translate-y-3 motion-safe:opacity-0'

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-[opacity,translate] duration-700 ease-out ${shown ? '' : hidden} ${className}`}
    >
      {children}
    </div>
  )
}

export default Reveal
