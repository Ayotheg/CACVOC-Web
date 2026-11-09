/* The footer's newsletter form. Every signup is saved to Supabase first, so nobody is lost while
   email is still being set up. Once Resend is configured (SETUP.md), a new subscriber is also added
   to the Resend contact list and sent the welcome template. Someone already on the list is not
   welcomed twice. */

import { insertRow, storeConfigured } from './_lib/store.js'
import {
  EMAIL_PATTERN,
  addContact,
  canAddContacts,
  canSendEmail,
  runOptional,
  sendTemplate,
} from './_lib/mail.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false, error: 'method-not-allowed' })
  }

  const body = request.body ?? {}
  // A hidden field people never see. Bots fill it in; they're told it worked and nothing is saved.
  if (body.website) return response.status(200).json({ ok: true })

  const email = String(body.email ?? '').trim().toLowerCase()
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return response.status(400).json({ ok: false, error: 'invalid-email' })
  }

  if (!storeConfigured()) {
    console.error('subscribe: SUPABASE_URL or SUPABASE_SECRET_KEY is not set')
    return response.status(503).json({ ok: false, error: 'not-configured' })
  }

  let isNew
  try {
    const rows = await insertRow(
      'subscribers',
      { email, source: 'website-footer' },
      { onConflict: 'email', ignoreDuplicates: true },
    )
    isNew = rows.length > 0
  } catch (error) {
    console.error(`subscribe: ${error.message}`)
    return response.status(500).json({ ok: false, error: 'save-failed' })
  }

  const welcomeTemplate = process.env.WELCOME_TEMPLATE_ID
  await runOptional([
    { name: 'Resend contact', when: isNew && canAddContacts(), run: () => addContact(email) },
    {
      name: 'Welcome email',
      when: isNew && canSendEmail() && welcomeTemplate,
      run: () => sendTemplate({ to: email, templateId: welcomeTemplate }),
    },
  ])

  return response.status(200).json({ ok: true })
}
