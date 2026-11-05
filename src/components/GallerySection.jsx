import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from './icons'
import Reveal from './Reveal'
import SectionTape from './SectionTape'

/* Prototype photos. To change one, replace its file in public/gallery under the same name and
   update its alt text here. The lighter public/gallery/web copies the site loads are remade
   the next time `npm run dev` or `npm run build` starts (or with `npm run images`). */
const DANCERS = {
  src: '/gallery/web/gallery-7.webp',
  alt: 'Children dancing in white tops and black skirts on stage',
}
const WELCOMERS2 = {
  src: '/gallery/web/gallery-9.webp',
  alt: 'a young woman holding a welcome card',
}
const WELCOMERS = {
  src: '/gallery/web/gallery-1.webp',
  alt: 'Three young women welcoming visitors with bright signs',
}
const TALKING_DRUM = {
  src: '/gallery/web/gallery-5.webp',
  alt: 'A boy in green playing the talking drum with the cultural group',
}
const WORSHIPPER = {
  src: '/gallery/web/gallery-3.webp',
  alt: 'A worshipper in white walking in with his Bible and notebooks',
  narrow: true,
}
const MINISTER = {
  src: '/gallery/web/gallery-2.webp',
  alt: 'A minister arriving at church, smiling',
}
const YOUNG_DRUMMER = {
  src: '/gallery/web/gallery-6.webp',
  alt: 'A young drummer smiling with a talking drum',
}
const PRAYER = {
  src: '/gallery/web/gallery-8.webp',
  alt: 'Women of the church in fervent prayer during a service',
}
const DRUM_SET = {
  src: '/gallery/web/gallery-4.webp',
  alt: 'A boy on the drum set, focused, during service',
}

const TOP_ROW = [DANCERS, WELCOMERS, TALKING_DRUM, WORSHIPPER, MINISTER]
const BOTTOM_ROW = [YOUNG_DRUMMER, PRAYER, DRUM_SET, WELCOMERS, TALKING_DRUM]

/* How far the images slide for each pixel scrolled on mobile. Higher means less scrolling. */
const SLIDE_SPEED = 1.4

/* Mobile row heights, reduced on short screens such as a phone held sideways. `top` centres the
   pinned rows in the space under the tape: 100px is the gap between the rows plus the padding. */
const ROW_SIZES = {
  '--top-row': 'min(220px, 34svh)',
  '--bottom-row': 'min(160px, 25svh)',
  top: 'max(4rem, calc(50svh + 2rem - (var(--top-row) + var(--bottom-row) + 100px) / 2))',
}

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
        decoding="async"
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

/* Desktop: two rows on a continuous loop, each drawn twice so the join can't be seen.
   The loop only runs while it can be seen. */
function Marquee() {
  const rootRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  const row = (images, trackClass, wideClass, narrowClass) => (
    <div className="overflow-hidden motion-reduce:overflow-x-auto">
      <ul
        style={visible ? undefined : { animationPlayState: 'paused' }}
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
    <div ref={rootRef} className="group relative mt-14 flex flex-col gap-4 max-lg:hidden">
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

/* Mobile: the rows pin in the middle of the screen and vertical scrolling slides them left. The
   wrapper is made taller by the scrolling that takes, so the page only moves on once both rows
   have reached their last image, and the next section follows straight after them.
   With reduced motion they are plain swipeable rows. */
function ScrollRows() {
  const wrapperRef = useRef(null)
  const pinRef = useRef(null)
  const topRowRef = useRef(null)
  const bottomRowRef = useRef(null)

  // A layout effect, so links to sections further down land correctly: the page's final height
  // has to be set before the browser scrolls to them.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const wrapper = wrapperRef.current
    const pin = pinRef.current
    const rows = [topRowRef.current, bottomRowRef.current]
    // Sizes are read once per resize, not on every scroll, so scrolling stays cheap.
    const size = { travel: [0, 0], scrollLength: 0, pinnedAt: 0, frame: 0 }

    const update = () => {
      size.frame = 0
      if (size.scrollLength === 0) return
      const scrolled = size.pinnedAt - wrapper.getBoundingClientRect().top
      const progress = Math.min(Math.max(scrolled / size.scrollLength, 0), 1)
      rows.forEach((row, index) => {
        row.style.transform = `translate3d(${-progress * size.travel[index]}px, 0, 0)`
      })
    }

    const onScroll = () => {
      if (!size.frame) size.frame = requestAnimationFrame(update)
    }

    const measure = () => {
      size.travel = rows.map((row) => Math.max(row.offsetWidth - wrapper.clientWidth, 0))
      size.scrollLength = Math.max(...size.travel) / SLIDE_SPEED
      size.pinnedAt = parseFloat(getComputedStyle(pin).top) || 0
      // Hidden on desktop: everything measures 0 and the wrapper goes back to its natural height.
      wrapper.style.height = size.scrollLength > 0 ? `${pin.offsetHeight + size.scrollLength}px` : ''
      update()
    }

    // Only listen to scrolling while the rows are near the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        rows.forEach((row) => {
          row.style.willChange = entry.isIntersecting ? 'transform' : ''
        })
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true })
          update()
        } else {
          window.removeEventListener('scroll', onScroll)
        }
      },
      { rootMargin: '100px 0px' },
    )

    measure()
    observer.observe(wrapper)
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(size.frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      wrapper.style.height = ''
    }
  }, [])

  const row = (images, ref, wideClass, narrowClass) => (
    <ul ref={ref} className="flex h-full w-max gap-3 pl-5 motion-reduce:pr-5">
      {images.map((image) => (
        <Photo
          key={image.src}
          image={image}
          sizeClass={`h-full ${image.narrow ? narrowClass : wideClass}`}
        />
      ))}
    </ul>
  )

  return (
    <div ref={wrapperRef} className="lg:hidden">
      <div
        ref={pinRef}
        style={ROW_SIZES}
        className="flex flex-col gap-3 overflow-hidden pt-8 pb-14 motion-safe:sticky"
      >
        <div className="relative h-(--top-row)">
          <div className="h-full motion-reduce:overflow-x-auto">
            {row(TOP_ROW, topRowRef, 'aspect-video', 'aspect-135/220')}
          </div>
          <Sticker className="right-4 -top-5 -rotate-6 bg-heritage-gold px-4 py-2 text-lg">
            Come as you are
          </Sticker>
        </div>
        <div className="relative h-(--bottom-row)">
          <div className="h-full motion-reduce:overflow-x-auto">
            {row(BOTTOM_ROW, bottomRowRef, 'aspect-video', 'aspect-135/220')}
          </div>
          <Sticker className="-top-4 left-4 rotate-7 bg-youth-coral px-3.5 py-1.5 text-[15px]">
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
        <Reveal>
          <p className="type-eyebrow tracking-[0.16em] text-muted">Our youth</p>
          <h2 id="gallery-title" className="type-h2 mt-3 text-heading lg:type-h1 lg:mt-4">
            Raising the <br className="max-lg:hidden" />
            next generation.
          </h2>
        </Reveal>

        <Reveal className="lg:max-w-105" delay={120}>
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
        </Reveal>
      </div>

      <Reveal>
        <Marquee />
      </Reveal>
      <Reveal still>
        <ScrollRows />
      </Reveal>
    </section>
  )
}

export default GallerySection
