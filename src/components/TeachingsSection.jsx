import { externalLinks } from '../data/site'
import { ArrowUpRight, Youtube } from './icons'
import Reveal from './Reveal'
import SectionTape from './SectionTape'

function TeachingsSection() {
  return (
    <section id="teachings" aria-labelledby="teachings-title" className="-scroll-mt-18 bg-white">
      <SectionTape>TEACHINGS</SectionTape>

      <div className="mx-auto max-w-300 px-4 py-14 md:px-10 lg:py-20">
        <Reveal>
          <article className="relative grid items-center gap-6 overflow-hidden rounded-xl bg-slate-100 p-3.5 pb-7 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-14 lg:p-5">
            <span
              aria-hidden="true"
              className="absolute -right-3 -bottom-8 font-accent text-[100px] leading-none font-extrabold tracking-[-0.045em] whitespace-nowrap text-slate-200/50 select-none lg:-right-4 lg:-bottom-12 lg:text-[160px]"
            >
              Abiara
            </span>

            <figure className="relative h-65 overflow-hidden rounded-lg bg-white lg:h-105">
              <img
                src="/pia.jpg"
                alt="Bishop Isaac Abiara at his desk in his study, reading from a tablet"
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-[45%_center]"
              />
              <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-pill bg-white/95 px-3 py-1.5 font-badge text-[11px] leading-4 font-semibold text-heading lg:top-4 lg:left-4 lg:text-xs">
                <Youtube aria-hidden="true" className="size-4" />
                On YouTube
              </span>
            </figure>

            <div className="relative px-2 lg:px-0 lg:pr-10">
              <p className="type-eyebrow flex items-center gap-3 tracking-[0.16em] text-gold-700">
                <span aria-hidden="true" className="h-0.5 w-8 bg-heritage-gold" />
                Teaching series
              </p>
              <h2 id="teachings-title" className="type-h2 mt-3 text-heading lg:type-h1 lg:mt-4">
                Follow my <br className="max-lg:hidden" />
                teachings.
              </h2>
              <p className="type-body mt-3 max-w-105 text-body lg:mt-4">
                Be blessed by my teaching series on YouTube — new messages to grow your faith every
                week.
              </p>

              <div className="mt-5 flex flex-col gap-0.5 border-y border-border py-3.5">
                <span className="font-subheading text-base leading-6 font-bold text-heading">
                  Bishop Isaac Abiara
                </span>
                <span className="font-badge text-xs leading-4.5 font-medium text-muted">
                  Lead Pastor &amp; DCC Superintendent, CAC Agbala Itura
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <a
                  href={externalLinks.teachings}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-900"
                >
                  <Youtube aria-hidden="true" className="size-4" />
                  Watch on YouTube
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
                <a
                  href={`${externalLinks.teachings}?sub_confirmation=1`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center rounded-pill border border-border bg-white px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-heading transition-colors hover:bg-slate-100"
                >
                  Subscribe
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}

export default TeachingsSection
