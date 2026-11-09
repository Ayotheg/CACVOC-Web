/* Records one page view for the site's own analytics (shown on /admin). No cookies, no IP address
   stored: each visitor gets a hash of their IP + browser + today's date + a secret salt, so they
   are counted once a day but can't be followed from one day to the next or identified.

     ANALYTICS_SALT   Optional. Any long random string. Falls back to the Supabase secret key. */

import { createHash } from 'node:crypto'
import { lagosToday } from './_lib/dates.js'
import { insertRow, storeConfigured } from './_lib/store.js'

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|facebookexternalhit|whatsapp/i

function deviceOf(userAgent) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(userAgent)) return 'tablet'
  if (/mobi|iphone|android/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

const clip = (value, max) => (typeof value === 'string' && value ? value.slice(0, max) : null)

function referrerHost(referrer, ownHost) {
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    return host && host !== ownHost.replace(/^www\./, '') ? host : null
  } catch {
    return null
  }
}

/* Always answers the same way, success or not: analytics must never break the site. The browser
   sends this with sendBeacon, so nobody waits on it. The reply comes after saving, because Vercel
   may stop the function as soon as it has replied. */
export default async function handler(request, response) {
  await record(request)
  response.status(204).end()
}

async function record(request) {
  if (request.method !== 'POST' || !storeConfigured()) return

  const userAgent = request.headers['user-agent'] ?? ''
  if (!userAgent || BOT_PATTERN.test(userAgent)) return

  let body = request.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return
    }
  }
  const path = clip(body?.path, 300)
  if (!path?.startsWith('/') || path.startsWith('/admin')) return

  const ip = String(request.headers['x-forwarded-for'] ?? '').split(',')[0].trim()
  const salt = process.env.ANALYTICS_SALT ?? process.env.SUPABASE_SECRET_KEY
  const visitorHash = createHash('sha256')
    .update(`${salt}|${lagosToday()}|${ip}|${userAgent}`)
    .digest('hex')
    .slice(0, 32)

  try {
    await insertRow('page_views', {
      path,
      referrer_host: referrerHost(body.referrer, String(request.headers.host ?? '')),
      utm_source: clip(body.utmSource, 100),
      utm_medium: clip(body.utmMedium, 100),
      utm_campaign: clip(body.utmCampaign, 100),
      country: clip(request.headers['x-vercel-ip-country'], 2),
      device: deviceOf(userAgent),
      visitor_hash: visitorHash,
    })
  } catch (error) {
    console.error(`hit: ${error.message}`)
  }
}
