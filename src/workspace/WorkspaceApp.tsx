import { Component, useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowLeft, ClipboardList, FileText, LayoutGrid, ListChecks, Lock, Menu, Plus, Settings, Theater, Users, X } from 'lucide-react'
import { ROLE_LABEL, roleOf } from './access'
import Audit from './views/Audit'
import { cn } from '../lib/cn'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { Button, ButtonLink } from '../components/ui/Button'
import { LogoMark } from '../components/ui/Logo'
import { WorkspaceProvider, useWorkspace } from './store'
import { production, team } from './seed'
import type { Cue } from './types'
import { Avatar } from './ui'
import { CueEditorModal } from './CueEditorModal'
import { UiContext } from './uiContext'
import Overview from './views/Overview'
import Productions from './views/Productions'
import Scripts from './views/Scripts'
import CueSheets from './views/CueSheets'
import ReviewQueue from './views/ReviewQueue'
import Team from './views/Team'
import SettingsView from './views/Settings'

const STORAGE_KEY = 'stagewoven-demo-v1'


const nav = [
  { to: '/workspace', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/workspace/productions', label: 'Productions', icon: Theater },
  { to: '/workspace/scripts', label: 'Scripts', icon: FileText },
  { to: '/workspace/cues', label: 'Cue Sheets', icon: ListChecks },
  { to: '/workspace/review', label: 'Review Queue', icon: ClipboardList, badge: true },
  { to: '/workspace/team', label: 'Team', icon: Users },
  { to: '/workspace/audit', label: 'Audit & roles', icon: Lock },
  { to: '/workspace/settings', label: 'Settings', icon: Settings },
]

class WorkspaceErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-ink-950 px-6 text-center">
        <LogoMark className="h-10 w-10" />
        <h1 className="font-serif text-3xl text-ivory-50">The workspace hit a problem.</h1>
        <p className="max-w-md text-sm text-ivory-400">Your saved demo data may be from an older version. Resetting restores the sample production.</p>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              try {
                localStorage.removeItem(STORAGE_KEY)
              } catch {
                /* ignore */
              }
              window.location.reload()
            }}
          >
            Reset demo data
          </Button>
          <ButtonLink to="/" variant="secondary">
            Back to the website
          </ButtonLink>
        </div>
      </div>
    )
  }
}

export default function WorkspaceApp() {
  return (
    <WorkspaceErrorBoundary>
      <WorkspaceProvider>
        <Shell />
      </WorkspaceProvider>
    </WorkspaceErrorBoundary>
  )
}

function Shell() {
  const { state, dispatch, can } = useWorkspace()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editor, setEditor] = useState<{ open: boolean; cue?: Cue }>({ open: false })
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([])

  useDocumentMeta('Workspace demo', 'Interactive Stagewoven workspace demonstration with the sample production “The Last Train”.', '/workspace')
  useEffect(() => setMenuOpen(false), [location.pathname])

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  const openEditor = useCallback((cue?: Cue) => setEditor({ open: true, cue }), [])

  const openReviews = state.reviews.filter((r) => r.status !== 'Resolved').length
  const me = team.find((t) => t.id === state.userId) ?? team[0]

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b hairline px-4">
        <Link to="/" className="flex items-center gap-2.5 rounded-md" aria-label="Back to the Stagewoven website">
          <LogoMark />
          <span className="font-serif text-lg text-ivory-50">Stagewoven</span>
        </Link>
        <button className="rounded-md p-1.5 text-ivory-400 hover:text-ivory-50 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="px-3 pt-4">
        <div className="rounded-lg border hairline bg-ink-850 px-3 py-2.5">
          <p className="text-[0.65rem] tracking-wider text-ivory-500 uppercase">Production</p>
          <p className="mt-0.5 truncate font-serif text-[1.05rem] text-ivory-50">{production.title}</p>
          <p className="truncate text-[0.7rem] text-ivory-400">{production.phase}</p>
        </div>
      </div>
      <nav aria-label="Workspace" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-ivory-50/[0.07] text-ivory-50 before:absolute before:top-2 before:bottom-2 before:-left-3 before:w-0.5 before:rounded-full before:bg-brass-400' : 'text-ivory-400 hover:bg-ivory-50/[0.04] hover:text-ivory-100',
                  )
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
                {item.badge && openReviews > 0 && (
                  <span className="ml-auto rounded-full bg-curtain-500 px-1.5 py-px font-mono text-[0.65rem] text-ivory-50" aria-label={`${openReviews} open reviews`}>
                    {openReviews}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t hairline p-3">
        <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-ivory-400 hover:text-ivory-100">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to website
        </Link>
        <div className="mt-1 px-3 py-2">
          <label htmlFor="demo-as" className="mb-1.5 flex items-center gap-2 text-[0.62rem] tracking-wider text-ivory-500 uppercase">
            <Avatar initials={me.initials} />
            Demo as
          </label>
          <select
            id="demo-as"
            aria-label="Demo as user"
            className="h-9 w-full rounded-lg border border-ivory-50/10 bg-ink-900 px-2 text-[0.75rem] text-ivory-100 outline-none focus:border-brass-400/60"
            value={me.id}
            onChange={(e) => dispatch({ type: 'SET_USER', userId: e.target.value })}
          >
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {ROLE_LABEL[roleOf(m.id)]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )

  return (
    <UiContext.Provider value={{ openEditor, toast }}>
      <div className="flex min-h-dvh bg-ink-950">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r hairline bg-ink-900/60 lg:block">{sidebar}</aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Workspace navigation">
            <div className="absolute inset-0 animate-fade-in bg-ink-950/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <aside className="relative h-full w-72 animate-fade-in border-r hairline bg-ink-900">{sidebar}</aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b hairline bg-ink-950/85 px-4 backdrop-blur-xl sm:px-6">
            <button className="-ml-1 rounded-md p-2 text-ivory-300 hover:bg-ivory-50/5 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ivory-100">
                {production.title}
                <span className="hidden text-ivory-500 sm:inline"> · {production.company}</span>
              </p>
              <p className="truncate text-[0.7rem] text-ivory-500">
                First preview {new Date(production.firstPreview).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} · {production.venue}
              </p>
            </div>
            <span className="hidden rounded-full border border-brass-400/25 bg-brass-400/[0.06] px-2.5 py-1 font-mono text-[0.62rem] tracking-wider text-brass-300 uppercase md:inline">
              Demo · sample data
            </span>
            <Button size="sm" disabled={!can('cues')} title={can('cues') ? undefined : 'Your role cannot add cues'} onClick={() => openEditor()} aria-label="Add cue">
              <Plus className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Add cue</span>
            </Button>
          </header>

          <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div key={location.pathname} className="mx-auto max-w-7xl animate-fade-in">
              <Routes>
                <Route index element={<Overview />} />
                <Route path="productions" element={<Productions />} />
                <Route path="scripts" element={<Scripts />} />
                <Route path="cues" element={<CueSheets />} />
                <Route path="review" element={<ReviewQueue />} />
                <Route path="team" element={<Team />} />
                <Route path="audit" element={<Audit />} />
                <Route path="settings" element={<SettingsView />} />
                <Route
                  path="*"
                  element={
                    <div className="py-20 text-center">
                      <p className="font-serif text-3xl text-ivory-50">That workspace page doesn’t exist.</p>
                      <ButtonLink to="/workspace" variant="secondary" className="mt-6">
                        Go to Overview
                      </ButtonLink>
                    </div>
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      {editor.open && <CueEditorModal cue={editor.cue} onClose={() => setEditor({ open: false })} onSaved={toast} />}

      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto animate-scale-in rounded-lg border hairline bg-ink-800 px-4 py-3 text-sm text-ivory-100 shadow-2xl">
            {t.message}
          </div>
        ))}
      </div>
    </UiContext.Provider>
  )
}
