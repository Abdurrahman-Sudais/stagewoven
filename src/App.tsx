import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { PageLoader } from './components/ui/States'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// The home page ships in the main bundle; every other page, and the workspace, loads on demand.
const Product = lazy(() => import('./pages/Product'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const UseCases = lazy(() => import('./pages/UseCases'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Technology = lazy(() => import('./pages/Trust').then((m) => ({ default: m.Technology })))
const Security = lazy(() => import('./pages/Trust').then((m) => ({ default: m.Security })))
const Legal = lazy(() => import('./pages/Trust').then((m) => ({ default: m.Legal })))

const WorkspaceApp = lazy(() => import('./workspace/WorkspaceApp'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      if (!pathname.startsWith('/workspace')) window.scrollTo(0, 0)
      return
    }
    // Pages load on demand, so keep looking for the anchor briefly, then align again once content settles.
    let tries = 0
    let t = 0
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        t = window.setTimeout(() => el.scrollIntoView(), 450)
      } else if (tries++ < 40) t = window.setTimeout(find, 50)
    }
    find()
    return () => window.clearTimeout(t)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="product" element={<Product />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="use-cases" element={<UseCases />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="technology" element={<Technology />} />
          <Route path="security" element={<Security />} />
          <Route path="privacy" element={<Legal kind="privacy" />} />
          <Route path="terms" element={<Legal kind="terms" />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="workspace/*"
          element={
            <Suspense fallback={<PageLoader label="Opening the workspace" />}>
              <WorkspaceApp />
            </Suspense>
          }
        />
      </Routes>
    </>
  )
}
