/* The Plan a Visit form. Each RSVP is saved to Supabase, where the full list can always be seen.
   Once Resend is configured (SETUP.md), the church inbox gets an alert for each one, and a visitor
   who gave an email gets the confirmation template. Visitors are never added to the newsletter:
   the form promises "No mailing lists." */

import { visitDate } from './_lib/dates.js'
import { insertRow, storeConfigured } from './_lib/store.js'
import {
  EMAIL_PATTERN,
  canSendEmail,
  escapeHtml,
  runOptional,
  sendEmail,
  sendTemplate,
} from './_lib/mail.js'

// Must match WHEN_OPTIONS and MAX_PEOPLE in src/pages/Visit.jsx.
const WHEN_OPTIONS = ['This Sunday', 'Next Sunday', 'Not sure yet']
const MAX_PEOPLE = 20

function readRsvp(body) {
  const name = String(body.name ?? '').trim()
  const contact = String(body.contact ?? '').trim()
  const people = Number(body.people)
  if (!name || name.length > 100) return null
  if (!contact || contact.length > 200) return null
  if (!WHEN_OPTIONS.includes(body.when)) return null
  if (!Number.isInteger(people) || people < 1 || people > MAX_PEOPLE) return null
  return {
    name,
    contact,
    visit_when: body.when,
    visit_date: visitDate(body.when),
    people,
    first_time: body.firstTime === true,
  }
}

function alertHtml(rsvp) {
  const rows = [
    ['Name', rsvp.name],
    ['Phone or email', rsvp.contact],
    ['Coming', rsvp.visit_date ? `${rsvp.visit_when} (${rsvp.visit_date})` : rsvp.visit_when],
    ['How many', rsvp.people],
    ['First time', rsvp.first_time ? 'Yes' : 'No'],
  ]
  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#64748b">${label}</td>` +
        `<td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td></tr>`,
    )
    .join('')
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0f172a">
<p>Someone has planned a visit on the website.</p>
<table style="border-collapse:collapse">${cells}</table>
</div>`
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false, error: 'method-not-allowed' })
  }

  const body = request.body ?? {}
  if (body.website) return response.status(200).json({ ok: true }) // hidden bot trap

  const rsvp = readRsvp(body)
  if (!rsvp) return response.status(400).json({ ok: false, error: 'invalid-details' })

  if (!storeConfigured()) {
    console.error('rsvp: SUPABASE_URL or SUPABASE_SECRET_KEY is not set')
    return response.status(503).json({ ok: false, error: 'not-configured' })
  }

  try {
    await insertRow('rsvps', rsvp)
  } catch (error) {
    console.error(`rsvp: ${error.message}`)
    return response.status(500).json({ ok: false, error: 'save-failed' })
  }

  const visitorEmail = EMAIL_PATTERN.test(rsvp.contact) ? rsvp.contact : null
  const notifyTo = process.env.RSVP_NOTIFY_TO?.split(',').map((address) => address.trim()).filter(Boolean)
  const confirmTemplate = process.env.RSVP_CONFIRM_TEMPLATE_ID

  await runOptional([
    {
      name: 'RSVP alert',
      when: canSendEmail() && notifyTo?.length,
      run: () =>
        sendEmail({
          to: notifyTo,
          subject: `New visitor: ${rsvp.name} (${rsvp.visit_when}, ${rsvp.people})`,
          html: alertHtml(rsvp),
          replyTo: visitorEmail ?? undefined,
        }),
    },
    {
      name: 'RSVP confirmation',
      when: canSendEmail() && confirmTemplate && visitorEmail,
      run: () =>
        sendTemplate({
          to: visitorEmail,
          templateId: confirmTemplate,
          variables: {
            NAME: rsvp.name.split(/\s+/)[0],
            WHEN: rsvp.visit_when,
            PEOPLE: rsvp.people,
          },
        }),
    },
  ])

  return response.status(200).json({ ok: true })
}
