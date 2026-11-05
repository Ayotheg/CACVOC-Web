import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, CirclePlay, X } from './icons'
import Reveal from './Reveal'
import SectionTape from './SectionTape'

/* True once the hero's bottom edge, where About starts, has come 40% up the screen, and for the
   rest of the page below it. Watches the hero against the lower part of the screen, so a jump
   from the page end to the top still registers, without any work on each scroll. */
function usePastHero() {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting), {
      rootMargin: '-60% 0px 0px 0px',
    })
    observer.observe(document.getElementById('hero'))
    return () => observer.disconnect()
  }, [])

  return past
}

/* Fixed to the screen from the About section to the end of the page, smaller on phones and tablets.
   Closing it keeps it closed until "Watch welcome" reopens it.
   TODO: swap the placeholder for the real 9:16 video, speaker name and duration. */
function WelcomeVideo({ state, reached, onClose }) {
  const visibility = {
    default: reached ? 'block' : 'hidden',
    open: 'block',
    closed: 'hidden',
  }[state]

  return (
    <aside
      aria-label="Welcome video"
      className={`${visibility} fixed right-3 bottom-3 z-40 aspect-9/16 w-26 overflow-hidden rounded-lg border-3 border-white bg-slate-100 shadow-lift motion-safe:animate-rise lg:right-4 lg:bottom-4 lg:w-40 lg:border-4`}
    >
      <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-1 text-center font-badge text-[10px] font-medium text-muted lg:text-[11px]">
        [Welcome video · 9:16]
      </p>
      <button
        type="button"
        aria-label="Close welcome video"
        onClick={onClose}
        className="absolute top-1.5 right-1.5 flex size-8 cursor-pointer lg:top-2 lg:right-2 lg:size-9 items-center justify-center rounded-full bg-ink/55 text-white"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-ink/70 p-2 lg:p-3">
        <span className="font-subheading text-[11px] leading-3.5 font-bold text-white lg:text-[13px] lg:leading-4.5">
          A word of welcome
        </span>
        <span className="font-badge text-[10px] leading-3.5 font-medium text-blue-100 lg:text-[11px] lg:leading-4">
          [Speaker name] · [0:00]
        </span>
      </div>
    </aside>
  )
}

function Portraits() {
  return (
    <div className="relative aspect-350/450 w-full max-w-87.5 lg:aspect-600/660 lg:max-w-130">
      <figure className="absolute top-0 left-0 h-[91%] w-[83%] overflow-hidden rounded-lg bg-slate-100 lg:h-[94%]">
        <img
          src="/baba-abiara-founder.jpg"
          alt="Portrait of Prophet (Dr.) Samuel Kayode Abiara, smiling, in white lace attire"
          loading="lazy"
          className="size-full object-cover object-top"
        />
        <figcaption className="absolute bottom-3 left-3 flex flex-col rounded-md bg-white/95 px-3 py-2 lg:bottom-4 lg:left-4 lg:px-4 lg:py-3">
          <span className="font-subheading text-xs leading-4.5 font-bold text-heading lg:text-sm lg:leading-5">
            Prophet (Dr.) S.K. Abiara
          </span>
          <span className="font-badge text-[11px] leading-4 font-medium text-muted lg:text-xs">
            Founder
          </span>
        </figcaption>
      </figure>

      <figure className="absolute right-0 bottom-0 h-[44%] w-[46%] overflow-hidden rounded-lg border-4 border-white bg-slate-100 shadow-lift lg:w-[38%] lg:border-6">
        <img
          src="/bishop-isaac.webp"
          alt="Portrait of Bishop Isaac Abiara in glasses and a brown checked blazer"
          loading="lazy"
          className="size-full object-cover object-[center_25%]"
        />
        <figcaption className="absolute inset-x-1.5 bottom-1.5 flex flex-col rounded-sm bg-white/95 px-2 py-1.5 lg:inset-x-2 lg:bottom-2 lg:px-3 lg:py-2">
          <span className="font-subheading text-[11px] leading-4 font-bold text-heading lg:text-xs lg:leading-4.5">
            Bishop Isaac Abiara
          </span>
          <span className="font-badge text-[10px] leading-3.5 font-medium text-muted lg:text-[11px] lg:leading-4">
            Lead Pastor
          </span>
        </figcaption>
      </figure>
    </div>
  )
}

function AboutSection() {
  const [videoState, setVideoState] = useState('default')
  const reached = usePastHero()

  return (
    <section id="about" aria-labelledby="about-title" className="-scroll-mt-18 bg-white">
      <SectionTape>ABOUT US</SectionTape>

      <div className="mx-auto max-w-300 px-5 py-14 md:px-10 lg:py-20">
        <Reveal className="max-w-220">
          <h2 id="about-title" className="type-h2 text-heading lg:type-h1">
            <span className="text-slate-400">Founded by</span> Global Evangelist, Prophet (Dr.) S.K.
            Abiara
          </h2>
          <p className="mt-2 font-subheading text-base leading-6.5 font-semibold text-muted lg:mt-3 lg:type-lead">
            Led today by Bishop Isaac Abiara, Lead Pastor &amp; DCC Superintendent.
          </p>
        </Reveal>

        <div className="mt-8 grid items-center gap-7 lg:mt-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <Portraits />
          </Reveal>

          <Reveal className="max-w-100" delay={120}>
            <p className="type-eyebrow flex items-center gap-3 text-gold-700 max-lg:hidden">
              <span aria-hidden="true" className="h-0.5 w-8 bg-heritage-gold" />
              Our story
            </p>
            <p className="type-body text-body lg:mt-5">
              CAC Agbala Itura was founded by Prophet (Dr.) Samuel Kayode Abiara, a highly revered
              Christian leader and former General Evangelist of Christ Apostolic Church Worldwide
              for over a decade. Today, the church is led by Bishop Isaac Abiara.
            </p>
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:gap-3 lg:mt-6">
              <Link
                to="/about"
                className="flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-900"
              >
                Read our story
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => setVideoState('open')}
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-pill border border-border px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-heading transition-colors hover:bg-slate-100"
              >
                <CirclePlay aria-hidden="true" className="size-4" />
                Watch welcome
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <WelcomeVideo
        state={videoState}
        reached={reached}
        onClose={() => setVideoState('closed')}
      />
    </section>
  )
}

export default AboutSection
