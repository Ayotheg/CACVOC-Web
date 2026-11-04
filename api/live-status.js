/* Tells the site whether the church is live on YouTube or Facebook. Runs on the server so the
   keys below stay private. Set these in the hosting dashboard, never in the code:

     YOUTUBE_API_KEY      Google Cloud API key with YouTube Data API v3 enabled
     FACEBOOK_PAGE_TOKEN  A long-lived Page access token from a Page admin

   A platform with a missing key, or one that fails, simply counts as not live. */

const YOUTUBE_CHANNEL_ID = 'UCG-zpFeAI_STBCp_UfCAkhQ' // CACVOC Lagos (@cacvoclagos). Not secret.
const FACEBOOK_PAGE_ID = '100063915377767' // Cacvoclagos. Not secret.
const REQUEST_TIMEOUT_MS = 5000

async function getJson(url, headers) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`responded with ${response.status}`)
  return response.json()
}

/* Checks the channel's newest uploads, which include a stream once it starts. This costs 2 quota
   units per check, where YouTube's search endpoint costs 100, so checking every minute stays
   well inside the free daily 10,000. */
async function findYouTubeLive() {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) return null

  const api = 'https://www.googleapis.com/youtube/v3'
  const uploads = YOUTUBE_CHANNEL_ID.replace(/^UC/, 'UU')
  const playlist = await getJson(
    `${api}/playlistItems?part=contentDetails&maxResults=5&playlistId=${uploads}&key=${key}`,
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
    return await find()
  } catch (error) {
    // Only the message is logged: the full error could include a request URL holding a key.
    console.error(`${platform} live check failed: ${error.message}`)
    return null
  }
}

export default async function handler(request, response) {
  const [youtube, facebook] = await Promise.all([
    check('YouTube', findYouTubeLive),
    check('Facebook', findFacebookLive),
  ])

  // Everyone visiting within the same minute shares one check, however busy the site is.
  response.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
  response.status(200).json({ youtube, facebook })
}
