/* Dates as the church sees them: Lagos time (WAT, UTC+1 all year, no daylight saving). */

const LAGOS_OFFSET_MS = 60 * 60 * 1000

/* Today's date in Lagos as YYYY-MM-DD. */
export function lagosToday(now = new Date()) {
  return new Date(now.getTime() + LAGOS_OFFSET_MS).toISOString().slice(0, 10)
}

/* The Sunday a visitor means. "This Sunday" is today if today is Sunday, otherwise the coming one;
   "Next Sunday" is the week after that. "Not sure yet" has no date. */
export function visitDate(when, now = new Date()) {
  if (when !== 'This Sunday' && when !== 'Next Sunday') return null
  const today = new Date(`${lagosToday(now)}T00:00:00Z`)
  const daysToSunday = (7 - today.getUTCDay()) % 7
  const extra = when === 'Next Sunday' ? 7 : 0
  today.setUTCDate(today.getUTCDate() + daysToSunday + extra)
  return today.toISOString().slice(0, 10)
}
