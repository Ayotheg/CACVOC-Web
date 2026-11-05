/* Tells the site whether the church is live on YouTube or Facebook. Runs on the server so the
   keys below stay private. Set these in the hosting dashboard, never in the code:

     YOUTUBE_API_KEY      Google Cloud API key with YouTube Data API v3 enabled
     FACEBOOK_PAGE_TOKEN  A long-lived Page access token from a Page admin

   The reply also lists any check that failed under `errors`, so a broken check can't pass for
   "not live". To see why one failed, open /api/live-status: 403 API_KEY_HTTP_REFERRER_BLOCKED,
   for example, means the key has a website restriction, which blocks calls from a server. */

const YOUTUBE_CHANNEL_ID = 'UCG-zpFeAI_STBCp_UfCAkhQ' // CACVOC Lagos (@cacvoclagos). Not secret.
const FACEBOOK_PAGE_ID = '100063915377767' // Cacvoclagos. Not secret.
const REQUEST_TIMEOUT_MS = 5000

/* Its message is safe to show publicly: it never holds a key or a request URL. */
class CheckError extends Error {}

/* The short code Google or Facebook gives for a failure, such as quotaExceeded. */
function failureCode(body) {
  const error = body?.error
  const code =
    error?.details?.find((detail) => detail.reason)?.reason ??
    error?.errors?.[0]?.reason ??
    error?.status ??
    error?.code
  return /^[\w.-]{1,60}$/.test(code ?? '') ? code : ''
}

async function getJson(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (response.ok) return response.json()

  const body = await response.json().catch(() => null)
  throw new CheckError(`${response.status} ${failureCode(body)}`.trim())
}

/* Checks the channel's newest uploads, which include a stream once it starts. This costs 2 quota
   units per check, where YouTube's search endpoint costs 100, so checking every minute stays
   well inside the free daily 10,000. Asking for 50 uploads costs no more than asking for 5, and
   stops a burst of new videos from pushing a running stream out of view. */
async function findYouTubeLive() {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new CheckError('no-key')

  const api = 'https://www.googleapis.com/youtube/v3'
  const uploads = YOUTUBE_CHANNEL_ID.replace(/^UC/, 'UU')
  const playlist = await getJson(
    `${api}/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${key}`,
  )
  const ids = playlist.items?.map((item) => item.contentDetails.videoId) ?? []
  if (ids.length === 0) return null

  const videos = await getJson(
    `${api}/videos?part=snippet,liveStreamingDetails&id=${ids.join(',')}&key=${key}`,
  )
  const live = videos.items?.find((video) => video.snippet.liveBroadcastContent === 'live')
  if (!live) return null

  return {
    videoId: live.id,
    title: live.snippet.title,
    startedAt: live.liveStreamingDetails?.actualStartTime ?? null,
    url: `https://www.youtube.com/watch?v=${live.id}`,
  }
}

async function findFacebookLive() {
  // Facebook is optional: without a token the site only follows YouTube.
  const token = process.env.FACEBOOK_PAGE_TOKEN
  if (!token) return null

  const query = 'broadcast_status=%5B%22LIVE%22%5D&fields=title,permalink_url,creation_time&limit=1'
  const url = `https://graph.facebook.com/${FACEBOOK_PAGE_ID}/live_videos?${query}`
  const result = await getJson(url, { Authorization: `Bearer ${token}` })
  const live = result.data?.[0]
  if (!live?.permalink_url) return null

  return {
    title: live.title ?? null,
    startedAt: live.creation_time ?? null,
    url: new URL(live.permalink_url, 'https://www.facebook.com').href,
  }
}

async function check(platform, find) {
  try {
    return { stream: await find() }
  } catch (error) {
    // Other errors could include a request URL holding a key, so their text is never passed on.
    const reason =
      error instanceof CheckError
        ? error.message
        : error.name === 'TimeoutError'
          ? 'timeout'
          : 'request-failed'
    console.error(`${platform} live check failed: ${reason}`)
    return { stream: null, error: reason }
  }
}

export default async function handler(request, response) {
  const [youtube, facebook] = await Promise.all([
    check('YouTube', findYouTubeLive),
    check('Facebook', findFacebookLive),
  ])

  const errors = {}
  if (youtube.error) errors.youtube = youtube.error
  if (facebook.error) errors.facebook = facebook.error
  const failed = Object.keys(errors).length > 0

  // Everyone visiting within the same minute shares one check, however busy the site is.
  // A failure is rechecked sooner, so a brief one doesn't hide a stream for long.
  response.setHeader(
    'Cache-Control',
    failed ? 'public, s-maxage=20' : 'public, s-maxage=60, stale-while-revalidate=30',
  )
  response.status(200).json({ youtube: youtube.stream, facebook: facebook.stream, errors })
}
