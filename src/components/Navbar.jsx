import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { navLinks } from '../data/site'
import { Brand } from './Brand'
import { ArrowUpRight, ChevronDown, Menu } from './icons'
import LiveDot from './LiveDot'
import MobileMenu from './MobileMenu'

const NAV_HEIGHT = 72

/* True while the home hero (#hero) is still behind the desktop navbar. */
function useOverHero(isHome) {
  const [heroVisible, setHeroVisible] = useState(true)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!isHome || !hero) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px` },
    )
    observer.observe(hero)

    return () => {
      observer.disconnect()
      setHeroVisible(true)
    }
  }, [isHome])

  return isHome && heroVisible
}

function linkClass({ isActive, overHero }) {
  const base =
    'flex items-center gap-1 rounded-pill px-3 py-1.5 font-ui text-sm leading-5 font-medium transition-colors'
  if (overHero) return `${base} text-white hover:bg-white/15`
  return `${base} ${isActive ? 'text-coral-700' : 'text-heading'} hover:bg-white`
}

function AboutDropdown({ link, overHero }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!open) return undefined

    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`${linkClass({ isActive: pathname.startsWith(link.to), overHero })} cursor-pointer`}
      >
        {link.label}
        <ChevronDown
          aria-hidden="true"
          className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute top-full left-0 mt-3 w-48 rounded-md border border-border bg-white p-2 shadow-card">
          {link.children.map((child) => (
            <li key={child.to}>
              <Link
                to={child.to}
                onClick={() => setOpen(false)}
                className="block rounded-sm px-3 py-2 font-ui text-sm leading-5 font-medium text-heading transition-colors hover:bg-slate-100"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Navbar() {
  const { pathname } = useLocation()
  const overHero = useOverHero(pathname === '/')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        overHero
          ? 'border-border bg-white xl:border-transparent xl:bg-transparent'
          : 'border-border bg-white'
      }`}
    >
      <div className="mx-auto flex h-17 max-w-300 items-center justify-between gap-2 px-5 md:px-10 xl:h-18 xl:gap-4">
        <Brand
          nameClass={overHero ? 'text-heading xl:text-white' : 'text-heading'}
          subClass={overHero ? 'text-link xl:text-white' : 'text-link'}
        />

        <nav
          aria-label="Main"
          className={`hidden items-center gap-0.5 rounded-pill border p-1 transition-colors xl:flex ${
            overHero ? 'border-white/25 bg-white/10' : 'border-border bg-slate-100'
          }`}
        >
          {navLinks.map((link) => {
            if (link.children) {
              return <AboutDropdown key={link.label} link={link} overHero={overHero} />
            }
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

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            to="/give"
            className={`flex h-10 items-center rounded-pill border px-5 font-ui text-sm font-semibold transition-colors ${
              overHero
                ? 'border-white/50 text-white hover:bg-white/15'
                : 'border-border text-heading hover:bg-slate-100'
            }`}
          >
            Give
          </Link>
          <Link
            to="/live"
            className="flex h-10 items-center gap-1.5 rounded-pill bg-primary-blue px-4 font-ui text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <LiveDot />
            Watch live
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          {/* Dropped on the narrowest phones, where it won't fit. The menu has Watch live too. */}
          <Link
            to="/live"
            className="flex h-11 items-center gap-1.5 rounded-pill bg-primary-blue pr-3.5 pl-2.5 font-ui text-sm font-semibold text-white max-[383px]:hidden"
          >
            <LiveDot />
            Live
          </Link>
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
