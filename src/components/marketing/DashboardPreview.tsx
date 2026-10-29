import { Link } from 'react-router-dom'
import { ArrowUpRight, ClipboardList, FileText, LayoutGrid, ListChecks, Settings, Theater, Users } from 'lucide-react'
import { cn } from '../../lib/cn'
import { scenes, seedCues, team } from '../../workspace/seed'
import { Avatar, deptStyle } from '../../workspace/ui'

const nav = [
  { icon: LayoutGrid, label: 'Overview', active: true },
  { icon: Theater, label: 'Productions' },
  { icon: FileText, label: 'Scripts' },
  { icon: ListChecks, label: 'Cue Sheets' },
  { icon: ClipboardList, label: 'Review Queue', count: 3 },
  { icon: Users, label: 'Team' },
  { icon: Settings, label: 'Settings' },
]

const stats = [
  { label: 'Cues planned', value: seedCues.length },
  { label: 'Approved', value: seedCues.filter((c) => c.status === 'Approved').length },
  { label: 'Awaiting review', value: 3, tone: 'text-curtain-300' },
  { label: 'Days to first preview', value: 18 },
]

export function DashboardPreview() {
  return (
    <Link
      to="/workspace"
      aria-label="Open the interactive workspace demonstration"
      className="group relative block overflow-hidden rounded-2xl border hairline bg-ink-900 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] transition-all duration-300 hover:border-brass-400/30"
    >
      <div className="grid min-h-[420px] grid-cols-[auto_1fr]" aria-hidden="true">
        <aside className="hidden w-48 border-r hairline bg-ink-950/60 p-3 sm:block">
          <p className="mb-4 px-2 pt-1 font-serif text-base text-ivory-50">Stagewoven</p>
          <ul className="space-y-0.5">
            {nav.map(({ icon: Icon, label, active, count }) => (
              <li
                key={label}
                className={cn('flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[0.75rem]', active ? 'bg-ivory-50/[0.06] text-ivory-50' : 'text-ivory-400')}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {count && <span className="ml-auto rounded-full bg-curtain-500/80 px-1.5 font-mono text-[0.6rem] text-ivory-50">{count}</span>}
              </li>
            ))}
          </ul>
        </aside>
        <div className="p-5">
          <p className="eyebrow !text-ivory-500">Northlight Theatre Company</p>
          <p className="mt-1 font-serif text-2xl text-ivory-50">The Last Train</p>
          <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg border hairline bg-ink-850 p-3">
                <p className={cn('font-serif text-2xl text-ivory-50', s.tone)}>{s.value}</p>
                <p className="mt-0.5 text-[0.65rem] text-ivory-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2.5 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-lg border hairline bg-ink-850 p-3.5">
              <p className="text-[0.68rem] text-ivory-400">Cues by scene</p>
              <div className="mt-3 space-y-3">
                {scenes.map((scene) => {
                  const cues = seedCues.filter((c) => c.sceneId === scene.id)
                  return (
                    <div key={scene.id}>
                      <p className="mb-1 text-[0.65rem] text-ivory-300">
                        {scene.number}. {scene.title}
                      </p>
                      <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                        {(['Lighting', 'Sound', 'Scene Change'] as const).map((d) => {
                          const n = cues.filter((c) => c.department === d).length
                          return <span key={d} className={deptStyle[d].dot} style={{ flex: n }} />
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="rounded-lg border hairline bg-ink-850 p-3.5">
              <p className="text-[0.68rem] text-ivory-400">Reviewers</p>
              <ul className="mt-3 space-y-2">
                {team.slice(1, 5).map((m) => (
                  <li key={m.id} className="flex items-center gap-2">
                    <Avatar initials={m.initials} className="h-6 w-6" />
                    <span className="truncate text-[0.7rem] text-ivory-200">{m.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent p-8">
        <span className="inline-flex translate-y-1 items-center gap-2 rounded-full bg-brass-400 px-5 py-2.5 text-sm font-medium text-ink-950 shadow-[0_10px_30px_-10px_rgb(230_162_63/0.7)] transition-transform duration-300 group-hover:translate-y-0">
          Open the interactive workspace <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
