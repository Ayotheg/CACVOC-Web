import { useEffect, useRef, useState } from 'react'
import { hasSetHours, isHappeningNow, lagosNow, livestreamedServices } from '../data/services'
import { externalLinks } from '../data/site'
import { splitStreamTitle, startedLabel, useLiveStatus } from '../live/liveStatus'
import { Facebook, Radio, Youtube } from './icons'
import LiveDot from './LiveDot'
import Reveal from './Reveal'
import SectionTape from './SectionTape'

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', channelLabel: 'Our YouTube channel', icon: Youtube },
  { id: 'facebook', label: 'Facebook', channelLabel: 'Our Facebook page', icon: Facebook },
]

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

const RING_DELAYS = ['0s', '1.5s', '3s']

/* Shown in place of the video whenever nothing is live. Gold rings mean we're waiting to go live.
   A slow blue spinner means the check failed and is still retrying, so a service may be on, and
   the YouTube button beside the card is the way to reach it. The motion stops off-screen. */
function NotLiveCard({ checkFailed }) {
  const cardRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const playState = { animationPlayState: visible ? 'running' : 'paused' }

  return (
    <div
      ref={cardRef}
      className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-ink px-6 text-center max-sm:h-60 sm:aspect-video"
    >
      <div
        aria-hidden="true"
        style={playState}
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--color-blue-800),transparent_70%)] motion-safe:animate-glow"
      />

      <div aria-hidden="true" className="relative size-14">
        {checkFailed ? (
          <span
            style={playState}
            className="absolute inset-0 rounded-full border-2 border-white/15 border-t-blue-200 [animation-duration:3s] motion-safe:animate-spin"
          />
        ) : (
          RING_DELAYS.map((delay) => (
            <span
              key={delay}
              style={{ ...playState, animationDelay: delay }}
              className="absolute inset-0 rounded-full border border-heritage-gold opacity-0 motion-safe:animate-broadcast"
            />
          ))
        )}
        <span
          className={`absolute inset-0 flex items-center justify-center rounded-full ${
            checkFailed ? 'text-blue-200' : 'border border-heritage-gold/40 text-heritage-gold'
          }`}
        >
          <Radio className="size-6" />
        </span>
      </div>

      {/* The key replays the entrance when the message changes. */}
      <div key={String(checkFailed)} aria-live="polite" className="mt-4 motion-safe:animate-rise">
        <p className="type-h3 text-white lg:type-h2">
          {checkFailed ? 'Having trouble checking' : 'Not live yet'}
        </p>
        <p className="type-body-sm mt-1.5 text-on-dark-muted">
          {checkFailed
            ? 'We’re still trying. If a service is on now, use the YouTube button to watch.'
            : 'The service will play here as soon as we go live.'}
        </p>
      </div>
    </div>
  )
}

function WatchLinks({ status, isLive, checkFailed }) {
  const links = PLATFORMS.filter(({ id }) => !isLive || status[id]).map((platform) => ({
    ...platform,
    href: isLive ? status[platform.id].url : externalLinks[platform.id],
    text: isLive ? `Watch on ${platform.label}` : platform.channelLabel,
  }))

  // We can't see the stream, so send them to the channel's live page, which opens it if it's on.
  if (checkFailed) {
    links[0] = { ...links[0], href: `${externalLinks.youtube}/live`, text: 'Watch on YouTube' }
  }

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

/* Only the services that go out live. The full week is in the Events section. */
function StreamedServices({ isLive }) {
  const now = lagosNow()
  const regular = livestreamedServices.filter(hasSetHours)
  const monthly = livestreamedServices.filter((service) => !hasSetHours(service))

  return (
    <div>
      <h3 className="type-eyebrow border-b border-border pb-2 text-[11px] tracking-[0.16em] text-muted">
        Streamed services
      </h3>
      <ul className="divide-y divide-border">
        {regular.map((service) => (
          <li key={service.name} className="flex items-center gap-3 py-2.5">
            <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm bg-slate-100 font-numeric text-[11px] font-semibold text-heading">
              {service.day}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-subheading text-sm leading-5 font-bold text-heading">
                {service.name}
              </span>
              <span className="font-body text-xs leading-4.5 text-muted">{service.time}</span>
            </span>
            {isLive && isHappeningNow(service.day, service, now) && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-coral-100 px-2.5 py-0.5 font-badge text-[11px] leading-4 font-semibold text-coral-700">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-coral-500" />
                Live now
              </span>
            )}
          </li>
        ))}
      </ul>
      {monthly.length > 0 && (
        <p className="border-t border-border pt-2.5 font-body text-xs leading-4.5 text-muted">
          Also streamed: {monthly.map((service) => service.name).join(' and ')}.
        </p>
      )}
    </div>
  )
}

function LivestreamSection() {
  const { status, isLive, checkFailed } = useLiveStatus()
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
            {isLive ? <LiveFrame platform={active} stream={stream} /> : <NotLiveCard checkFailed={checkFailed} />}
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-5">
            <WatchLinks status={status} isLive={isLive} checkFailed={checkFailed} />
            <StreamedServices isLive={isLive} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default LivestreamSection
