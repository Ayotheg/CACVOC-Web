import { useEffect, useState } from 'react'
import { RefreshCw } from '../components/icons'
import { formatDay, formatNumber } from './format'
import { supabase } from './supabase'
import { BarList, Notice, Panel, Segmented, StatTile, pillButton } from './ui'

const RANGES = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
]

const COUNTRY_NAMES = new Intl.DisplayNames(['en'], { type: 'region' })
function countryName(code) {
  try {
    return code.length === 2 ? COUNTRY_NAMES.of(code) : code
  } catch {
    return code
  }
}

/* Visitors per day as thin bars, with a tooltip on hover or keyboard focus and a table view. */
function DailyChart({ daily }) {
  const [active, setActive] = useState(null)
  const max = Math.max(...daily.map((day) => day.visitors), 1)
  const point = active == null ? null : daily[active]

  return (
    <div>
      <div className="relative">
        <div className="flex justify-between font-numeric text-xs text-muted">
          <span>{formatNumber(max)}</span>
        </div>
        <div
          className="mt-1 flex h-44 items-end gap-0.5 border-b border-slate-300"
          onMouseLeave={() => setActive(null)}
        >
          {daily.map((day, index) => (
            <div
              key={day.day}
              tabIndex={0}
              role="img"
              aria-label={`${formatDay(day.day)}: ${day.visitors} visitors, ${day.views} page views`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="flex h-full min-w-0 flex-1 items-end outline-none focus-visible:bg-blue-50"
            >
              <div
                className={`w-full rounded-t-[4px] transition-colors ${
                  active === index ? 'bg-blue-700' : 'bg-blue-500'
                }`}
                style={{ height: day.visitors ? `${Math.max((day.visitors / max) * 100, 2)}%` : 0 }}
              />
            </div>
          ))}
        </div>
        {point && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md bg-ink px-3 py-2 font-form text-xs whitespace-nowrap text-white shadow-lg"
            style={{ left: `${Math.min(Math.max(((active + 0.5) / daily.length) * 100, 12), 88)}%` }}
          >
            <p className="font-semibold">{formatDay(point.day)}</p>
            <p>{formatNumber(point.visitors)} visitors</p>
            <p className="text-blue-200">{formatNumber(point.views)} page views</p>
          </div>
        )}
        <div className="mt-1.5 flex justify-between font-form text-xs text-muted">
          <span>{daily.length ? formatDay(daily[0].day, { year: false }) : ''}</span>
          <span>{daily.length ? formatDay(daily.at(-1).day, { year: false }) : ''}</span>
        </div>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer font-form text-sm font-semibold text-link">Show as table</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full font-form text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="py-1 font-semibold">Day</th>
                <th className="py-1 text-right font-semibold">Visitors</th>
                <th className="py-1 text-right font-semibold">Page views</th>
              </tr>
            </thead>
            <tbody className="text-heading">
              {[...daily].reverse().map((day) => (
                <tr key={day.day} className="border-t border-border">
                  <td className="py-1">{formatDay(day.day)}</td>
                  <td className="py-1 text-right font-numeric">{formatNumber(day.visitors)}</td>
                  <td className="py-1 text-right font-numeric">{formatNumber(day.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

function Overview() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [reloads, setReloads] = useState(0)
  const load = () => setReloads((count) => count + 1)

  useEffect(() => {
    let current = true
    supabase.rpc('admin_analytics', { days }).then(({ data: result, error: loadError }) => {
      if (!current) return
      setError(loadError ? 'Couldn’t load the numbers. Try refreshing.' : '')
      if (!loadError) setData(result)
    })
    return () => {
      current = false
    }
  }, [days, reloads])

  const totals = data?.totals

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="type-h3 text-heading">Website</h1>
        <div className="flex items-center gap-2">
          <Segmented label="Date range" options={RANGES} value={days} onChange={setDays} />
          <button type="button" onClick={load} aria-label="Refresh" className={pillButton}>
            <RefreshCw aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {!data && !error && <Notice>Loading…</Notice>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Visitors" value={totals.visitors} hint="Counted once a day" />
            <StatTile label="Page views" value={totals.views} />
            <StatTile label="Visit plans" value={totals.rsvps} hint="RSVPs made" />
            <StatTile label="New subscribers" value={totals.subscribers} />
          </div>

          <Panel title="Visitors per day">
            <DailyChart daily={data.daily} />
          </Panel>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Top pages">
              <BarList rows={data.pages} valueKey="views" />
            </Panel>
            <Panel title="Where visitors came from">
              <BarList rows={data.referrers} />
            </Panel>
            <Panel title="Countries">
              <BarList rows={data.countries.map((row) => ({ ...row, label: countryName(row.label) }))} />
            </Panel>
            <Panel title="Devices">
              <BarList rows={data.devices} />
            </Panel>
          </div>
          <p className="font-form text-xs text-muted">
            Counted by the site itself: no cookies, no third-party trackers. Bots and admin pages are
            left out. Days are in Lagos time.
          </p>
        </>
      )}
    </div>
  )
}

export default Overview
