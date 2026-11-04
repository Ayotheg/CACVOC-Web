import { Link } from 'react-router'

/* The logo sits in a white disc so it reads on both white and dark surfaces. */
export function Logo({ className = '' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-white p-0.5 ${className}`}
    >
      <img src="/cac-logo.jpg" alt="" className="size-full rounded-full object-contain" />
    </span>
  )
}

export function Brand({ nameClass = 'text-heading', subClass = 'text-link', onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5">
      <Logo className="size-10 xl:size-11" />
      <span className="flex flex-col">
        <span className={`font-heading text-sm leading-4.5 font-bold transition-colors ${nameClass}`}>
          Christ Apostolic Church
        </span>
        <span className={`font-badge text-[11px] leading-4 font-medium transition-colors ${subClass}`}>
          Vineyard of Comfort
        </span>
      </span>
    </Link>
  )
}
