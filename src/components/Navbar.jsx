import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { navLinks } from '../data/site'
import { useLiveStatus } from '../live/liveStatus'
import { Brand } from './Brand'
import { ArrowUpRight, Menu } from './icons'
import LiveDot from './LiveDot'
import MobileMenu from './MobileMenu'

function linkClass({ isActive, overHero }) {
  const base =
    'flex items-center gap-1 rounded-pill px-3 py-1.5 font-ui text-sm leading-5 font-medium transition-colors'
  if (overHero) return `${base} text-white hover:bg-white/15`
  return `${base} ${isActive ? 'text-coral-700' : 'text-heading'} hover:bg-white`
}

function Navbar() {
  const { pathname } = useLocation()
  // On the home page the navbar sits over the hero. There and on Plan a Visit it scrolls away,
  // and the tape takes over as the header. Other pages keep it fixed.
  const overHero = pathname === '/'
  const scrollsAway = overHero || pathname === '/visit'
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLive } = useLiveStatus()

  return (
    <header
      className={`inset-x-0 top-0 z-50 border-b border-border bg-white transition-colors duration-200 ${
        scrollsAway ? 'absolute' : 'fixed'
      } ${overHero ? 'lg:border-transparent lg:bg-transparent' : ''}`}
    >
      <div className="mx-auto flex h-17 max-w-300 items-center justify-between gap-2 px-5 md:px-10 lg:h-18 lg:gap-4">
        <Brand
          nameClass={overHero ? 'text-heading lg:text-white' : 'text-heading'}
          subClass={overHero ? 'text-link lg:text-white' : 'text-link'}
        />

        <nav
          aria-label="Main"
          className={`hidden items-center gap-0.5 rounded-pill border p-1 transition-colors lg:flex ${
            overHero ? 'border-white/25 bg-white/10' : 'border-border bg-slate-100'
          }`}
        >
          {navLinks.map((link) => {
            if (link.href) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass({ isActive: false, overHero })}
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              )
            }
            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) => linkClass({ isActive, overHero })}
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/#support"
            className={`flex h-10 items-center rounded-pill border px-5 font-ui text-sm font-semibold transition-colors ${
              overHero
                ? 'border-white/50 text-white hover:bg-white/15'
                : 'border-border text-heading hover:bg-slate-100'
            }`}
          >
            Give
          </Link>
          <Link
            to="/#live"
            className="flex h-10 items-center gap-1.5 rounded-pill bg-primary-blue px-4 font-ui text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            {isLive && <LiveDot />}
            Watch live
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {/* Only while live, and dropped on the narrowest phones, where it won't fit. */}
          {isLive && (
            <Link
              to="/#live"
              className="flex h-11 items-center gap-1.5 rounded-pill bg-primary-blue pr-3.5 pl-2.5 font-ui text-sm font-semibold text-white max-[383px]:hidden"
            >
              <LiveDot />
              Live
            </Link>
          )}
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-heading"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}

export default Navbar
