import { useMemo, useState } from 'react'
import { Check, Download, Minus } from 'lucide-react'
import { ACTIONS, ACTION_LABEL, MEMBER_ROLE, ROLE_LABEL, can, memberName, type DemoRole } from '../access'
import { useWorkspace } from '../store'
import { team } from '../seed'
import { Avatar, ViewHeader } from '../ui'
import { Button } from '../../components/ui/Button'

const ROLES: DemoRole[] = ['psm', 'dsm', 'designer', 'coordinator']
const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
const fmt = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

export default function Audit() {
  const { state, can: allowed, role } = useWorkspace()
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    return [...state.audit].reverse().filter((e) => !t || `${memberName(e.userId)} ${e.action} ${e.detail}`.toLowerCase().includes(t))
  }, [state.audit, q])
  const exportCsv = () => {
    const text = [['Time', 'Person', 'Action', 'Detail'], ...rows.map((e) => [e.at, memberName(e.userId), e.action, e.detail])].map((r) => r.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'stagewoven-audit-log.csv'
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <>
      <ViewHeader title="Audit & roles" description="Who can do what in this demo workspace, and an append-only record of every change made in this browser. Switch user under “Demo as” to try each role." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-6">
          <section className="panel p-5">
            <h2 className="text-sm text-ivory-50">Roles and permissions</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-[0.8rem]">
                <thead><tr className="text-left text-[0.68rem] text-ivory-500"><th className="py-2 pr-3 font-normal">Action</th>{ROLES.map((r) => <th key={r} className="px-2 py-2 text-center font-normal">{ROLE_LABEL[r]}</th>)}</tr></thead>
                <tbody>
                  {ACTIONS.map((a) => (
                    <tr key={a} className="border-t hairline">
                      <td className="py-2 pr-3 text-ivory-200">{ACTION_LABEL[a]}</td>
                      {ROLES.map((r) => <td key={r} className="px-2 py-2 text-center">{can(r, a) ? <Check className="mx-auto h-4 w-4 text-sage-300" aria-label="Allowed" /> : <Minus className="mx-auto h-4 w-4 text-ivory-500/50" aria-label="Not allowed" />}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[0.72rem] text-ivory-500">Resetting the demo is open to everyone because it only clears this browser. In production, roles come from your identity provider and are enforced on the server.</p>
          </section>
          <section className="panel p-5">
            <h2 className="text-sm text-ivory-50">People in this demo</h2>
            <ul className="mt-2 divide-y divide-ivory-50/10">
              {team.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2.5 text-[0.8rem]">
                  <span className="flex items-center gap-2.5"><Avatar initials={m.initials} /><span><span className="block text-ivory-100">{m.name}</span><span className="block text-[0.68rem] text-ivory-500">{m.role}</span></span></span>
                  <span className="rounded-full border border-ivory-50/10 px-2 py-0.5 text-[0.68rem] text-ivory-300">{ROLE_LABEL[MEMBER_ROLE[m.id] ?? 'coordinator']}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section className="panel min-w-0 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm text-ivory-50">Audit log ({state.audit.length})</h2>
            {allowed('audit') && <Button size="sm" variant="secondary" onClick={exportCsv}><Download className="h-3.5 w-3.5" /> Export CSV</Button>}
          </div>
          <div className="mt-3">
            {!allowed('audit') ? (
              <p role="note" className="rounded-lg border border-ivory-50/10 bg-ink-900 px-3 py-2 text-[0.75rem] text-ivory-400">🔒 Acting as {ROLE_LABEL[role].toLowerCase()}: only the production stage manager can read the audit log. Switch to Ama Osei under “Demo as”.</p>
            ) : (
              <>
                <label htmlFor="audit-q" className="sr-only">Filter the audit log</label>
                <input id="audit-q" className="mb-3 h-9 w-full rounded-lg border border-ivory-50/10 bg-ink-900 px-3 text-[0.8rem] text-ivory-100 outline-none focus:border-brass-400/60" placeholder="Filter by person, action or cue…" value={q} onChange={(e) => setQ(e.target.value)} />
                <ol className="divide-y divide-ivory-50/10">
                  {rows.map((e) => (
                    <li key={e.id} className="py-2.5 text-[0.8rem]">
                      <div className="flex flex-wrap items-baseline justify-between gap-2"><span className="text-ivory-100">{memberName(e.userId)}</span><span className="font-mono text-[0.68rem] text-ivory-500">{fmt(e.at)}</span></div>
                      <div className="text-ivory-300"><span className="mr-1.5 rounded bg-ivory-50/[0.06] px-1.5 py-0.5 font-mono text-[0.6rem] uppercase text-ivory-400">{e.action}</span>{e.detail}</div>
                    </li>
                  ))}
                  {!rows.length && <li className="py-3 text-[0.8rem] text-ivory-500">No changes yet. Run a comparison, edit a cue or resolve a review, and it will appear here.</li>}
                </ol>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
