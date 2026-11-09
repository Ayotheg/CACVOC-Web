import { useEffect, useMemo, useState } from 'react'
import { Download, Search } from '../components/icons'
import { downloadCsv, formatDateTime, formatDay, lagosToday, timeAgo } from './format'
import { supabase } from './supabase'
import { Notice, Panel, Segmented, pillButton } from './ui'

const FILTERS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'unsure', label: 'Not sure yet' },
  { value: 'all', label: 'All' },
]

const ATTENDED = [
  { value: '', label: '—' },
  { value: 'yes', label: 'Came' },
  { value: 'no', label: 'Didn’t come' },
]
const toAttended = (value) => (value === 'yes' ? true : value === 'no' ? false : null)
const fromAttended = (value) => (value === true ? 'yes' : value === false ? 'no' : '')

function matchesFilter(rsvp, filter, today) {
  if (filter === 'upcoming') return rsvp.visit_date && rsvp.visit_date >= today
  if (filter === 'past') return rsvp.visit_date && rsvp.visit_date < today
  if (filter === 'unsure') return !rsvp.visit_date
  return true
}

function ContactLink({ contact }) {
  if (contact.includes('@')) {
    return (
      <a href={`mailto:${contact}`} className="text-link hover:underline">
        {contact}
      </a>
    )
  }
  return (
    <a href={`tel:${contact.replace(/[^\d+]/g, '')}`} className="text-link hover:underline">
      {contact}
    </a>
  )
}

function NotesField({ rsvp, onSave }) {
  const [value, setValue] = useState(rsvp.notes ?? '')
  return (
    <input
      type="text"
      value={value}
      aria-label={`Notes for ${rsvp.name}`}
      placeholder="Add a note"
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => value !== (rsvp.notes ?? '') && onSave(value.trim() || null)}
      className="h-9 w-full min-w-40 rounded-sm border border-transparent bg-transparent px-2 font-form text-sm text-heading placeholder:text-slate-400 hover:border-border focus:border-border focus:bg-white"
    />
  )
}

const CSV_COLUMNS = [
  { label: 'Sunday', value: (row) => row.visit_date ?? 'Not sure yet' },
  { label: 'Name', value: (row) => row.name },
  { label: 'Phone or email', value: (row) => row.contact },
  { label: 'People', value: (row) => row.people },
  { label: 'First time', value: (row) => (row.first_time ? 'Yes' : 'No') },
  { label: 'Came', value: (row) => fromAttended(row.attended) },
  { label: 'Notes', value: (row) => row.notes },
  { label: 'Follow-up sent', value: (row) => row.follow_up_sent_at && formatDateTime(row.follow_up_sent_at) },
  { label: 'Signed up', value: (row) => formatDateTime(row.created_at) },
]

function Visitors() {
  const [rsvps, setRsvps] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('upcoming')
  const [query, setQuery] = useState('')
  const today = lagosToday()

  useEffect(() => {
    supabase
      .from('rsvps')
      .select('*')
      .order('visit_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(5000)
      .then(({ data, error: loadError }) => {
        if (loadError) setError('Couldn’t load visitors. Try refreshing the page.')
        else setRsvps(data)
      })
  }, [])

  const save = async (id, changes) => {
    const previous = rsvps
    setRsvps((rows) => rows.map((row) => (row.id === id ? { ...row, ...changes } : row)))
    const { error: saveError } = await supabase.from('rsvps').update(changes).eq('id', id)
    if (saveError) {
      setRsvps(previous)
      setError('That change didn’t save. Please try again.')
    }
  }

  const shown = useMemo(() => {
    if (!rsvps) return []
    const needle = query.trim().toLowerCase()
    const rows = rsvps.filter(
      (row) =>
        matchesFilter(row, filter, today) &&
        (!needle || `${row.name} ${row.contact} ${row.notes ?? ''}`.toLowerCase().includes(needle)),
    )
    // Upcoming reads best soonest-first; everything else newest-first.
    return filter === 'upcoming' ? rows.reverse() : rows
  }, [rsvps, filter, query, today])

  const groups = useMemo(() => {
    const byDate = new Map()
    for (const row of shown) {
      const key = row.visit_date ?? 'unsure'
      if (!byDate.has(key)) byDate.set(key, [])
      byDate.get(key).push(row)
    }
    return [...byDate]
  }, [shown])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="type-h3 text-heading">Visitors</h1>
        <button
          type="button"
          disabled={!shown.length}
          onClick={() => downloadCsv(`visitors-${filter}-${today}.csv`, CSV_COLUMNS, shown)}
          className={pillButton}
        >
          <Download aria-hidden="true" className="size-4" />
          Download for Excel
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="overflow-x-auto">
          <Segmented label="Which visits" options={FILTERS} value={filter} onChange={setFilter} />
        </div>
        <label className="relative min-w-0 flex-1 basis-56">
          <span className="sr-only">Search visitors</span>
          <Search aria-hidden="true" className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, email or note"
            className="type-input h-10 w-full rounded-pill border border-border bg-white pr-4 pl-10 text-heading placeholder:text-slate-400"
          />
        </label>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {!rsvps && !error && <Notice>Loading…</Notice>}
      {rsvps && !groups.length && <Notice>No visitors here yet.</Notice>}

      {groups.map(([date, rows]) => {
        const people = rows.reduce((sum, row) => sum + row.people, 0)
        const came = rows.filter((row) => row.attended).reduce((sum, row) => sum + row.people, 0)
        const title = date === 'unsure' ? 'Not sure when' : formatDay(date)
        return (
          <Panel
            key={date}
            title={title}
            action={
              <p className="font-form text-sm text-muted">
                {rows.length} {rows.length === 1 ? 'plan' : 'plans'} · {people}{' '}
                {people === 1 ? 'person' : 'people'}
                {came > 0 && ` · ${came} came`}
              </p>
            }
          >
            <div className="-mx-5 overflow-x-auto px-5">
              <table className="w-full min-w-200 font-form text-sm">
                <thead className="text-left text-muted">
                  <tr>
                    <th className="py-2 pr-3 font-semibold">Name</th>
                    <th className="py-2 pr-3 font-semibold">Phone or email</th>
                    <th className="py-2 pr-3 text-right font-semibold">People</th>
                    <th className="py-2 pr-3 font-semibold">Signed up</th>
                    <th className="py-2 pr-3 font-semibold">Came?</th>
                    <th className="py-2 pr-3 font-semibold">Notes</th>
                    <th className="py-2 font-semibold">Follow-up</th>
                  </tr>
                </thead>
                <tbody className="text-heading">
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-border align-middle">
                      <td className="py-2 pr-3">
                        <span className="font-semibold">{row.name}</span>
                        {row.first_time && (
                          <span className="ml-2 rounded-pill bg-gold-100 px-2 py-0.5 font-badge text-[11px] font-semibold text-gold-700">
                            First time
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        <ContactLink contact={row.contact} />
                      </td>
                      <td className="py-2 pr-3 text-right font-numeric">{row.people}</td>
                      <td className="py-2 pr-3 whitespace-nowrap" title={formatDateTime(row.created_at)}>
                        {timeAgo(row.created_at)}
                      </td>
                      <td className="py-2 pr-3">
                        <select
                          aria-label={`Did ${row.name} come?`}
                          value={fromAttended(row.attended)}
                          onChange={(event) => save(row.id, { attended: toAttended(event.target.value) })}
                          className="h-9 cursor-pointer rounded-sm border border-border bg-white px-2 font-form text-sm text-heading"
                        >
                          {ATTENDED.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1 pr-3">
                        <NotesField rsvp={row} onSave={(notes) => save(row.id, { notes })} />
                      </td>
                      <td className="py-2 whitespace-nowrap text-muted">
                        {row.follow_up_sent_at
                          ? `Sent ${formatDay(row.follow_up_sent_at.slice(0, 10), { year: false })}`
                          : row.contact.includes('@')
                            ? 'Not yet'
                            : 'No email'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )
      })}
    </div>
  )
}

export default Visitors
