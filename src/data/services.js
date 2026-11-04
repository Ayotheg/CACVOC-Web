/* The church's weekly services. This is the only file to edit when they change.

   - `day` is the short name on the badge, written in capitals: SUN, MON, TUE and so on.
   - Keep times in the form '6:45 AM – 8:45 AM'. That is how the site works out which service
     is happening during a livestream, using Lagos time.
   - `inFooter: true` also lists a service in the footer. About four fits best. */
export const serviceVenue = 'Church Auditorium'

export const weeklySchedule = [
  {
    day: 'SUN',
    dayName: 'Sunday',
    services: [
      { name: 'English Service', time: '6:45 AM – 8:45 AM', inFooter: true },
      { name: 'Yoruba Service', time: '9:00 AM – 12:00 PM', inFooter: true },
      { name: 'Combined Service', time: '1st Sunday of every month' },
      { name: 'Youth Sunday', time: '3rd Sunday of the month' },
    ],
  },
  {
    day: 'MON',
    dayName: 'Monday',
    services: [{ name: 'Jigbare', time: '5:30 AM – 7:00 AM' }],
  },
  {
    day: 'TUE',
    dayName: 'Tuesday',
    services: [{ name: 'Bible Study', time: '6:00 PM – 8:00 PM', inFooter: true }],
  },
  {
    day: 'WED',
    dayName: 'Wednesday',
    services: [
      { name: 'Alabiye Prayer Meeting', time: '9:00 AM – 11:30 AM', inFooter: true },
      { name: 'Breakthrough Service', time: '5:30 PM – 7:30 PM' },
    ],
  },
  {
    day: 'THU',
    dayName: 'Thursday',
    services: [
      { name: 'Business Men and Women', time: '6:00 AM – 8:30 AM' },
      { name: 'Deliverance Hour', time: '12:00 PM – 3:00 PM' },
    ],
  },
  {
    day: 'FRI',
    dayName: 'Friday',
    services: [
      { name: 'Pregnant Women Program', time: '9:00 AM – 11:00 AM' },
      { name: 'Every Friday Vigil (Power Night)', time: '12:00 AM – 4:00 AM' },
      { name: 'Youth Vigil', time: 'Last Friday of the month' },
    ],
  },
]

export const footerServices = weeklySchedule.flatMap(({ day, services }) =>
  services.filter((service) => service.inFooter).map((service) => ({ ...service, day })),
)

const toMinutes = (hour, minute, period) =>
  ((Number(hour) % 12) + (period.toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(minute)

/* The day and time at the church, wherever the visitor is. */
export function lagosNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  )
  return {
    day: parts.weekday.toUpperCase(),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

/* True during a service's hours. Monthly services have no hours, so they never match. */
export function isHappeningNow(day, service, now) {
  const match = service.time.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/i)
  if (!match || day !== now.day) return false
  const [, startHour, startMinute, startPeriod, endHour, endMinute, endPeriod] = match
  return (
    now.minutes >= toMinutes(startHour, startMinute, startPeriod) &&
    now.minutes < toMinutes(endHour, endMinute, endPeriod)
  )
}
