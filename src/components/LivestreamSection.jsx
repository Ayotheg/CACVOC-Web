import { useState } from 'react'
import { externalLinks, serviceTimes } from '../data/site'
import { splitStreamTitle, startedLabel, useLiveStatus } from '../live/liveStatus'
import { Facebook, Youtube } from './icons'
import LiveDot from './LiveDot'
import Reveal from './Reveal'
import SectionTape from './SectionTape'

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', channelLabel: 'Our YouTube channel', icon: Youtube },
  { id: 'facebook', label: 'Facebook', channelLabel: 'Our Facebook page', icon: Facebook },
]

const todayCode = () => new Date().toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()

function embedUrl(platform, stream) {
  if (platform === 'youtube') return `https://www.youtube.com/embed/${stream.videoId}`
  const href = encodeURIComponent(stream.url)
  return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=760`
}

function PlatformToggle({ status, active, onChange }) {
  return (
    <div
      role="group"
      aria-label="Choose platform"
      className="flex rounded-pill bg-slate-100 p-1 max-lg:w-full"
    >
      {PLATFORMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={active === id}
          disabled={!status[id]}
          onClick={() => onChange(id)}
          className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-pill px-4 font-ui text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 max-lg:flex-1 ${
            active === id ? 'bg-white text-heading shadow-sm' : 'text-body'
          }`}
        >
          <Icon aria-hidden="true" className="size-4" />
          {label}
        </button>
      ))}
    </div>
  )
}

/* No badges over the video: both players draw their own title and LIVE tag in those corners. */
function LiveFrame({ platform, stream }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-ink">
      {/* The key loads a fresh player when the platform or the stream changes. */}
      <iframe
        key={`${platform}-${stream.url}`}
        src={embedUrl(platform, stream)}
        title={`${stream.title ?? 'Live service'} on ${platform === 'youtube' ? 'YouTube' : 'Facebook'}`}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  )
}

/* Shown in place of the video whenever nothing is live. */
function NotLiveCard() {
  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-ink px-6 text-center">
      <p className="type-eyebrow tracking-[0.16em] text-heritage-gold">Livestream</p>
      <p className="type-h3 text-white lg:type-h2">Not live yet</p>
      <p className="type-body-sm text-on-dark-muted">
        The service will play here as soon as we go live.
      </p>
    </div>
  )
}

function WatchLinks({ status, isLive }) {
  const links = PLATFORMS.filter(({ id }) => !isLive || status[id]).map((platform) => ({
    ...platform,
    href: isLive ? status[platform.id].url : externalLinks[platform.id],
    text: isLive ? `Watch on ${platform.label}` : platform.channelLabel,
  }))

  return (
    <div className="flex flex-col gap-2.5">
      {links.map(({ id, href, text, icon: Icon }, index) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={`flex h-12 items-center justify-center gap-2 rounded-pill px-5 font-ui text-[15px] font-semibold whitespace-nowrap transition-colors ${
            index === 0
              ? 'bg-ink text-white hover:bg-blue-900'
              : 'border border-border text-heading hover:bg-slate-100'
          }`}
        >
          <Icon aria-hidden="true" className="size-4" />
          {text}
        </a>
      ))}
    </div>
  )
}

function Schedule({ isLive }) {
  const today = todayCode()

  return (
    <div>
      <p className="type-eyebrow border-b border-border pb-2 text-[11px] tracking-[0.16em] text-muted">
        Service schedule
      </p>
      <ul className="divide-y divide-border">
        {serviceTimes.map((service) => (
          <li key={service.name} className="flex items-center gap-3 py-3">
            <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm bg-slate-100 font-numeric text-[11px] font-semibold text-heading">
              {service.day}
            </span>
            <span className="min-w-0 flex-1 font-subheading text-sm leading-5 font-bold text-heading">
              {service.name}
            </span>
            {isLive && service.day === today ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-coral-100 px-2.5 py-0.5 font-badge text-[11px] leading-4 font-semibold text-coral-700">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-coral-500" />
                Live now
              </span>
            ) : (
              <span className="shrink-0 font-numeric text-xs font-semibold text-muted">
                {service.time}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function LivestreamSection() {
  const { status, isLive } = useLiveStatus()
  const [choice, setChoice] = useState('youtube')

  const active = isLive && (status[choice] ? choice : PLATFORMS.find(({ id }) => status[id]).id)
  const stream = isLive ? status[active] : null
  const { heading, details } = isLive
    ? splitStreamTitle(stream.title)
    : { heading: 'Join our services online.', details: '' }

  return (
    // The negative margin cancels the page-wide scroll padding, so "Watch live" lands with this
    // section's tape at the very top.
    <section id="live" aria-labelledby="live-title" className="-scroll-mt-18 bg-white">
      <SectionTape>LIVESTREAM</SectionTape>

      <div className="mx-auto max-w-300 px-5 py-14 md:px-10 lg:py-20">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            {isLive ? (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="type-eyebrow flex items-center gap-2 tracking-[0.16em] text-coral-700">
                  <LiveDot />
                  Live now
                </span>
                {stream.startedAt && (
                  <span className="type-caption text-muted">{startedLabel(stream.startedAt)}</span>
                )}
              </p>
            ) : (
              <p className="type-eyebrow tracking-[0.16em] text-muted">Watch from anywhere</p>
            )}
            <h2 id="live-title" className="type-h2 mt-2 text-heading lg:type-h1 lg:mt-3">
              {heading}
            </h2>
            {details && <p className="type-datetime mt-2 text-gold-700">{details}</p>}
          </div>
          {isLive && <PlatformToggle status={status} active={active} onChange={setChoice} />}
        </Reveal>

        <div className="mt-7 grid items-start gap-7 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <Reveal>
            {isLive ? <LiveFrame platform={active} stream={stream} /> : <NotLiveCard />}
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-5">
            <WatchLinks status={status} isLive={isLive} />
            <Schedule isLive={isLive} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default LivestreamSection
