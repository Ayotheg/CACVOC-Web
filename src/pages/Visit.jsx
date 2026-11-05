import { useId, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, MapPin, Minus, Phone, Plus } from '../components/icons'
import Reveal from '../components/Reveal'
import SectionTape from '../components/SectionTape'
import { footerServices } from '../data/services'
import { externalLinks } from '../data/site'
import {
  churchLocation,
  firstSundaySteps,
  thisSunday,
  visitFacts,
  visitQuestions,
} from '../data/visit'

const MAX_PEOPLE = 20
const WHEN_OPTIONS = ['This Sunday', 'Next Sunday', 'Not sure yet']

/* Sends a visitor's details to the church. It only counts as saved when the server confirms it,
   so nobody is told a seat is waiting if their details never arrived.
   TODO: api/rsvp does not exist yet. Under `npm run dev` this pretends to work, to show the design. */
async function sendVisitDetails(details) {
  if (import.meta.env.DEV) return true
  try {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    })
    return response.ok && (await response.json()).ok === true
  } catch {
    return false
  }
}

function Intro() {
  return (
    <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-16">
      <Reveal>
        <p className="type-eyebrow tracking-[0.16em] text-muted">Plan a visit</p>
        <h1 id="visit-title" className="type-h1 mt-3 text-heading lg:type-display lg:mt-4">
          We’d love to <br className="max-lg:hidden" />
          meet you.
        </h1>
        <p className="type-body mt-3 max-w-120 text-body lg:type-body-lg lg:mt-5">
          Everything you need for your first Sunday at Agbala Itura: when to come, where to find us
          and what to expect.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
          <a
            href="#rsvp"
            className="flex h-12 items-center justify-center gap-2 rounded-pill bg-ink px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-900"
          >
            Let us know you’re coming
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
          <a
            href={externalLinks.directions}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-pill border border-border px-5 font-ui text-[15px] font-semibold whitespace-nowrap text-heading transition-colors hover:bg-slate-100"
          >
            <MapPin aria-hidden="true" className="size-4" />
            Get directions
          </a>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <figure className="relative h-85 overflow-hidden rounded-xl bg-slate-100 lg:h-120">
          <img
            src="/gallery/web/gallery-1.webp"
            alt="Three members of the welcome team smiling and holding welcome signs"
            decoding="async"
            className="size-full object-cover"
          />
          <figcaption className="absolute inset-x-3 bottom-3 rounded-lg bg-white/95 px-4 py-3 lg:inset-x-4 lg:bottom-4 lg:px-5 lg:py-4">
            <span className="type-eyebrow block text-[11px] text-gold-700">This Sunday</span>
            <span className="mt-1 block font-subheading text-[15px] leading-5.5 font-bold text-heading lg:text-base">
              {thisSunday.services}
            </span>
            <span className="mt-0.5 block font-badge text-xs leading-4.5 font-medium text-muted">
              {thisSunday.note}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </div>
  )
}

function WhatToExpect() {
  return (
    <div>
      <Reveal>
        <p className="type-eyebrow tracking-[0.16em] text-muted">What to expect</p>
        <h2 className="type-h2 mt-3 text-heading lg:type-h1">Your first Sunday, step by step.</h2>
      </Reveal>

      <Reveal>
        <ol className="mt-6 grid gap-3 lg:mt-8 lg:grid-cols-3 lg:gap-4">
          {firstSundaySteps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-lg bg-slate-100 p-5 lg:flex-col lg:gap-3 lg:p-6"
            >
              <span
                aria-hidden="true"
                className="w-11 shrink-0 font-accent text-[32px] leading-none font-extrabold tracking-[-0.04em] text-primary-blue lg:w-auto lg:text-[44px]"
              >
                0{index + 1}
              </span>
              <span>
                <span className="block font-subheading text-lg leading-6 font-bold text-heading">
                  {step.title}
                </span>
                <span className="type-body-sm mt-1 block text-body lg:mt-1.5">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal>
        <dl className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-border lg:mt-5 lg:grid-cols-4">
          {visitFacts.map((fact, index) => (
            <div
              key={fact.label}
              className={`p-4 lg:px-5 ${index % 2 === 1 ? 'border-l border-border' : ''} ${
                index > 1 ? 'border-t border-border lg:border-t-0' : ''
              } ${index === 2 ? 'lg:border-l' : ''}`}
            >
              <dt className="font-badge text-xs leading-4.5 font-medium text-muted">{fact.label}</dt>
              <dd className="mt-1 font-subheading text-[15px] leading-5 font-bold text-heading">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  )
}

function WhenAndWhere() {
  return (
    <Reveal>
      <div
        id="find-us"
        className="grid scroll-mt-2 gap-4 lg:scroll-mt-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-5"
      >
        <div className="flex flex-col rounded-lg border border-border p-5 lg:p-7">
          <p className="type-eyebrow tracking-[0.16em] text-muted">When &amp; where</p>
          <h2 className="type-h2 mt-3 text-heading">Service times</h2>

          <ul className="mt-3 divide-y divide-border">
            {footerServices.map((service) => (
              <li key={service.name} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-sm bg-slate-100 font-numeric text-[11px] font-semibold text-heading">
                  {service.day}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-subheading text-[15px] leading-5.5 font-bold text-heading">
                    {service.name}
                  </span>
                  <span className="font-body text-[13px] leading-5 text-muted">{service.time}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/#events"
            className="mt-2 mb-5 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-link hover:underline"
          >
            See all weekly services
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>

          <div className="flex flex-col gap-2.5 border-t border-border pt-5 font-body text-sm leading-5.5 text-heading lg:mt-auto">
            <p className="flex gap-2.5">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary-blue" />
              <span>
                {churchLocation.address[0]}
                <br />
                {churchLocation.address[1]}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone aria-hidden="true" className="size-4 shrink-0 text-primary-blue" />
              {churchLocation.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-border">
          <iframe
            src={churchLocation.mapEmbed}
            title={`Map showing ${churchLocation.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-65 w-full flex-1 border-0 bg-slate-100 lg:h-auto lg:min-h-100"
          />
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between lg:px-5">
            <div>
              <p className="font-subheading text-base leading-6 font-bold text-heading">
                {churchLocation.name}
              </p>
              <p className="type-body-sm text-muted">{churchLocation.note}</p>
            </div>
            <a
              href={externalLinks.directions}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-pill bg-ink px-5 font-ui text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-900"
            >
              Get directions
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function TextField({ label, value, onChange, invalid, ...inputProps }) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="font-form text-sm leading-5 font-semibold text-heading">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`type-input mt-2 h-12 w-full rounded-md border bg-white px-4 text-heading placeholder:text-slate-400 ${
          invalid ? 'border-coral-500' : 'border-border'
        }`}
        {...inputProps}
      />
    </div>
  )
}

function missingDetailsMessage(name, contact) {
  if (!name && !contact) return 'Add your name and a phone number or email.'
  return name ? 'Add a phone number or email.' : 'Add your name.'
}

function VisitForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [when, setWhen] = useState(WHEN_OPTIONS[0])
  const [people, setPeople] = useState(1)
  const [firstTime, setFirstTime] = useState(true)
  const [error, setError] = useState('')
  const [showMissing, setShowMissing] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const trimmedName = name.trim()
  const trimmedContact = contact.trim()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!trimmedName || !trimmedContact) {
      setShowMissing(true)
      setError(missingDetailsMessage(trimmedName, trimmedContact))
      return
    }

    setError('')
    setSending(true)
    const saved = await sendVisitDetails({
      name: trimmedName,
      contact: trimmedContact,
      when,
      people,
      firstTime,
    })
    setSending(false)

    if (saved) setSent(true)
    else setError('We couldn’t send this just now. Please try again in a moment.')
  }

  if (sent) {
    const firstName = trimmedName.split(/\s+/)[0]
    const unsure = when === WHEN_OPTIONS[2]

    return (
      <div role="status" className="flex flex-col items-center gap-3 py-8 text-center lg:py-20">
        <span className="flex size-15 items-center justify-center rounded-full bg-heritage-gold text-ink">
          <Check aria-hidden="true" className="size-6" />
        </span>
        <p className="type-h3 text-heading">
          {unsure ? `Thank you, ${firstName}!` : `See you on Sunday, ${firstName}!`}
        </p>
        <p className="type-body max-w-95 text-body">
          {unsure
            ? 'We’ll be glad to welcome you whenever you can come. Look out for the welcome team at the entrance.'
            : 'We’ve saved you a seat. Look out for the welcome team at the entrance when you arrive.'}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-1 h-11 cursor-pointer rounded-pill border border-border bg-white px-5 font-ui text-sm font-semibold text-heading transition-colors hover:bg-slate-100"
        >
          Change details
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Your name"
          value={name}
          onChange={setName}
          invalid={showMissing && !trimmedName}
          autoComplete="name"
          placeholder="First and last name"
        />
        <TextField
          label="Phone or email"
          value={contact}
          onChange={setContact}
          invalid={showMissing && !trimmedContact}
          autoComplete="email"
          placeholder="So we can say hello"
        />
      </div>

      <div role="group" aria-labelledby="visit-when">
        <p id="visit-when" className="font-form text-sm leading-5 font-semibold text-heading">
          When are you coming?
        </p>
        <div className="mt-2 flex gap-1.5 sm:gap-2">
          {WHEN_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={when === option}
              onClick={() => setWhen(option)}
              className={`h-11 min-w-0 flex-1 cursor-pointer rounded-pill border px-1 font-ui text-[13px] font-semibold transition-colors sm:text-sm ${
                when === option
                  ? 'border-ink bg-ink text-white'
                  : 'border-border bg-white text-heading hover:bg-slate-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
        <div className="flex items-center justify-between gap-3 sm:block">
          <p id="visit-people" className="font-form text-sm leading-5 font-semibold text-heading">
            How many of you?
          </p>
          <div
            role="group"
            aria-labelledby="visit-people"
            className="flex items-center justify-between gap-1 rounded-md border border-border p-1 sm:mt-2"
          >
            <button
              type="button"
              aria-label="One fewer"
              disabled={people === 1}
              onClick={() => setPeople(people - 1)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-sm bg-slate-100 text-heading disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="size-4" />
            </button>
            <span
              aria-live="polite"
              className="w-8 text-center font-numeric text-base font-semibold text-heading"
            >
              {people}
            </span>
            <button
              type="button"
              aria-label="One more"
              disabled={people === MAX_PEOPLE}
              onClick={() => setPeople(people + 1)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-sm bg-slate-100 text-heading disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        <label className="flex h-12 cursor-pointer items-center gap-3 rounded-md border border-border px-4 font-form text-sm font-semibold text-heading">
          <input
            type="checkbox"
            checked={firstTime}
            onChange={(event) => setFirstTime(event.target.checked)}
            className="size-5 accent-ink"
          />
          It’s my first time
        </label>
      </div>

      {error && (
        <p role="alert" className="font-form text-sm leading-5 font-medium text-coral-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-pill bg-ink font-ui text-[15px] font-semibold text-white transition-colors hover:bg-blue-900 disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? 'Sending…' : 'Save me a seat'}
        {!sending && <ArrowRight aria-hidden="true" className="size-4" />}
      </button>
      <p className="text-center font-badge text-xs leading-4.5 font-medium text-muted">
        We’ll only use this to welcome you. No mailing lists.
      </p>
    </form>
  )
}

function ComingThisSunday() {
  return (
    <Reveal>
      <div
        id="rsvp"
        className="-mx-5 grid scroll-mt-2 items-start gap-6 bg-slate-100 px-5 py-10 md:mx-0 md:rounded-xl md:p-8 lg:scroll-mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-14 lg:p-12"
      >
        <div>
          <p className="type-eyebrow tracking-[0.16em] text-gold-700">Let us know</p>
          <h2 className="type-h2 mt-3 text-heading lg:type-h1">Coming this Sunday?</h2>
          <p className="type-body mt-3 text-body">
            Tell us you’re coming and we’ll save you a seat, with someone ready to welcome you at the
            door.
          </p>
          <p className="type-body-sm mt-5 border-t border-border pt-4 text-muted">
            Not ready to visit yet?{' '}
            <Link to="/#live" className="font-ui font-semibold text-link hover:underline">
              Watch a service online first
            </Link>
            .
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 lg:p-7">
          <VisitForm />
        </div>
      </div>
    </Reveal>
  )
}

function Questions() {
  const [open, setOpen] = useState(0)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
      <Reveal>
        <p className="type-eyebrow tracking-[0.16em] text-muted">Good questions</p>
        <h2 className="type-h2 mt-3 text-heading lg:type-h1">Before you come.</h2>
        <p className="type-body mt-3 text-body max-lg:hidden">
          Something else on your mind?{' '}
          <Link to="/contact" className="font-ui font-semibold text-link hover:underline">
            Get in touch
          </Link>
          .
        </p>
      </Reveal>

      <Reveal delay={120}>
        <ul className="divide-y divide-border border-y border-border">
          {visitQuestions.map(({ question, answer }, index) => {
            const isOpen = open === index
            const Icon = isOpen ? Minus : Plus

            return (
              <li key={question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 text-left"
                  >
                    <span className="font-subheading text-base leading-6 font-bold text-heading lg:text-lg">
                      {question}
                    </span>
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen ? 'bg-ink text-white' : 'bg-slate-100 text-heading'
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                  </button>
                </h3>
                {isOpen && <p className="type-body pr-11 pb-5 text-body">{answer}</p>}
              </li>
            )
          })}
        </ul>
        <p className="type-body mt-4 text-body lg:hidden">
          Something else on your mind?{' '}
          <Link to="/contact" className="font-ui font-semibold text-link hover:underline">
            Get in touch
          </Link>
          .
        </p>
      </Reveal>
    </div>
  )
}

function Visit() {
  return (
    <section aria-labelledby="visit-title" className="bg-white">
      <SectionTape>VISIT US</SectionTape>
      <div className="mx-auto flex max-w-300 flex-col gap-14 px-5 pt-10 pb-14 md:px-10 lg:gap-20 lg:py-16">
        <Intro />
        <WhatToExpect />
        <WhenAndWhere />
        <ComingThisSunday />
        <Questions />
      </div>
    </section>
  )
}

export default Visit
