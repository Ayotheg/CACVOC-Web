/* Small building blocks shared by the admin tabs. */
import { formatNumber } from './format'

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-lg border border-border bg-white p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-heading text-base font-bold text-heading">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function StatTile({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 md:p-5">
      <p className="font-form text-sm font-semibold text-muted">{label}</p>
      <p className="mt-1 font-numeric text-3xl font-semibold text-heading">{formatNumber(value)}</p>
      {hint && <p className="mt-1 font-form text-xs text-muted">{hint}</p>}
    </div>
  )
}

/* A ranked list with a thin bar behind each row, e.g. top pages. One measure, one colour. */
export function BarList({ rows, valueKey = 'visitors', empty = 'Nothing yet.' }) {
  if (!rows?.length) return <p className="font-form text-sm text-muted">{empty}</p>
  const max = Math.max(...rows.map((row) => row[valueKey]), 1)
  return (
    <ul className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <li key={row.label} className="relative flex items-center justify-between gap-3 px-2 py-1.5">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-sm bg-blue-100"
            style={{ width: `${(row[valueKey] / max) * 100}%` }}
          />
          <span className="relative min-w-0 truncate font-form text-sm text-heading" title={row.label}>
            {row.label}
          </span>
          <span className="relative font-numeric text-sm font-semibold text-heading">
            {formatNumber(row[valueKey])}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Notice({ children, tone = 'muted' }) {
  const color = tone === 'error' ? 'text-coral-700' : 'text-muted'
  return <p className={`py-6 text-center font-form text-sm ${color}`}>{children}</p>
}

export const pillButton =
  'flex h-10 cursor-pointer items-center gap-2 rounded-pill border border-border bg-white px-4 font-ui text-sm font-semibold text-heading transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'

export function Segmented({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex rounded-pill border border-border bg-white p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`h-8 cursor-pointer rounded-pill px-3 font-ui text-sm font-semibold whitespace-nowrap transition-colors ${
            value === option.value ? 'bg-ink text-white' : 'text-heading hover:bg-slate-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
