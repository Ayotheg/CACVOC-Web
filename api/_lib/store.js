/* Saves form submissions to Supabase. Runs on the server only, so the secret key never reaches
   the browser. Set these in the Vercel dashboard (see SETUP.md):

     SUPABASE_URL          https://<project-ref>.supabase.co
     SUPABASE_SECRET_KEY   Project Settings → API Keys → a secret key (sb_secret_…)
                           or the legacy service_role key */

const REQUEST_TIMEOUT_MS = 5000

export function storeConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY)
}

function authHeaders() {
  const key = process.env.SUPABASE_SECRET_KEY
  const headers = { apikey: key }
  // A legacy service_role key is a JWT and also goes in Authorization. A new sb_secret_ key does not.
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`
  return headers
}

/* Inserts one row and returns the rows Supabase actually created. With `ignoreDuplicates`, a row
   that clashes with `onConflict` is skipped and the result is an empty array. */
export async function insertRow(table, row, { onConflict, ignoreDuplicates = false } = {}) {
  const url = new URL(`/rest/v1/${table}`, process.env.SUPABASE_URL)
  if (onConflict) url.searchParams.set('on_conflict', onConflict)

  const prefer = ['return=representation']
  if (ignoreDuplicates) prefer.push('resolution=ignore-duplicates')

  const response = await fetch(url, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json', Prefer: prefer.join(',') },
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return readReply(response, `${table} insert`)
}

/* Reads rows with a PostgREST filter, e.g. { visit_date: 'eq.2026-11-15', select: 'id,name' }. */
export async function selectRows(table, query) {
  const url = new URL(`/rest/v1/${table}`, process.env.SUPABASE_URL)
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value)
  const response = await fetch(url, {
    headers: authHeaders(),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return readReply(response, `${table} select`)
}

/* Changes the rows matching a filter, e.g. updateRows('rsvps', { id: 'eq.4' }, { done: true }). */
export async function updateRows(table, filter, changes) {
  const url = new URL(`/rest/v1/${table}`, process.env.SUPABASE_URL)
  for (const [key, value] of Object.entries(filter)) url.searchParams.set(key, value)
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { ...authHeaders(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(changes),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) await readReply(response, `${table} update`)
}

async function readReply(response, what) {
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Supabase ${what} failed: ${response.status} ${detail.slice(0, 200)}`)
  }
  return response.json()
}
