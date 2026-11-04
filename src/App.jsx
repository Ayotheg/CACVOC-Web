import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <Placeholder title="About us" /> },
      { path: 'events', element: <Placeholder title="Events" /> },
      { path: 'gallery', element: <Placeholder title="Gallery" /> },
      { path: 'projects', element: <Placeholder title="Projects" /> },
      { path: 'contact', element: <Placeholder title="Contact" /> },
      { path: 'live', element: <Placeholder title="Watch live" /> },
      { path: 'give', element: <Placeholder title="Give" /> },
      // Swap for the real 404 page once it is designed.
      { path: '*', element: <Placeholder title="Page not found" /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
