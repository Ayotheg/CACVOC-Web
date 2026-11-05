/* The large "Next up" card in the Events section, for a major event only. Swap it whenever the
   next big one comes up. The "Also coming up" list beside it comes from services.js.
   Anything in [square brackets] is a placeholder waiting for real details. */
export const featuredEvent = {
  title: 'Church Anniversary',
  theme: 'Transformed', // Set to '' to hide the Theme line.
  dateText: '[DAY DD MON] — [DAY DD MON] · 7 DAYS', // 'MON 07 DEC — SUN 13 DEC · 7 DAYS',.

  // Flyer: put the image in public/events and write its path, like '/events/fasting.jpg'.
  // Set to '' to show a plain placeholder box.
  flyer: '',
  flyerAlt: '', // Describe the flyer, including any important words on it.

  // First and last day, written YYYY-MM-DD, like '2027-01-04'.
  // The "Add to calendar" button starts working once startDate is filled in.
  startDate: '',
  endDate: '',

  link: '/events', // Where "Event details" goes.
}
