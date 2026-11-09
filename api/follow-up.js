/* Sends the follow-up template to everyone who planned to visit today and gave an email. Vercel
   runs it every Sunday at 7 p.m. Lagos time (the "crons" entry in vercel.json). Each RSVP is marked
   with follow_up_sent_at once its email is sent, so a second run never sends anyone two.

     FOLLOWUP_TEMPLATE_ID   Published Resend template. Variables: NAME. Until it is set, this does nothing.
     CRON_SECRET            Any long random string. Vercel sends it with each scheduled run, so
                            nobody else can trigger the emails. */

import { lagosToday } from './_lib/dates.js'
import { EMAIL_PATTERN, canSendEmail, sendTemplate } from './_lib/mail.js'
import { selectRows, storeConfigured, updateRows } from './_lib/store.js'

export default async function handler(request, response) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.authorization !== `Bearer ${secret}`) {
    return response.status(401).json({ ok: false, error: 'unauthorized' })
  }

  const templateId = process.env.FOLLOWUP_TEMPLATE_ID
  if (!storeConfigured() || !canSendEmail() || !templateId) {
    return response.status(200).json({ ok: true, sent: 0, skipped: 'not-configured' })
  }

  const date = request.query?.date ?? lagosToday()
  const visitors = await selectRows('rsvps', {
    select: 'id,name,contact',
    visit_date: `eq.${date}`,
    follow_up_sent_at: 'is.null',
  })

  let sent = 0
  for (const visitor of visitors) {
    if (!EMAIL_PATTERN.test(visitor.contact)) continue
    try {
      await sendTemplate({
        to: visitor.contact,
        templateId,
        variables: { NAME: visitor.name.split(/\s+/)[0] },
      })
      await updateRows('rsvps', { id: `eq.${visitor.id}` }, { follow_up_sent_at: new Date().toISOString() })
      sent += 1
    } catch (error) {
      console.error(`follow-up for rsvp ${visitor.id}: ${error.message}`)
    }
  }

  return response.status(200).json({ ok: true, date, sent })
}
