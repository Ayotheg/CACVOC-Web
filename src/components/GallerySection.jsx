import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from './icons'
import SectionTape from './SectionTape'

/* Prototype photos. To change one, replace its file in public/gallery and update its alt text. */
const DANCERS = {
  src: '/gallery/gallery-7.jpg',
  alt: 'Children dancing in white tops and black skirts on stage',
}
const WELCOMERS = {
  src: '/gallery/gallery-1.jpg',
  alt: 'Three young women welcoming visitors with bright signs',
}
const TALKING_DRUM = {
  src: '/gallery/gallery-5.jpg',
  alt: 'A boy in green playing the talking drum with the cultural group',
}
const WORSHIPPER = {
  src: '/gallery/gallery-3.jpg',
  alt: 'A worshipper in white walking in with his Bible and notebooks',
  narrow: true,
}
const MINISTER = {
  src: '/gallery/gallery-2.jpg',
  alt: 'A minister arriving at church, smiling',
}
const YOUNG_DRUMMER = {
  src: '/gallery/gallery-6.jpg',
  alt: 'A young drummer smiling with a talking drum',
}
const PRAYER = {
  src: '/gallery/gallery-8.jpg',
  alt: 'Women of the church in fervent prayer during a service',
}
const DRUM_SET = {
  src: '/gallery/gallery-4.jpg',
  alt: 'A boy on the drum set, focused, during service',
}

const TOP_ROW = [DANCERS, WELCOMERS, TALKING_DRUM, WORSHIPPER, MINISTER]
const BOTTOM_ROW = [YOUNG_DRUMMER, PRAYER, DRUM_SET, WELCOMERS, TALKING_DRUM]

function Photo({ image, sizeClass, decorative = false }) {
  return (
    <li
      aria-hidden={decorative || undefined}
      className={`shrink-0 overflow-hidden rounded-lg bg-slate-100 ${sizeClass}`}
    >
      <img
        src={image.src}
        alt={decorative ? '' : image.alt}
        loading="lazy"
        className="size-full object-cover"
      />
    </li>
  )
}

function Sticker({ className, children }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 rounded-pill font-accent font-extrabold whitespace-nowrap text-ink shadow-card ${className}`}
    >
      {children}
    </span>
  )
}

/* Desktop: two rows on a continuous loop, each drawn twice so the join can't be seen. */
function Marquee() {
  const row = (images, trackClass, wideClass, narrowClass) => (
    <div className="overflow-hidden motion-reduce:overflow-x-auto">
      <ul
        className={`flex w-max group-hover:[animation-play-state:paused] motion-reduce:animate-none ${trackClass}`}
      >
        {[false, true].map((decorative) =>
          images.map((image) => (
            <Photo
              key={`${image.src}-${decorative}`}
              image={image}
              decorative={decorative}
              sizeClass={`mr-4 ${image.narrow ? narrowClass : wideClass}`}
            />
          )),
        )}
      </ul>
    </div>
  )

  return (
    <div className="group relative mt-14 flex flex-col gap-4 max-lg:hidden">
      {row(TOP_ROW, 'animate-marquee', 'h-80 w-142', 'h-80 w-50')}
      {row(BOTTOM_ROW, 'animate-marquee-reverse', 'h-56 w-100', 'h-56 w-36')}
      <Sticker className="-top-6 right-[12%] -rotate-6 bg-heritage-gold px-6 py-3 text-xl">
        Come as you are
      </Sticker>
      <Sticker className="top-76 left-[12%] rotate-8 bg-youth-coral px-5 py-2 text-base">
        Next gen
      </Sticker>
    </div>
  )
}

/* Mobile: the rows pin under the tape and vertical scrolling slides them left. The wrapper is
   made taller by the distance the longest row has to travel, so the page only moves on once
   both rows have reached their last image. With reduced motion they are plain swipeable rows. */
function ScrollRows() {
  const wrapperRef = useRef(null)
  const pinRef = useRef(null)
  const topRowRef = useRef(null)
  const bottomRowRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const wrapper = wrapperRef.current
    const pin = pinRef.current
    const rows = [topRowRef.current, bottomRowRef.current]
    const travelOf = (row) => Math.max(row.offsetWidth - wrapper.clientWidth, 0)
    const longestTravel = () => Math.max(...rows.map(travelOf))

    const update = () => {
      const longest = longestTravel()
      if (longest === 0) return
      const pinnedAt = parseFloat(getComputedStyle(pin).top) || 0
      const scrolled = pinnedAt - wrapper.getBoundingClientRect().top
      const progress = Math.min(Math.max(scrolled / longest, 0), 1)
      rows.forEach((row) => {
        row.style.transform = `translate3d(${-progress * travelOf(row)}px, 0, 0)`
      })
    }

    const measure = () => {
      const longest = longestTravel()
      // Hidden on desktop: everything measures 0 and the wrapper goes back to its natural height.
      wrapper.style.height = longest > 0 ? `${pin.offsetHeight + longest}px` : ''
      update()
    }

    measure()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
      wrapper.style.height = ''
    }
  }, [])

  const row = (images, ref, wideClass, narrowClass) => (
    <ul ref={ref} className="flex w-max gap-3 px-5 will-change-transform motion-reduce:will-change-auto">
      {images.map((image) => (
        <Photo
          key={image.src}
          image={image}
          sizeClass={image.narrow ? narrowClass : wideClass}
        />
      ))}
    </ul>
  )

  return (
    <div ref={wrapperRef} className="lg:hidden">
      <div
        ref={pinRef}
        className="flex flex-col justify-center overflow-hidden motion-safe:sticky motion-safe:top-16 motion-safe:h-[calc(100svh-4rem)] motion-reduce:pb-14"
      >
        <div className="relative flex flex-col gap-3">
          <div className="motion-reduce:overflow-x-auto">
            {row(TOP_ROW, topRowRef, 'h-55 w-98', 'h-55 w-34')}
          </div>
          <div className="motion-reduce:overflow-x-auto">
            {row(BOTTOM_ROW, bottomRowRef, 'h-40 w-71', 'h-40 w-25')}
          </div>
          <Sticker className="right-4 -top-5 -rotate-6 bg-heritage-gold px-4 py-2 text-lg">
            Come as you are
          </Sticker>
          <Sticker className="top-52 left-4 rotate-7 bg-youth-coral px-3.5 py-1.5 text-[15px]">
            Next gen
          </Sticker>
        </div>
      </div>
    </div>
  )
}

function GallerySection() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="overflow-x-clip bg-white lg:pb-20">
      <SectionTape>GALLERY</SectionTape>

      <div className="mx-auto flex max-w-300 flex-col gap-5 px-5 pt-14 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pt-20">
        <div>
          <p className="type-eyebrow tracking-[0.16em] text-muted">Our youth</p>
          <h2 id="gallery-title" className="type-h2 mt-3 text-heading lg:type-h1 lg:mt-4">
            Raising the <br className="max-lg:hidden" />
            next generation.
          </h2>
        </div>

        <div className="lg:max-w-105">
          <p className="type-body text-body">
            Be part of us. Come as you are — you are always welcome here.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3 lg:mt-5">
            <Link
              to="/gallery"
              className="flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-900"
            >
              See the gallery
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              to="/visit"
              className="flex h-12 items-center justify-center rounded-pill border border-border px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-heading transition-colors hover:bg-slate-100"
            >
              Join us this Sunday
            </Link>
          </div>
        </div>
      </div>

      <Marquee />
      <ScrollRows />
    </section>
  )
}

export default GallerySection
