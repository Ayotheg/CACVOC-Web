import { createContext, useContext } from 'react'

export const LiveStatusContext = createContext(null)

/* What is live now, shared across the site: { youtube, facebook }, each a stream or null. */
export const useLiveStatus = () => {
  const status = useContext(LiveStatusContext)
  return { status, isLive: Boolean(status?.youtube || status?.facebook) }
}

const titleCase = (text) =>
  text.toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())

/* The church's stream titles look like "LIVE ll ALABIYE SERVICE ll 4TH NOVEMBER, 2026 ll PASTOR X".
   That becomes the heading "Alabiye Service" with the remaining parts as a line beneath it.
   A title in any other format is shown as written. */
export function splitStreamTitle(title) {
  if (!title) return { heading: 'Live service', details: '' }

  const parts = title
    .split(/\s+l{2}\s+/i)
    .map((part) => part.trim())
    .filter((part) => part && part.toUpperCase() !== 'LIVE')

  if (parts.length === 0) return { heading: title, details: '' }
  const [first, ...rest] = parts

  return {
    heading: first === first.toUpperCase() ? titleCase(first) : first,
    details: rest.join(' · '),
  }
}

export const startedLabel = (startedAt) =>
  startedAt
    ? `Started ${new Date(startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : null
