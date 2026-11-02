import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { mainNav } from '../../data/site'
import { cn } from '../../lib/cn'
import { Logo } from '../ui/Logo'
import { ButtonLink } from '../ui/Button'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open ? 'border-b hairline bg-ink-950/85 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[72px]">
        <Link to="/" aria-label="Stagewoven home" className="rounded-md">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-3.5 py-2 text-[0.85rem] transition-colors after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:bg-brass-400 after:transition-transform',
                    isActive && !item.to.includes('#') ? 'text-ivory-50 after:scale-x-100' : 'text-ivory-300 after:scale-x-0 hover:text-ivory-50 hover:after:scale-x-100',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/workspace" className="rounded-full px-3 py-2 text-[0.85rem] text-ivory-300 hover:text-ivory-50">
            Live demo
          </Link>
          <ButtonLink to="/contact?type=demo" size="sm" className="h-9 px-4">
            Request early access <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ivory-100 hover:bg-ivory-50/5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] animate-fade-in overflow-y-auto border-t hairline lg:hidden">
          <ul className="space-y-1 px-5 py-6">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between border-b hairline py-4 font-serif text-2xl',
                      isActive ? 'text-brass-300' : 'text-ivory-100',
                    )
                  }
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-ivory-500" />
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="space-y-3 px-5">
            <ButtonLink to="/contact?type=demo" size="lg" className="w-full">
              Request early access <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink to="/workspace" variant="secondary" size="lg" className="w-full">
              Explore the live demo
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  )
}
