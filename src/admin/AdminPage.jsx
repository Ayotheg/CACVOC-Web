import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Logo } from '../components/Brand'
import { LogOut } from '../components/icons'
import Overview from './Overview'
import Subscribers from './Subscribers'
import { supabase } from './supabase'
import Visitors from './Visitors'

const TABS = [
  { id: 'overview', label: 'Website', Component: Overview },
  { id: 'visitors', label: 'Visitors', Component: Visitors },
  { id: 'subscribers', label: 'Subscribers', Component: Subscribers },
]

function Shell({ children }) {
  return (
    <div className="min-h-dvh bg-slate-100">
      <title>Admin · CAC Vineyard of Comfort</title>
      <meta name="robots" content="noindex, nofollow" />
      {children}
    </div>
  )
}

function CenteredCard({ children }) {
  return (
    <Shell>
      <div className="flex min-h-dvh items-center justify-center px-4 py-10">
        <div className="w-full max-w-100 rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="size-10" />
            <span className="font-heading text-base leading-5 font-bold text-heading">Church admin</span>
          </Link>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </Shell>
  )
}

const inputClass =
  'type-input mt-2 h-12 w-full rounded-md border border-border bg-white px-4 text-heading placeholder:text-slate-400'
const primaryButton =
  'flex h-12 w-full cursor-pointer items-center justify-center rounded-pill bg-ink font-ui text-[15px] font-semibold text-white transition-colors hover:bg-blue-900 disabled:cursor-wait disabled:opacity-70'

function SignIn() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget.elements
    setBusy(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.value.trim(),
      password: form.password.value,
    })
    setBusy(false)
    if (signInError) setError('That email and password don’t match an admin account.')
  }

  return (
    <CenteredCard>
      <h1 className="type-h3 text-heading">Sign in</h1>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <label className="font-form text-sm font-semibold text-heading">
          Email
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="font-form text-sm font-semibold text-heading">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </label>
        {error && (
          <p role="alert" className="font-form text-sm font-medium text-coral-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </CenteredCard>
  )
}

function SignOutButton({ className = '' }) {
  return (
    <button
      type="button"
      onClick={() => supabase.auth.signOut()}
      className={`flex h-10 cursor-pointer items-center gap-2 rounded-pill border border-border bg-white px-4 font-ui text-sm font-semibold text-heading transition-colors hover:bg-slate-100 ${className}`}
    >
      <LogOut aria-hidden="true" className="size-4" />
      Sign out
    </button>
  )
}

function Dashboard({ email }) {
  const [tab, setTab] = useState(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('tab')
    return TABS.some((item) => item.id === fromUrl) ? fromUrl : TABS[0].id
  })
  const { Component } = TABS.find((item) => item.id === tab)

  const choose = (id) => {
    setTab(id)
    window.history.replaceState(null, '', `?tab=${id}`)
  }

  return (
    <Shell>
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-300 items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <Logo className="size-9 shrink-0" />
            <span className="truncate font-heading text-base font-bold text-heading">Church admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-form text-sm text-muted max-md:hidden">{email}</span>
            <SignOutButton />
          </div>
        </div>
        <nav aria-label="Admin sections" className="mx-auto flex max-w-300 gap-1 overflow-x-auto px-4 md:px-8">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id ? 'page' : undefined}
              onClick={() => choose(item.id)}
              className={`cursor-pointer border-b-2 px-3 py-3 font-ui text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === item.id
                  ? 'border-ink text-heading'
                  : 'border-transparent text-muted hover:text-heading'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-300 px-4 py-6 md:px-8 md:py-8">
        <Component />
      </main>
    </Shell>
  )
}

/* /admin. Anyone can sign in to Supabase, but only accounts listed in public.admins see data:
   the database checks that on every request, this page only decides what to show. */
function AdminPage() {
  const [session, setSession] = useState(undefined) // undefined while loading
  const [adminCheck, setAdminCheck] = useState({ userId: null, isAdmin: false })

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id
  useEffect(() => {
    if (!userId) return
    let current = true
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (current) setAdminCheck({ userId, isAdmin: !error && data === true })
    })
    return () => {
      current = false
    }
  }, [userId])
  // Undefined until the check for the account that is signed in now has answered.
  const isAdmin = adminCheck.userId === userId ? adminCheck.isAdmin : undefined

  if (!supabase) {
    return (
      <CenteredCard>
        <p className="type-body text-body">
          The admin isn’t connected yet. Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in Vercel, then redeploy (see SETUP.md).
        </p>
      </CenteredCard>
    )
  }
  if (session === undefined || (session && isAdmin === undefined)) {
    return (
      <Shell>
        <p className="p-8 text-center font-form text-sm text-muted">Loading…</p>
      </Shell>
    )
  }
  if (!session) return <SignIn />
  if (!isAdmin) {
    return (
      <CenteredCard>
        <p className="type-body text-body">
          {session.user.email} isn’t an admin. Ask whoever manages the site to add you.
        </p>
        <SignOutButton className="mt-5" />
      </CenteredCard>
    )
  }
  return <Dashboard email={session.user.email} />
}

export default AdminPage
