/* Events on the home page. This is the only file to edit when events change.
   Anything in [square brackets] is a placeholder waiting for real details. */

/* The large "Next up" event. */
export const featuredEvent = {
  title: '21 Days of Power with Prayer and Fasting',
  theme: 'Transformed', // Set to '' to hide the Theme line.
  dateText: '[DAY DD MON] — [DAY DD MON] · 21 DAYS', // Shown exactly as written.

  // Flyer: put the image in public/events and write its path, like '/events/fasting.jpg'.
  // Set to '' to show a plain placeholder box.
  flyer: '',
  flyerAlt: '', // Describe the flyer, including any important words on it.

  // First and last day, written YYYY-MM-DD, like '2027-01-04'.
  // The "Add to calendar" button appears once startDate is filled in.
  startDate: '',
  endDate: '',

  link: '/events', // Where "Event details" goes.
}

/* The "Also coming up" list. Add, remove or reorder events freely; four fits the design best.
   Copy a whole { ... } block to add one. Set streamedLive to true to show the "Streamed live" tag. */
export const upcomingEvents = [
  {
    day: '[DD]',
    month: '[MON]',
    title: '[Monthly Holy Ghost night]',
    time: '[TIME]',
    venue: '[Venue]',
    streamedLive: true,
    link: '/events',
  },
  {
    day: '[DD]',
    month: '[MON]',
    title: '[Youth fellowship]',
    time: '[TIME]',
    venue: '[Venue]',
    streamedLive: false,
    link: '/events',
  },
  {
    day: '[DD]',
    month: '[MON]',
    title: '[Women’s conference]',
    time: '[TIME]',
    venue: '[Venue]',
    streamedLive: false,
    link: '/events',
  },
  {
    day: '[DD]',
    month: '[MON]',
    title: '[Thanksgiving service]',
    time: '[TIME]',
    venue: '[Venue]',
    streamedLive: false,
    link: '/events',
  },
]
