import { useEffect, useMemo, useState } from 'react'
import { Download, Search } from '../components/icons'
import { downloadCsv, formatDateTime, formatNumber, lagosToday, timeAgo } from './format'
import { supabase } from './supabase'
import { Notice, Panel, pillButton } from './ui'

/* Column names Resend's contact import recognises, so this file can be imported as it is. */
const CSV_COLUMNS = [
  { label: 'email', value: (row) => row.email },
  { label: 'subscribed_at', value: (row) => row.created_at },
]

function Subscribers() {
  const [subscribers, setSubscribers] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    supabase
      .from('subscribers')
      .select('id,email,created_at')
      .order('created_at', { ascending: false })
      .limit(10000)
      .then(({ data, error: loadError }) => {
        if (loadError) setError('Couldn’t load subscribers. Try refreshing the page.')
        else setSubscribers(data)
      })
  }, [])

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return (subscribers ?? []).filter((row) => !needle || row.email.includes(needle))
  }, [subscribers, query])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="type-h3 text-heading">
          Subscribers
          {subscribers && (
            <span className="ml-2 font-numeric text-base font-medium text-muted">
              {formatNumber(subscribers.length)}
            </span>
          )}
        </h1>
        <button
          type="button"
          disabled={!subscribers?.length}
          onClick={() => downloadCsv(`subscribers-${lagosToday()}.csv`, CSV_COLUMNS, subscribers)}
          className={pillButton}
        >
          <Download aria-hidden="true" className="size-4" />
          Download CSV
        </button>
      </div>

      <label className="relative max-w-100">
        <span className="sr-only">Search subscribers</span>
        <Search aria-hidden="true" className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search email"
          className="type-input h-10 w-full rounded-pill border border-border bg-white pr-4 pl-10 text-heading placeholder:text-slate-400"
        />
      </label>

      {error && <Notice tone="error">{error}</Notice>}
      {!subscribers && !error && <Notice>Loading…</Notice>}
      {subscribers && !shown.length && <Notice>No subscribers yet.</Notice>}

      {shown.length > 0 && (
        <Panel>
          <ul className="divide-y divide-border">
            {shown.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5">
                <span className="min-w-0 truncate font-form text-sm font-semibold text-heading">{row.email}</span>
                <span className="font-form text-sm text-muted" title={formatDateTime(row.created_at)}>
                  {timeAgo(row.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <p className="font-form text-xs text-muted">
        Newsletters are sent from Resend. Unsubscribes are handled there too, so Resend’s contact list
        is the one to send to.
      </p>
    </div>
  )
}

export default Subscribers
