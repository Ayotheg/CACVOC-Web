import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import AboutSection from '../components/AboutSection'
import EventsSection from '../components/EventsSection'
import GallerySection from '../components/GallerySection'
import { ArrowRight, CirclePlay } from '../components/icons'
import LivestreamSection from '../components/LivestreamSection'
import Reveal from '../components/Reveal'
import SupportSection from '../components/SupportSection'
import TeachingsSection from '../components/TeachingsSection'

const PHRASES = ['Welcome to Agbala Itura', 'Come and find rest', 'You belong here']
const TICK_MS = 75
const HOLD_FULL_TICKS = 30
const HOLD_EMPTY_TICKS = 5

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useTypewriter(phrases, elementRef) {
  const [text, setText] = useState(() => (prefersReducedMotion() ? phrases[0] : ''))

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const state = { phrase: 0, length: 0, deleting: false, hold: 0, visible: true }

    // Each typed letter makes the page do layout work, so it only types while it can be seen.
    const observer = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting
    })
    observer.observe(elementRef.current)

    const timer = setInterval(() => {
      if (!state.visible) return
      if (state.hold > 0) {
        state.hold -= 1
        return
      }
      const word = phrases[state.phrase]
      if (!state.deleting) {
        state.length += 1
        if (state.length >= word.length) {
          state.deleting = true
          state.hold = HOLD_FULL_TICKS
        }
      } else {
        state.length -= 1
        if (state.length <= 0) {
          state.deleting = false
          state.phrase = (state.phrase + 1) % phrases.length
          state.hold = HOLD_EMPTY_TICKS
        }
      }
      setText(word.slice(0, state.length))
    }, TICK_MS)

    return () => {
      clearInterval(timer)
      observer.disconnect()
    }
  }, [phrases, elementRef])

  return text
}

/* Phones get the lighter version. Both are compressed copies: the full-quality originals are
   kept outside the project, because they are too large for GitHub and for visitors to download. */
const pickHeroVideo = () =>
  window.matchMedia('(min-width: 768px)').matches ? '/hero-1080.mp4' : '/hero-720.mp4'

function HeroVideo() {
  const videoRef = useRef(null)
  const [src] = useState(pickHeroVideo)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const video = videoRef.current

    // Only decode the video while it can be seen: it is the heaviest thing on the page.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Browsers can refuse autoplay, for example in iOS Low Power Mode. The poster stays up.
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
    observer.observe(video)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        src={src}
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
  const headingRef = useRef(null)
  const typed = useTypewriter(PHRASES, headingRef)

  return (
    <section
      id="hero"
      aria-label="Welcome"
      className="relative isolate flex min-h-[calc(100dvh-68px)] flex-col items-center justify-center overflow-hidden bg-slate-100 px-5 py-14 text-center lg:min-h-dvh lg:pt-18"
    >
      <HeroVideo />

      <Reveal className="flex w-full flex-col items-center">
        <p className="type-eyebrow tracking-[0.16em] text-white max-sm:text-[11px]">
          Christ Apostolic Church · Agbala Itura
        </p>

        {/* The space is reserved so the page doesn't jump as the text types and deletes. */}
        <h1
          ref={headingRef}
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
            to="/#live"
            className="flex h-12 items-center justify-center gap-2 rounded-pill bg-white px-6 font-ui text-[15px] font-semibold text-heading transition-colors hover:bg-blue-100"
          >
            <CirclePlay aria-hidden="true" className="size-4" />
            Watch online
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <GallerySection />
      <EventsSection />
      <LivestreamSection />
      <TeachingsSection />
      <SupportSection />
    </>
  )
}

export default Home
