import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { PageLoader } from './components/ui/States'
import Home from './pages/Home'
import Product from './pages/Product'
import HowItWorks from './pages/HowItWorks'
import UseCases from './pages/UseCases'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const WorkspaceApp = lazy(() => import('./workspace/WorkspaceApp'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    if (!pathname.startsWith('/workspace')) window.scrollTo(0, 0)
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
