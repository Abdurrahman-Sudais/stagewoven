import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useRevealOnScroll } from '../../lib/motion'
import { PageLoader } from '../ui/States'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function SiteLayout() {
  const { pathname } = useLocation()
  useRevealOnScroll(pathname)
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-brass-400 px-4 py-2 text-sm text-ink-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader label="Loading" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
