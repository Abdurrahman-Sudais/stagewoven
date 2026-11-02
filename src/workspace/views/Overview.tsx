import { AssistantPanel } from '../AssistantPanel'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, GitCompareArrows, ListChecks } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ButtonLink } from '../../components/ui/Button'
import { useWorkspace } from '../store'
import { production, scenes, team } from '../seed'
import type { Department } from '../types'
import { Avatar, DeptBadge, deptColor, formatDateTime, PriorityBadge, SimulatedNotice, ViewHeader } from '../ui'

const departments: Department[] = ['Lighting', 'Sound', 'Scene Change']

export default function Overview() {
  const { state } = useWorkspace()
  const { cues, reviews, activity, comparedAt } = state
  const open = reviews.filter((r) => r.status !== 'Resolved')
  const daysToPreview = Math.max(0, Math.ceil((new Date(production.firstPreview).getTime() - Date.now()) / 86_400_000))

  const chartData = scenes.map((s) => {
    const row: Record<string, string | number> = { scene: `Sc. ${s.number}`, title: s.title }
    departments.forEach((d) => (row[d] = cues.filter((c) => c.sceneId === s.id && c.department === d).length))
    return row
  })

  const stats = [
    { label: 'Cues planned', value: cues.length, icon: ListChecks },
    { label: 'Approved', value: cues.filter((c) => c.status === 'Approved').length, icon: CheckCircle2 },
    { label: 'Open reviews', value: open.length, icon: ClipboardList, alert: open.length > 0 },
    { label: 'Days to first preview', value: daysToPreview, icon: CalendarDays },
  ]

  return (
    <>
      <ViewHeader title="Overview" description={`${production.company} · ${production.venue} · ${production.phase}`} />
      <div className="mb-6"><AssistantPanel /></div>

      {!comparedAt && (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-brass-400/25 bg-gradient-to-r from-brass-400/[0.08] to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <GitCompareArrows className="mt-0.5 h-5 w-5 shrink-0 text-brass-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-ivory-50">Rehearsal draft 4 is in. Start the demo here.</p>
              <p className="mt-0.5 text-sm text-ivory-400">Compare it with draft 3 to see which cues the director’s cut affects.</p>
            </div>
          </div>
          <ButtonLink to="/workspace/scripts?compare=1" size="sm">
            Compare Revisions <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel p-5">
            <s.icon className={s.alert ? 'h-4 w-4 text-curtain-300' : 'h-4 w-4 text-ivory-500'} aria-hidden="true" />
            <p className={`mt-4 font-serif text-4xl tabular-nums ${s.alert ? 'text-curtain-300' : 'text-ivory-50'}`}>{s.value}</p>
            <p className="mt-1 text-xs text-ivory-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="panel p-5" aria-labelledby="chart-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="chart-title" className="text-sm font-medium text-ivory-100">
              Cues by scene and department
            </h2>
            <ul className="flex flex-wrap gap-4 text-xs text-ivory-300" aria-label="Legend">
              {departments.map((d) => (
                <li key={d} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: deptColor[d] }} aria-hidden="true" /> {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 h-60" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="38%" margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgb(246 241 231 / 0.06)" />
                <XAxis dataKey="scene" tickLine={false} axisLine={false} tick={{ fill: '#a39886', fontSize: 12 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#847a6b', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: 'rgb(246 241 231 / 0.04)' }}
                  contentStyle={{ background: '#1b1815', border: '1px solid rgb(246 241 231 / 0.1)', borderRadius: 8, fontSize: 12, color: '#ece5d7' }}
                  labelStyle={{ color: '#f6f1e7', marginBottom: 4 }}
                  itemStyle={{ color: '#d9d0bf', padding: 0 }}
                  labelFormatter={(_, p) => (p?.[0] ? `${p[0].payload.scene} · ${p[0].payload.title}` : '')}
                />
                {departments.map((d, i) => (
                  <Bar
                    key={d}
                    dataKey={d}
                    stackId="a"
                    fill={deptColor[d]}
                    stroke="#151210"
                    strokeWidth={2}
                    radius={i === departments.length - 1 ? [4, 4, 0, 0] : 0}
                    maxBarSize={56}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="sr-only left-0 top-0">
            <caption>Cues by scene and department</caption>
            <thead>
              <tr>
                <th>Scene</th>
                {departments.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((r) => (
                <tr key={String(r.scene)}>
                  <td>{r.title}</td>
                  {departments.map((d) => (
                    <td key={d}>{r[d]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel flex flex-col p-5" aria-labelledby="queue-title">
          <div className="flex items-center justify-between">
            <h2 id="queue-title" className="text-sm font-medium text-ivory-100">
              Review queue
            </h2>
            <Link to="/workspace/review" className="text-xs text-brass-300 hover:text-brass-200">
              Open queue →
            </Link>
          </div>
          {open.length === 0 ? (
            <p className="m-auto py-8 text-center text-sm text-ivory-400">Nothing waiting for review.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {open.slice(0, 4).map((r) => {
                const cue = cues.find((c) => c.id === r.cueId)
                const who = team.find((m) => m.id === r.assigneeId)
                return (
                  <li key={r.id}>
                    <Link to={`/workspace/review?item=${r.id}`} className="flex items-center gap-3 rounded-lg border hairline bg-ink-900/60 p-3 transition-colors hover:border-ivory-50/15">
                      <span className="w-16 shrink-0 font-mono text-xs text-ivory-50">{r.cueId}</span>
                      <span className="min-w-0 flex-1">
                        {cue && <DeptBadge department={cue.department} />}
                        <span className="mt-1 block truncate text-xs text-ivory-400">{r.source}</span>
                      </span>
                      <PriorityBadge priority={r.priority} />
                      {who && <Avatar initials={who.initials} className="hidden sm:inline-flex" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="panel p-5" aria-labelledby="scenes-title">
          <h2 id="scenes-title" className="text-sm font-medium text-ivory-100">
            Scenes
          </h2>
          <ul className="mt-4 divide-y divide-ivory-50/[0.06]">
            {scenes.map((s) => {
              const sc = cues.filter((c) => c.sceneId === s.id)
              const flagged = sc.filter((c) => c.status === 'Needs Review').length
              return (
                <li key={s.id} className="flex items-center gap-4 py-3">
                  <span className="font-serif text-2xl text-ivory-500">{s.number}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ivory-100">{s.title}</p>
                    <p className="truncate text-xs text-ivory-500">
                      {s.setting} · {s.runningTime}
                    </p>
                  </div>
                  <span className="text-xs text-ivory-400 tabular-nums">{sc.length} cues</span>
                  {flagged > 0 && <span className="rounded-full bg-curtain-500/20 px-2 py-0.5 text-[0.7rem] text-curtain-300">{flagged} flagged</span>}
                </li>
              )
            })}
          </ul>
        </section>
        <section className="panel p-5" aria-labelledby="activity-title">
          <h2 id="activity-title" className="text-sm font-medium text-ivory-100">
            Recent activity
          </h2>
          <ol className="mt-4 space-y-3">
            {activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ivory-600" aria-hidden="true" />
                <div>
                  <p className="text-ivory-200">{a.text}</p>
                  <p className="text-xs text-ivory-500">{formatDateTime(a.at)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <SimulatedNotice className="mt-6">
        <strong className="font-medium">About this demo.</strong> All data is fictional and stored only in this browser. Change detection is a simulated, rule-based comparison of two seeded drafts; no AI or comparison service is connected. Stagewoven does not control lighting desks or sound consoles.
      </SimulatedNotice>
    </>
  )
}
