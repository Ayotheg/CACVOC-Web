import { Link } from 'react-router'
import { featuredEvent, upcomingEvents } from '../data/events'
import { ArrowRight, CalendarPlus, Clock, MapPin } from './icons'
import Reveal from './Reveal'
import SectionTape from './SectionTape'

const compactDate = (date) => date.replaceAll('-', '')

/* An all-day calendar file that phones and computers can open. Calendars treat the end date
   as exclusive, so it is the day after the event's last day. */
function calendarFileLink({ title, startDate, endDate }) {
  const dayAfter = new Date(`${endDate || startDate}T00:00:00Z`)
  dayAfter.setUTCDate(dayAfter.getUTCDate() + 1)
  const summary = title.replace(/([,;\\])/g, '\\$1')

  const file = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAC Vineyard of Comfort//Events//EN',
    'BEGIN:VEVENT',
    `UID:${compactDate(startDate)}-event@cacvoc`,
    `DTSTAMP:${compactDate(startDate)}T000000Z`,
    `DTSTART;VALUE=DATE:${compactDate(startDate)}`,
    `DTEND;VALUE=DATE:${compactDate(dayAfter.toISOString().slice(0, 10))}`,
    `SUMMARY:${summary}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(file)}`
}

function SeeAllLink({ className }) {
  return (
    <Link
      to="/events"
      className={`h-12 items-center justify-center gap-2 rounded-pill border border-border px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-heading transition-colors hover:bg-slate-100 ${className}`}
    >
      See all events
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  )
}

function FeaturedEvent({ event }) {
  return (
    <article aria-labelledby="featured-event-title">
      <div className="relative flex h-90 items-center justify-center overflow-hidden rounded-lg bg-slate-100 lg:h-110">
        {event.flyer ? (
          <img
            src={event.flyer}
            alt={event.flyerAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-contain"
          />
        ) : (
          <span className="type-caption text-muted">[Event flyer]</span>
        )}
        <span className="type-eyebrow absolute top-4 left-4 rounded-pill bg-heritage-gold px-3 py-1.5 text-[11px] text-ink">
          Next up
        </span>
      </div>

      <p className="type-datetime mt-5 text-gold-700">{event.dateText}</p>
      <h3 id="featured-event-title" className="type-h3 mt-2 text-heading lg:type-h2">
        {event.title}
      </h3>
      {event.theme && (
        <p className="type-body mt-2 text-body">
          Theme: <span className="font-subheading font-bold text-heading">{event.theme}</span>
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <Link
          to={event.link}
          className="flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-900"
        >
          Event details
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        {event.startDate && (
          <a
            href={calendarFileLink(event)}
            download="cac-event.ics"
            className="flex h-12 items-center justify-center gap-2 rounded-pill border border-border px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-heading transition-colors hover:bg-slate-100"
          >
            <CalendarPlus aria-hidden="true" className="size-4" />
            Add to calendar
          </a>
        )}
      </div>
    </article>
  )
}

function EventRow({ event }) {
  return (
    <li className="flex items-center gap-3.5 py-4 lg:gap-5 lg:py-5">
      <span className="flex h-16 w-15 shrink-0 flex-col items-center justify-center rounded-md bg-slate-100 lg:h-18 lg:w-17">
        <span className="font-numeric text-lg leading-6 font-semibold text-heading lg:text-[22px] lg:leading-7">
          {event.day}
        </span>
        <span className="type-eyebrow text-[10px] leading-3.5 text-muted">{event.month}</span>
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="font-subheading text-base leading-5.5 font-bold text-heading lg:text-lg lg:leading-6">
            {event.title}
          </span>
          {event.streamedLive && (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-coral-100 px-2.5 py-0.5 font-badge text-[11px] leading-4 font-semibold text-coral-700">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-coral-500" />
              Streamed live
            </span>
          )}
        </span>
        <span className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] leading-5 text-muted">
          <span className="flex items-center gap-1.5 font-numeric font-semibold">
            <Clock aria-hidden="true" className="size-3.5 shrink-0" />
            {event.time}
          </span>
          <span className="flex items-center gap-1.5 font-body">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            {event.venue}
          </span>
        </span>
      </span>

      <Link
        to={event.link}
        aria-label={`View ${event.title}`}
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-heading transition-colors hover:bg-slate-100"
      >
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </li>
  )
}

function EventsSection() {
  return (
    <section id="events" aria-labelledby="events-title" className="bg-white">
      <SectionTape>EVENTS</SectionTape>

      <div className="mx-auto max-w-300 px-5 py-14 md:px-10 lg:py-20">
        <Reveal className="flex items-end justify-between gap-8">
          <div>
            <p className="type-eyebrow tracking-[0.16em] text-muted">Upcoming programmes</p>
            <h2 id="events-title" className="type-h2 mt-3 text-heading lg:type-h1 lg:mt-4">
              What’s coming up.
            </h2>
          </div>
          <SeeAllLink className="flex max-lg:hidden" />
        </Reveal>

        <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-14">
          <Reveal>
            <FeaturedEvent event={featuredEvent} />
          </Reveal>

          <Reveal delay={120} className="xl:pr-5 2xl:pr-0">
            <p className="type-eyebrow border-b border-border pb-2 tracking-[0.16em] text-muted">
              Also coming up
            </p>
            <ul className="divide-y divide-border">
              {upcomingEvents.map((event) => (
                <EventRow key={`${event.day}-${event.month}-${event.title}`} event={event} />
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-4 lg:hidden">
          <SeeAllLink className="flex w-full" />
        </Reveal>
      </div>
    </section>
  )
}

export default EventsSection
