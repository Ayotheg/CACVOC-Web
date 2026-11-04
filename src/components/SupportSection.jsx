import { useEffect, useRef, useState } from 'react'
import { accounts } from '../data/support'
import { Check, Copy, Shield } from './icons'
import Reveal from './Reveal'
import SectionTape from './SectionTape'

const COPIED_FOR_MS = 2000

/* The browser's clipboard only works on https or localhost, so the older method is the fallback,
   for example when testing on a phone over the local network. */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const field = document.createElement('textarea')
    field.value = text
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.append(field)
    field.select()
    const copied = document.execCommand('copy')
    field.remove()
    return copied
  }
}

function CopyButton({ number, purpose }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async () => {
    // If copying fails it never claims success. The number can still be selected by hand.
    if (!(await copyText(number))) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_FOR_MS)
  }

  const Icon = copied ? Check : Copy

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Account number copied' : `Copy ${purpose} account number ${number}`}
      className={`col-start-2 row-start-2 flex h-11 shrink-0 cursor-pointer items-center gap-1.5 self-center rounded-pill border px-4 font-ui text-sm font-semibold transition-colors lg:row-span-3 lg:row-start-1 ${
        copied
          ? 'border-success bg-success/10 text-success'
          : 'border-border bg-white text-heading hover:bg-slate-100'
      }`}
    >
      <Icon aria-hidden="true" className="size-4" />
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function AccountCard({ account }) {
  const hasRealNumber = !account.number.startsWith('[')

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 rounded-lg border border-border bg-white p-4.5 lg:px-6 lg:py-5">
      <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 lg:col-span-1 lg:justify-start">
        <h3 className="font-subheading text-base leading-6 font-bold text-heading">
          {account.purpose}
        </h3>
        <span className="rounded-pill bg-slate-100 px-2.5 py-0.5 font-badge text-xs leading-4.5 font-medium text-body">
          {account.bank}
        </span>
      </div>
      <p
        className={`self-center font-numeric text-lg leading-8 font-semibold tracking-wider text-ink select-all min-[360px]:text-xl sm:text-2xl lg:text-[26px] ${
          hasRealNumber ? '' : 'col-span-2 lg:col-span-1'
        }`}
      >
        {account.number}
      </p>
      {hasRealNumber && <CopyButton number={account.number} purpose={account.purpose} />}
      <p className="col-span-2 font-body text-[13px] leading-5 text-muted lg:col-span-1 lg:text-sm">
        {account.name}
      </p>
    </article>
  )
}

function Verse({ className }) {
  return (
    <blockquote className={`border-t border-border pt-5 lg:pt-6 ${className}`}>
      <p className="type-quote text-heading">
        “Every man according as he purposeth in his heart, so let him give… for God loveth a
        cheerful giver.”
      </p>
      <cite className="mt-1.5 block font-badge text-xs leading-4.5 font-semibold tracking-[0.08em] text-gold-700 uppercase not-italic">
        2 Corinthians 9:7
      </cite>
    </blockquote>
  )
}

const WORDS = [
  { text: 'GOD', color: 'fill-primary-blue stroke-primary-blue', delay: '0s' },
  { text: 'BLESS', color: 'fill-heritage-gold stroke-heritage-gold', delay: '0.6s' },
  { text: 'YOU', color: 'fill-youth-coral stroke-youth-coral', delay: '1.2s' },
]

/* Each word is drawn in outline, then fills in. It only animates while it can be seen, because
   redrawing large outlined text is heavy work for a phone. */
function GodBlessYou() {
  const rootRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      role="note"
      aria-label="God bless you. Thank you for stopping by."
      className="mt-12 flex flex-col items-center gap-3 text-center lg:mt-16"
    >
      <p aria-hidden="true" className="type-eyebrow text-[11px] tracking-[0.16em] text-muted">
        Thank you for stopping by
      </p>

      <svg aria-hidden="true" viewBox="0 0 1200 170" className="w-full max-w-200 overflow-visible">
        <text
          x="600"
          y="140"
          textAnchor="middle"
          className="font-accent text-[150px] font-extrabold tracking-[-5px]"
        >
          {WORDS.map((word) => (
            <tspan
              key={word.text}
              className={`${word.color} motion-safe:animate-write motion-safe:[stroke-dasharray:var(--dash)]`}
              style={{
                '--dash': 1600,
                strokeWidth: 2.5,
                animationDelay: word.delay,
                animationPlayState: visible ? 'running' : 'paused',
              }}
            >
              {word.text}{' '}
            </tspan>
          ))}
        </text>
      </svg>
    </div>
  )
}

function SupportSection() {
  return (
    // The negative margin cancels the page-wide scroll padding, so "Give" lands with this
    // section's tape at the very top.
    <section id="support" aria-labelledby="support-title" className="-scroll-mt-18 bg-white">
      <SectionTape>SUPPORT</SectionTape>

      <div className="mx-auto max-w-300 px-5 py-14 md:px-10 lg:py-20">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <p className="type-eyebrow tracking-[0.16em] text-muted">Support the church</p>
            <h2 id="support-title" className="type-h2 mt-3 text-heading lg:type-h1 lg:mt-4">
              Partner with us <br className="max-lg:hidden" />
              in the work.
            </h2>
            <p className="type-body mt-3 text-body lg:mt-4">
              Your giving keeps the doors open, the youth growing and the Word going out. Give by
              bank transfer to any of the accounts here.
            </p>
            <Verse className="mt-6 max-lg:hidden" />
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-col gap-3">
              {accounts.map((account) => (
                <AccountCard key={account.purpose} account={account} />
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 font-badge text-xs leading-4.5 font-medium text-muted lg:text-[13px]">
              <Shield aria-hidden="true" className="mt-px size-4 shrink-0" />
              Bank transfer only. We never ask for card details on this site.
            </p>
          </Reveal>

          <Reveal className="lg:hidden">
            <Verse />
          </Reveal>
        </div>

        <Reveal>
          <GodBlessYou />
        </Reveal>
      </div>
    </section>
  )
}

export default SupportSection
