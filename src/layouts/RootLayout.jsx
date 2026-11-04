import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import LiveStatusProvider from '../live/LiveStatusProvider'

function RootLayout() {
  const { pathname } = useLocation()

  // The navbar is fixed, so pages start below it. The home hero runs behind it on desktop.
  const offset = pathname === '/' ? 'pt-17 xl:pt-0' : 'pt-17 xl:pt-18'

  return (
    <LiveStatusProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className={`flex-1 ${offset}`}>
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
    </LiveStatusProvider>
  )
}

export default RootLayout
