const LAGOS = 'Africa/Lagos'

/* "Sun 15 Nov 2026" for a YYYY-MM-DD date. */
export function formatDay(day, { year = true } = {}) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(year && { year: 'numeric' }),
    timeZone: 'UTC',
  })
}

/* "9 Nov 2026, 14:05" in Lagos time. */
export function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: LAGOS,
  })
}

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/* "today", "3 days ago", "2 weeks ago". */
export function timeAgo(timestamp, now = Date.now()) {
  const days = Math.round((now - new Date(timestamp).getTime()) / 86_400_000)
  if (days < 7) return relative.format(-days, 'day')
  if (days < 60) return relative.format(-Math.round(days / 7), 'week')
  return relative.format(-Math.round(days / 30), 'month')
}

export const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value)

/* Today in Lagos as YYYY-MM-DD. */
export function lagosToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: LAGOS })
}

/* Downloads rows as a CSV that opens in Excel or Google Sheets. */
export function downloadCsv(filename, columns, rows) {
  const escape = (value) => {
    const text = value == null ? '' : String(value)
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
  }
  const lines = [
    columns.map((column) => escape(column.label)).join(','),
    ...rows.map((row) => columns.map((column) => escape(column.value(row))).join(',')),
  ]
  // The BOM tells Excel the file is UTF-8, so names with accents survive.
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
