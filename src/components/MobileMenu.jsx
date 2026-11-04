import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { navLinks, socialLinks } from '../data/site'
import { splitStreamTitle, startedLabel, useLiveStatus } from '../live/liveStatus'
import { Brand } from './Brand'
import { ArrowUpRight, ChevronRight, Play, X } from './icons'
import LiveDot from './LiveDot'

function MenuRow({ link, onClose }) {
  const Icon = link.icon
  const content = (
    <>
      <span className="flex size-10.5 shrink-0 items-center justify-center rounded-md border border-border text-heading">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-heading text-lg leading-6 font-bold tracking-tight text-heading">
          {link.menuLabel ?? link.label}
        </span>
        <span className="font-body text-[13px] leading-5.5 text-muted">{link.description}</span>
      </span>
      {link.href ? (
        <ArrowUpRight aria-hidden="true" className="size-5 text-slate-400" />
      ) : (
        <ChevronRight aria-hidden="true" className="size-5 text-slate-400" />
      )}
    </>
  )
  const className = 'flex items-center gap-3.5 py-2.5'

  if (link.href) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    )
  }
  return (
    <Link to={link.to} onClick={onClose} className={className}>
      {content}
    </Link>
  )
}

/* Only appears while a service is live, with that stream's own title and start time. */
function LiveNowCard({ onClose }) {
  const { status, isLive } = useLiveStatus()
  if (!isLive) return null

  const stream = status.youtube ?? status.facebook
  const platforms = [status.youtube && 'YouTube', status.facebook && 'Facebook']
    .filter(Boolean)
    .join(' & ')
  const summary = [startedLabel(stream.startedAt), platforms].filter(Boolean).join(' · ')

  return (
    <Link
      to="/#live"
      onClick={onClose}
      className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border py-3 pr-4 pl-3.5"
    >
      <span className="flex min-w-0 flex-col">
        <span className="type-eyebrow flex items-center gap-1.5 text-coral-700">
          <LiveDot />
          Live now
        </span>
        <span className="font-subheading text-[15px] leading-5 font-bold text-heading">
          {splitStreamTitle(stream.title).heading}
        </span>
        <span className="font-badge text-xs leading-4.5 font-medium text-muted">{summary}</span>
      </span>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-heading">
        <Play aria-hidden="true" fill="currentColor" className="size-3.5" />
      </span>
    </Link>
  )
}

/* A native modal <dialog> provides the focus trap, Escape to close and top layer. */
function MobileMenu({ open, onClose }) {
  const dialogRef = useRef(null)
  const { isLive } = useLiveStatus()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open) return undefined

    dialog.showModal()
    document.documentElement.style.overflow = 'hidden'

    // The menu only exists below xl, so close it if the window grows past that.
    const desktop = window.matchMedia('(min-width: 1280px)')
    const closeOnDesktop = (event) => {
      if (event.matches) onClose()
    }
    desktop.addEventListener('change', closeOnDesktop)

    return () => {
      desktop.removeEventListener('change', closeOnDesktop)
      document.documentElement.style.overflow = ''
      dialog.close()
    }
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Menu"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-white"
    >
      <div className="flex min-h-full flex-col">
        <div className="flex h-17 shrink-0 items-center justify-between gap-4 border-b border-border px-5">
          <Brand onClick={onClose} />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-heading"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="flex-1 px-5 pt-6 pb-6">
          <p className="type-eyebrow text-muted">Menu</p>
          <nav aria-label="Mobile" className="mt-3">
            {navLinks.map((link) => (
              <MenuRow key={link.label} link={link} onClose={onClose} />
            ))}
          </nav>

          <LiveNowCard onClose={onClose} />
        </div>

        <div className="shrink-0 border-t border-border px-5 pt-4 pb-5">
          <div className="flex gap-2.5">
            <Link
              to="/#live"
              onClick={onClose}
              className="type-button flex h-13 flex-1 items-center justify-center gap-2 rounded-pill bg-primary-blue text-white"
            >
              {isLive && <LiveDot />}
              Watch live
            </Link>
            <Link
              to="/give"
              onClick={onClose}
              className="type-button flex h-13 w-30 items-center justify-center rounded-pill border border-border text-heading"
            >
              Give
            </Link>
          </div>
          <div className="mt-3.5 flex items-center justify-between gap-3">
            <p className="font-badge text-xs leading-4.5 font-medium text-muted">
              Oke-Odo, Agege · Lagos
            </p>
            <ul className="flex gap-1.5">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-heading"
                  >
                    <Icon aria-hidden="true" className="size-4.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default MobileMenu
