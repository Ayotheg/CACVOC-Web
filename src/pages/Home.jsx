import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import AboutSection from '../components/AboutSection'
import { ArrowRight, CirclePlay } from '../components/icons'

const PHRASES = ['Welcome to Agbala Itura', 'Come and find rest', 'You belong here']
const TICK_MS = 75
const HOLD_FULL_TICKS = 30
const HOLD_EMPTY_TICKS = 5

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useTypewriter(phrases) {
  const [text, setText] = useState(() => (prefersReducedMotion() ? phrases[0] : ''))

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    let phrase = 0
    let length = 0
    let deleting = false
    let hold = 0

    const timer = setInterval(() => {
      if (hold > 0) {
        hold -= 1
        return
      }
      const word = phrases[phrase]
      if (!deleting) {
        length += 1
        if (length >= word.length) {
          deleting = true
          hold = HOLD_FULL_TICKS
        }
      } else {
        length -= 1
        if (length <= 0) {
          deleting = false
          phrase = (phrase + 1) % phrases.length
          hold = HOLD_EMPTY_TICKS
        }
      }
      setText(word.slice(0, length))
    }, TICK_MS)

    return () => clearInterval(timer)
  }, [phrases])

  return text
}

function HeroVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    // Browsers can refuse autoplay, for example in iOS Low Power Mode. The poster stays up.
    videoRef.current.play().catch(() => {})
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        src="/video.mp4"
        poster="/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      {/* Brand navy tint: deeper at the top for the navbar, lightest over the footage. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-ink/55 via-ink/35 to-ink/50"
      />
    </>
  )
}

function Hero() {
  const typed = useTypewriter(PHRASES)

  return (
    // Keep id="hero": the navbar stays transparent while this section is in view.
    <section
      id="hero"
      aria-label="Welcome"
      className="relative isolate flex min-h-[calc(100dvh-68px)] flex-col items-center justify-center overflow-hidden bg-slate-100 px-5 py-14 text-center xl:min-h-dvh xl:pt-18"
    >
      <HeroVideo />

      <p className="type-eyebrow tracking-[0.16em] text-white max-sm:text-[11px]">
        Christ Apostolic Church · Oke-Odo
      </p>

      {/* The space is reserved so the page doesn't jump as the text types and deletes. */}
      <h1
        aria-label={PHRASES[0]}
        className="mt-5 flex min-h-22 items-center justify-center font-display text-[40px] leading-11 font-extrabold tracking-[-0.035em] text-white md:min-h-17 md:text-[56px] md:leading-15 md:whitespace-nowrap xl:text-[64px] xl:leading-17"
      >
        <span aria-hidden="true">
          {typed}
          <span className="ml-1.5 inline-block h-[0.85em] w-1 animate-caret rounded-pill bg-heritage-gold align-[-0.1em] motion-reduce:animate-none" />
        </span>
      </h1>

      <p className="type-body mt-4 text-white md:type-body-lg">
        Worship with us at Oke-Odo, or online wherever you are.
      </p>

      <div className="mt-7 flex w-full flex-col justify-center gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
        <Link
          to="/visit"
          className="flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-6 font-ui text-[15px] font-semibold text-white transition-colors hover:bg-blue-900"
        >
          Plan your visit
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          to="/live"
          className="flex h-12 items-center justify-center gap-2 rounded-pill bg-white px-6 font-ui text-[15px] font-semibold text-heading transition-colors hover:bg-blue-100"
        >
          <CirclePlay aria-hidden="true" className="size-4" />
          Watch online
        </Link>
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
    </>
  )
}

export default Home
