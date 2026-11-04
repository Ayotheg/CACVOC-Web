import { Link } from 'react-router'
import {
  externalLinks,
  footerBranches,
  footerExplore,
  footerWatchGive,
  socialLinks,
} from '../data/site'
import { footerServices } from '../data/services'
import { useLiveStatus } from '../live/liveStatus'
import { Logo } from './Brand'
import { ArrowRight, ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from './icons'
import Reveal from './Reveal'

const currentYear = new Date().getFullYear()

// TODO: connect both newsletter forms to the newsletter service.
const handleSubscribe = (event) => event.preventDefault()

function FooterHeading({ children, className = '' }) {
  return <h2 className={`type-eyebrow text-on-dark-muted ${className}`}>{children}</h2>
}

function FooterLink({ item }) {
  const { isLive } = useLiveStatus()
  const className =
    'inline-flex items-center gap-2 font-ui text-sm leading-5 font-medium text-white transition-colors hover:text-gold-300'

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {item.mobileLabel ? (
          <>
            <span className="lg:hidden">{item.mobileLabel}</span>
            <span className="max-lg:hidden">{item.label}</span>
          </>
        ) : (
          item.label
        )}
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </a>
    )
  }
  return (
    <Link to={item.to} className={className}>
      {item.label}
      {item.showLiveBadge && isLive && (
        <span className="rounded-pill bg-coral-500 px-2 py-0.5 font-badge text-[11px] leading-4 font-semibold text-white">
          Live
        </span>
      )}
    </Link>
  )
}

function LinkList({ items, className = '' }) {
  return (
    <ul className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item.label}>
          <FooterLink item={item} />
        </li>
      ))}
    </ul>
  )
}

function FooterBrand() {
  return (
    <>
      <Link to="/" className="flex items-center gap-3">
        <Logo className="size-12" />
        <span className="flex flex-col gap-0.5">
          <span className="font-heading text-base leading-5 font-bold text-white">
            Christ Apostolic <br className="max-lg:hidden" />
            Church
          </span>
          <span className="font-badge text-xs leading-4.5 font-medium text-on-dark-muted">
            Vineyard of Comfort
          </span>
        </span>
      </Link>
      <ul className="mt-4 flex gap-2">
        {socialLinks.map(({ label, icon: Icon, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex size-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
            >
              <Icon aria-hidden="true" className="size-4" />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

function MobileNewsletter() {
  return (
    <section className="mt-7 border-t border-white/15 pt-7">
      <h2 className="font-heading text-base leading-6 font-bold text-white">
        Get church updates by email
      </h2>
      <form
        onSubmit={handleSubscribe}
        className="mt-3 flex h-12 items-center rounded-pill border border-white/25 bg-white/10 p-1"
      >
        <label htmlFor="newsletter-email-mobile" className="sr-only">
          Email address
        </label>
        {/* Stays at 16px: iOS zooms the page when focusing anything smaller. */}
        <input
          id="newsletter-email-mobile"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          className="type-input h-full min-w-0 flex-1 rounded-pill bg-transparent px-4 text-white placeholder:text-blue-300"
        />
        <button
          type="submit"
          className="h-full cursor-pointer rounded-pill bg-white px-4 font-ui text-sm font-semibold text-heading transition-colors hover:bg-blue-100"
        >
          Subscribe
        </button>
      </form>
    </section>
  )
}

function DesktopNewsletter() {
  return (
    <section className="flex items-end justify-between gap-8 border-b border-white/15 pb-10">
      <div className="max-w-105">
        <p className="type-eyebrow text-heritage-gold">Newsletter</p>
        <h2 className="type-h2 mt-3 text-white">Stay in the loop.</h2>
        <p className="type-body-sm mt-2 text-on-dark-muted">
          Service updates, upcoming events and new teachings, straight to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="w-full max-w-100">
        <div className="flex gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 min-w-0 flex-1 rounded-pill border border-white/25 bg-white/10 px-5 font-form text-sm font-medium text-white placeholder:text-blue-300"
          />
          <button
            type="submit"
            className="h-11 cursor-pointer rounded-pill bg-white px-5 font-ui text-sm font-semibold text-heading transition-colors hover:bg-blue-100"
          >
            Subscribe
          </button>
        </div>
        <p className="mt-2 pl-5 font-form text-xs leading-4.5 font-medium text-on-dark-muted">
          No spam. Unsubscribe anytime.
        </p>
      </form>
    </section>
  )
}

/* Below lg this follows the mobile design: brand first, compact newsletter,
   and branches as their own section after Visit us. */
function Footer() {
  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <footer className="overflow-hidden rounded-t-lg bg-bg-dark">
      <div className="mx-auto max-w-300 px-5 pt-10 md:px-10 lg:pt-14">
        <Reveal className="lg:hidden">
          <FooterBrand />
          <MobileNewsletter />
        </Reveal>
        <Reveal className="max-lg:hidden">
          <DesktopNewsletter />
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-x-6 gap-y-9 py-9 lg:grid-cols-3 lg:gap-x-8 lg:py-10 xl:grid-cols-[1.35fr_1fr_1fr_1.25fr_1.15fr]">
          <div className="max-lg:hidden lg:col-span-3 xl:col-span-1">
            <FooterBrand />
          </div>

          <div>
            <FooterHeading>Explore</FooterHeading>
            <LinkList items={footerExplore} className="mt-4" />
          </div>

          <div>
            <FooterHeading>Watch &amp; Give</FooterHeading>
            <LinkList items={footerWatchGive} className="mt-4" />
            <div className="max-lg:hidden">
              <FooterHeading className="mt-7">Our branches</FooterHeading>
              <LinkList items={footerBranches} className="mt-4" />
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FooterHeading>Service times</FooterHeading>
            <ul className="mt-4 flex flex-col gap-3">
              {footerServices.map((service) => (
                <li key={service.name} className="flex items-center gap-3">
                  <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm bg-blue-800 font-numeric text-xs font-semibold text-white">
                    {service.day}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-body text-sm leading-5 text-white">{service.name}</span>
                    <span className="font-body text-xs leading-4.5 text-on-dark-muted">
                      {service.time}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FooterHeading>Visit us</FooterHeading>
            <ul className="mt-4 flex flex-col gap-3 font-body text-sm leading-5 text-white">
              <li className="flex gap-2.5">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-on-dark-muted" />
                <span>
                  [Street address]<span className="lg:hidden">,</span>{' '}
                  <br className="max-lg:hidden" />
                  Oke-Odo, [City]
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-on-dark-muted max-lg:hidden"
                />
                [Phone number]
              </li>
              <li className="flex gap-2.5">
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-on-dark-muted max-lg:hidden"
                />
                [Email address]
              </li>
            </ul>
            <a
              href={externalLinks.directions}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-ui text-sm font-semibold text-heritage-gold transition-colors hover:text-gold-300"
            >
              Get directions
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>

          <div className="col-span-2 lg:hidden">
            <FooterHeading>Our branches</FooterHeading>
            <LinkList items={footerBranches} className="mt-4" />
          </div>
        </Reveal>

        <Reveal>
          <section className="rounded-lg bg-blue-800 p-5 md:px-7 md:py-5">
            <p className="type-eyebrow text-heritage-gold">2026 CAC Watchword</p>
            <blockquote className="mt-2 flex flex-col gap-1.5 lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-2">
              <p className="type-quote text-white">
                “Open thou mine eyes, that I may behold wondrous things out of thy law.”
              </p>
              <cite className="type-eyebrow text-heritage-gold not-italic">Psalm 119:18</cite>
            </blockquote>
          </section>
        </Reveal>

        <div className="mt-7 flex flex-col items-start gap-4 border-t border-white/15 pt-5 lg:mt-9 lg:flex-row lg:items-center lg:justify-between xl:pr-44">
          <p className="font-badge text-xs leading-4.5 font-medium text-on-dark-muted">
            © {currentYear} Christ Apostolic Church, Vineyard of Comfort. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex cursor-pointer items-center gap-2.5 font-ui text-sm font-medium text-on-dark-muted transition-colors hover:text-white"
          >
            Back to top
            <span className="flex size-7 items-center justify-center rounded-full bg-blue-800 text-white">
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </span>
          </button>
        </div>
      </div>

      {/* Deliberately cut off by the bottom of the page, as in the design. */}
      <div
        aria-hidden="true"
        className="mt-8 flex justify-center overflow-hidden select-none lg:mt-10"
        style={{ height: 'min(14vw, 92px)' }}
      >
        <span
          className="type-accent-wordmark whitespace-nowrap text-blue-800"
          style={{ fontSize: 'min(17.6vw, 118px)', lineHeight: 0.85 }}
        >
          Agbala Itura
        </span>
      </div>
    </footer>
  )
}

export default Footer
