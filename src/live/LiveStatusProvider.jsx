import { useEffect, useState } from 'react'
import { LiveStatusContext } from './liveStatus'

const CHECK_EVERY_MS = 60_000

/* Open the site at /?preview-live under `npm run dev` to see the live design without a stream. */
const PREVIEW = {
  youtube: {
    videoId: 'UgRWxFGHyKc',
    title: 'LIVE ll ALABIYE SERVICE  ll 4TH NOVEMBER, 2026 ll PASTOR ISAAC ABIARA',
    startedAt: '2026-11-04T08:31:48Z',
    url: 'https://www.youtube.com/watch?v=UgRWxFGHyKc',
  },
  facebook: {
    title: 'LIVE ll ALABIYE SERVICE  ll 4TH NOVEMBER, 2026 ll PASTOR ISAAC ABIARA',
    startedAt: '2026-11-04T08:31:48Z',
    url: 'https://www.facebook.com/100063915377767/videos/1829665368224416/',
  },
}

const isPreview = () =>
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('preview-live')

/* Asks the server what is live now, then again every minute while the tab is open. */
function LiveStatusProvider({ children }) {
  const [status, setStatus] = useState(() => (isPreview() ? PREVIEW : null))

  useEffect(() => {
    if (isPreview()) return undefined

    const check = async () => {
      if (document.hidden) return
      try {
        const response = await fetch('/api/live-status')
        if (response.ok) setStatus(await response.json())
      } catch {
        // A failed check keeps the last answer, so a network blip can't drop a running stream.
      }
    }

    check()
    const timer = setInterval(check, CHECK_EVERY_MS)
    document.addEventListener('visibilitychange', check)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  return <LiveStatusContext.Provider value={status}>{children}</LiveStatusContext.Provider>
}

export default LiveStatusProvider
