/* Sends email and manages the mailing list through Resend. All of it is switched off until the
   settings below are added in Vercel, so the forms work before the domain exists: submissions are
   saved to Supabase and nothing is emailed. SETUP.md lists the steps.

     RESEND_API_KEY              Resend → API Keys. Turns on adding subscribers to Resend.
     EMAIL_FROM                  A sender on the verified domain, e.g.
                                 CAC Vineyard of Comfort <hello@cacvoclagos.org>
                                 Turns on sending. Leave it unset until the domain is verified.
     RESEND_SEGMENT_ID           Optional. The segment new subscribers join.
     WELCOME_TEMPLATE_ID         The published Resend template sent to each new subscriber.
     RSVP_CONFIRM_TEMPLATE_ID    Optional. Published template sent to a visitor who gave an email.
                                 Variables: NAME, WHEN, PEOPLE.
     RSVP_NOTIFY_TO              Inbox that gets each RSVP (the church's Zoho address). Commas
                                 separate several. */

const API = 'https://api.resend.com'
const REQUEST_TIMEOUT_MS = 8000

export const canSendEmail = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
export const canAddContacts = () => Boolean(process.env.RESEND_API_KEY)

async function resend(pathname, body) {
  const response = await fetch(`${API}${pathname}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Resend ${pathname} failed: ${response.status} ${detail.slice(0, 200)}`)
  }
  return response.json()
}

/* Plain email written here in code, for internal alerts. */
export function sendEmail({ to, subject, html, replyTo }) {
  const body = { from: process.env.EMAIL_FROM, to, subject, html }
  if (replyTo) body.reply_to = replyTo
  return resend('/emails', body)
}

/* Email built from a template published in Resend. Its subject comes from the template, so set one
   there. Resend refuses html alongside a template, so none is sent. */
export function sendTemplate({ to, templateId, variables }) {
  const template = { id: templateId }
  if (variables) template.variables = variables
  return resend('/emails', { from: process.env.EMAIL_FROM, to, template })
}

export function addContact(email) {
  const body = { email, unsubscribed: false }
  const segment = process.env.RESEND_SEGMENT_ID
  if (segment) body.segments = [{ id: segment }]
  return resend('/contacts', body)
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/* Runs optional email steps side by side. One failing never stops the others, or the reply to the
   person on the site: their details are already saved by then. Each failure is logged by name. */
export async function runOptional(steps) {
  const active = steps.filter((step) => step.when)
  const results = await Promise.allSettled(active.map((step) => step.run()))
  results.forEach((result, index) => {
    if (result.status === 'rejected') console.error(`${active[index].name}: ${result.reason?.message}`)
  })
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
