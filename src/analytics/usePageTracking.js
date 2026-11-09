import { useEffect } from 'react'
import { useLocation } from 'react-router'

// The site a visitor came from only matters for the first page they open.
let isFirstPage = true

/* Tells api/hit.js about each page someone opens, for the site's own analytics on /admin.
   sendBeacon never delays the page, and still goes out when someone is leaving. Off under
   `npm run dev`, so testing doesn't count as visits. */
export function usePageTracking() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (import.meta.env.DEV || !navigator.sendBeacon) return
    const params = new URLSearchParams(window.location.search)
    const hit = {
      path: pathname,
      referrer: isFirstPage ? document.referrer : '',
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
    }
    isFirstPage = false
    navigator.sendBeacon('/api/hit', new Blob([JSON.stringify(hit)], { type: 'application/json' }))
  }, [pathname])
}
