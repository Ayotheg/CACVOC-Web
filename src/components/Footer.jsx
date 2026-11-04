import { Link } from 'react-router'
import {
  externalLinks,
  footerBranches,
  footerExplore,
  footerWatchGive,
  serviceTimes,
  socialLinks,
} from '../data/site'
import { Logo } from './Brand'
import { ArrowRight, ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from './icons'

const currentYear = new Date().getFullYear()

// TODO: connect both newsletter forms to the newsletter service.
const handleSubscribe = (event) => event.preventDefault()

function FooterHeading({ children, className = '' }) {
  return <h2 className={`type-eyebrow text-on-dark-muted ${className}`}>{children}</h2>
}

function FooterLink({ item }) {
  const className =
    'inline-flex items-center gap-3 font-ui text-base leading-6 font-medium text-white transition-colors hover:text-gold-300'

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
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </a>
    )
  }
  return (
    <Link to={item.to} className={className}>
      {item.label}
      {item.badge && (
        <span className="type-badge rounded-pill bg-coral-500 px-2.5 py-1 text-white">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function LinkList({ items, className = '' }) {
  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
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
      <Link to="/" className="flex items-center gap-3 lg:gap-4">
        <Logo className="size-13 lg:size-16" />
        <span className="flex flex-col gap-0.5 lg:gap-1">
          <span className="type-h4 font-heading leading-6 text-white">
            Christ Apostolic <br className="max-lg:hidden" />
            Church
          </span>
          <span className="type-caption text-on-dark-muted">Vineyard of Comfort</span>
        </span>
      </Link>
      <ul className="mt-5 flex gap-3 lg:mt-6 lg:gap-2.5">
        {socialLinks.map(({ label, icon: Icon, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 lg:size-11.5"
            >
              <Icon aria-hidden="true" className="size-5" />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

function MobileNewsletter() {
  return (
    <section className="mt-9 border-t border-white/15 pt-9">
      <h2 className="font-heading text-lg leading-6 font-bold text-white">
        Get church updates by email
      </h2>
      <form
        onSubmit={handleSubscribe}
        className="mt-4 flex h-13 items-center rounded-pill border border-white/25 bg-white/10 p-1"
      >
        <label htmlFor="newsletter-email-mobile" className="sr-only">
          Email address
        </label>
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
          className="type-button h-full cursor-pointer rounded-pill bg-white px-5 text-heading transition-colors hover:bg-blue-100"
        >
          Subscribe
        </button>
      </form>
    </section>
  )
}

function DesktopNewsletter() {
  return (
    <section className="flex items-end justify-between gap-8 border-b border-white/15 pb-16">
      <div className="max-w-125">
        <p className="type-eyebrow text-heritage-gold">Newsletter</p>
        <h2 className="type-h1 mt-4 text-white">Stay in the loop.</h2>
        <p className="type-body-lg mt-4 text-on-dark-muted">
          Service updates, upcoming events and new teachings, straight to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="w-full max-w-122">
        <div className="flex gap-2.5">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="type-input h-14 min-w-0 flex-1 rounded-pill border border-white/25 bg-white/10 px-6 text-white placeholder:text-blue-300"
          />
          <button
            type="submit"
            className="type-button h-14 cursor-pointer rounded-pill bg-white px-7 text-heading transition-colors hover:bg-blue-100"
          >
            Subscribe
          </button>
        </div>
        <p className="type-helper mt-3 pl-6 text-on-dark-muted">No spam. Unsubscribe anytime.</p>
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
    <footer className="overflow-hidden rounded-t-xl bg-bg-dark">
      <div className="mx-auto max-w-360 px-5 pt-12 md:px-10 lg:pt-16 xl:px-20 xl:pt-22">
        <div className="lg:hidden">
          <FooterBrand />
          <MobileNewsletter />
        </div>
        <div className="max-lg:hidden">
          <DesktopNewsletter />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-11 lg:grid-cols-3 lg:gap-x-8 lg:py-16 xl:grid-cols-[1.45fr_1fr_1fr_1.3fr_1.1fr]">
          <div className="max-lg:hidden lg:col-span-3 xl:col-span-1">
            <FooterBrand />
          </div>

          <div>
            <FooterHeading>Explore</FooterHeading>
            <LinkList items={footerExplore} className="mt-5" />
          </div>

          <div>
            <FooterHeading>Watch &amp; Give</FooterHeading>
            <LinkList items={footerWatchGive} className="mt-5" />
            <div className="max-lg:hidden">
              <FooterHeading className="mt-9">Our branches</FooterHeading>
              <LinkList items={footerBranches} className="mt-5" />
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FooterHeading>Service times</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3 lg:gap-4">
              {serviceTimes.map((service) => (
                <li key={service.name} className="flex items-center gap-3.5">
                  <span className="type-datetime flex h-9 w-13 shrink-0 items-center justify-center rounded-sm bg-blue-800 text-white">
                    {service.day}
                  </span>
                  <span className="flex flex-col">
                    <span className="type-body text-white">{service.name}</span>
                    <span className="type-body-sm text-on-dark-muted">{service.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <FooterHeading>Visit us</FooterHeading>
            <ul className="type-body mt-5 flex flex-col gap-4 text-white">
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-on-dark-muted" />
                <span>
                  [Street address]<span className="lg:hidden">,</span>{' '}
                  <br className="max-lg:hidden" />
                  Oke-Odo, [City]
                </span>
              </li>
              <li className="flex gap-3">
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-on-dark-muted max-lg:hidden"
                />
                [Phone number]
              </li>
              <li className="flex gap-3">
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-on-dark-muted max-lg:hidden"
                />
                [Email address]
              </li>
            </ul>
            <a
              href={externalLinks.directions}
              target="_blank"
              rel="noreferrer"
              className="type-button mt-5 inline-flex items-center gap-2 text-heritage-gold transition-colors hover:text-gold-300"
            >
              Get directions
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          <div className="col-span-2 lg:hidden">
            <FooterHeading>Our branches</FooterHeading>
            <LinkList items={footerBranches} className="mt-5" />
          </div>
        </div>

        <section className="rounded-lg bg-blue-800 p-5.5 md:px-10 md:py-8">
          <p className="type-eyebrow text-heritage-gold">2026 CAC Watchword</p>
          <blockquote className="mt-3 flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-baseline">
            <p className="type-quote-lg text-white max-lg:text-[20px] max-lg:leading-7.5">
              “Open my eyes, that I may behold wondrous things out of your law.”
            </p>
            <cite className="type-eyebrow text-heritage-gold not-italic">Psalm 119:18</cite>
          </blockquote>
        </section>

        <div className="mt-9 flex flex-col items-start gap-5 border-t border-white/15 pt-6 lg:mt-12 lg:flex-row lg:items-center lg:justify-between">
          <p className="type-caption text-on-dark-muted">
            © {currentYear} Christ Apostolic Church, Vineyard of Comfort. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="type-nav flex cursor-pointer items-center gap-3 text-on-dark-muted transition-colors hover:text-white"
          >
            Back to top
            <span className="flex size-8 items-center justify-center rounded-full bg-blue-800 text-white">
              <ArrowUp aria-hidden="true" className="size-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Deliberately cut off by the bottom of the page, as in the design. */}
      <div
        aria-hidden="true"
        className="mt-12 flex justify-center overflow-hidden select-none lg:mt-20"
        style={{ height: 'min(14vw, 140px)' }}
      >
        <span
          className="type-accent-wordmark whitespace-nowrap text-blue-800"
          style={{ fontSize: 'min(17.6vw, 180px)', lineHeight: 0.85 }}
        >
          Agbala Itura
        </span>
      </div>
    </footer>
  )
}

export default Footer
