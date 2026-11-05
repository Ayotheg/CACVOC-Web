/* Everything written on the Plan a Visit page. This is the only file to edit when it changes.
   Anything in [square brackets] is a placeholder waiting for real details.
   Service times come from services.js. */

export const churchLocation = {
  name: 'CAC Vineyard of Comfort',
  note: 'DCC Headquarters · Agege, Lagos',
  address: ['105 Old Otta Rd', 'Oke-Odo, Ile-Epo, Lagos'],
  phone: '+234 903 940 6625',
  // The exact pin from the church's Google Maps listing.
  mapEmbed: 'https://www.google.com/maps?q=6.6344798,3.3025681&z=16&output=embed',
}

/* The white caption on the welcome photo. */
export const thisSunday = {
  services: 'English Service · 6:45 AM, Yoruba Service · 9:00 AM',
  note: 'Our welcome team will greet you',
}

export const firstSundaySteps = [
  {
    title: 'Arrive',
    text: 'Come in and find a seat. Our welcome team will greet you and answer any questions.',
  },
  {
    title: 'Worship',
    text: 'We open with praise, prayer and song. Join in, or simply take it all in.',
  },
  {
    title: 'The Word',
    text: 'A message from the Bible you can carry into your week.',
  },
]

export const visitFacts = [
  { label: 'Service length', value: 'About 2 to 3 hours' },
  { label: 'What to wear', value: 'Come as you are' },
  { label: 'Children', value: '[Children’s church details]' },
  { label: 'Language', value: 'English and Yoruba' },
]

export const visitQuestions = [
  {
    question: 'What should I wear?',
    answer:
      'Come as you are. You’ll see everything from traditional attire to jeans, and you’re welcome in either.',
  },
  {
    question: 'How long is the service?',
    answer:
      'The English Service runs from 6:45 AM to 8:45 AM, and the Yoruba Service from 9:00 AM to 12:00 PM.',
  },
  {
    question: 'Is there something for my children?',
    answer: 'Yes, we have a children’s church for kids ages 3-12. They’ll be dropped off and picked up at designated points during the service.',
  },
  {
    question: 'Where do I park?',
    answer: 'Church parking is available on the premises, and there’s also street parking nearby.',
  },
  {
    question: 'Can I watch online first?',
    answer:
      'Yes. Every Sunday service streams live on YouTube and Facebook, so you can get a feel for us from home.',
  },
]
