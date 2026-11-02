import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, Pencil, Plus, Search, SearchX, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'
import { useWorkspace } from '../store'
import { scenes } from '../seed'
import type { Cue, CueStatus, Department } from '../types'
import { DeptBadge, deptStyle, Select, StatusBadge, ViewHeader } from '../ui'
import { useWorkspaceUi } from '../uiContext'

const departments: Department[] = ['Lighting', 'Sound', 'Scene Change']
const statuses: CueStatus[] = ['Draft', 'Needs Review', 'Reviewed', 'Approved']

function toCsv(cues: Cue[]) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const header = ['Cue', 'Department', 'Scene', 'Trigger type', 'Trigger', 'Script line', 'Instruction', 'Status']
  const rows = cues.map((c) => [c.id, c.department, scenes.find((s) => s.id === c.sceneId)?.title ?? '', c.triggerType, c.trigger, c.lineRef ?? '', c.instruction, c.status])
  return [header, ...rows].map((r) => r.map(esc).join(',')).join('\n')
}

export default function CueSheets() {
  const { state, dispatch, can } = useWorkspace()
  const { openEditor, toast } = useWorkspaceUi()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const dept = params.get('dept') ?? ''
  const scene = params.get('scene') ?? ''
  const status = params.get('status') ?? ''

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const clearAll = () => setParams({}, { replace: true })
  const activeFilters = [query, dept, scene, status].filter(Boolean).length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return state.cues
      .filter((c) => (!dept || c.department === dept) && (!scene || c.sceneId === scene) && (!status || c.status === status))
      .filter((c) => !q || [c.id, c.trigger, c.instruction, c.lineRef ?? ''].some((v) => v.toLowerCase().includes(q)))
  }, [state.cues, query, dept, scene, status])

  const [exporting, setExporting] = useState(false)
  function exportCsv() {
    setExporting(true)
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `the-last-train-cue-sheet${dept ? '-' + deptStyle[dept as Department].short.toLowerCase() : ''}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setExporting(false), 400)
    toast(`Exported ${filtered.length} cues as CSV.`)
  }

  return (
    <>
      <ViewHeader
        title="Cue Sheets"
        description="Every lighting, sound and scene-change cue for The Last Train, grouped by scene."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={exportCsv} disabled={!filtered.length || exporting}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button size="sm" disabled={!can('cues')} onClick={() => openEditor()}>
              <Plus className="h-3.5 w-3.5" /> Add cue
            </Button>
          </>
        }
      />

      <div className="panel mb-5 flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search cues</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ivory-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder="Search by cue ID, trigger or instruction"
            className="h-9 w-full rounded-lg border border-ivory-50/10 bg-ink-900 pr-3 pl-9 text-sm text-ivory-50 outline-none placeholder:text-ivory-600 focus:border-brass-400/60 focus:ring-2 focus:ring-brass-400/20"
          />
        </label>
        <div className="grid grid-cols-3 gap-2 lg:flex">
          <Select aria-label="Filter by department" value={dept} onChange={(e) => setFilter('dept', e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
          <Select aria-label="Filter by scene" value={scene} onChange={(e) => setFilter('scene', e.target.value)}>
            <option value="">All scenes</option>
            {scenes.map((s) => (
              <option key={s.id} value={s.id}>
                Scene {s.number}
              </option>
            ))}
          </Select>
          <Select aria-label="Filter by status" value={status} onChange={(e) => setFilter('status', e.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>

      <p className="mb-3 text-xs text-ivory-500" aria-live="polite">
        Showing {filtered.length} of {state.cues.length} cues
      </p>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={<SearchX className="h-5 w-5" />}
            title="No cues match"
            body="Try a different search, or clear the filters to see the whole cue sheet."
            action={
              <Button variant="secondary" size="sm" onClick={clearAll}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-5">
          {scenes.map((s) => {
            const sceneCues = filtered.filter((c) => c.sceneId === s.id)
            if (!sceneCues.length) return null
            return (
              <section key={s.id} className="panel overflow-hidden" aria-labelledby={`scene-${s.id}`}>
                <h2 id={`scene-${s.id}`} className="flex items-baseline gap-3 border-b hairline bg-ink-900/60 px-5 py-3">
                  <span className="font-serif text-lg text-ivory-50">
                    Scene {s.number} — {s.title}
                  </span>
                  <span className="text-xs text-ivory-500">{sceneCues.length} cues</span>
                </h2>

                {/* Desktop table */}
                <table className="hidden w-full text-left text-sm md:table">
                  <thead>
                    <tr className="border-b hairline text-[0.68rem] tracking-wider text-ivory-500 uppercase">
                      <th scope="col" className="w-24 px-5 py-2.5 font-normal">Cue</th>
                      <th scope="col" className="w-36 py-2.5 font-normal">Department</th>
                      <th scope="col" className="py-2.5 pr-4 font-normal">Trigger</th>
                      <th scope="col" className="py-2.5 pr-4 font-normal">Instruction</th>
                      <th scope="col" className="w-40 py-2.5 font-normal">Status</th>
                      <th scope="col" className="w-14 py-2.5"><span className="sr-only">Edit</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sceneCues.map((c) => (
                      <tr key={c.id} className={cn('border-b border-ivory-50/[0.04] align-top transition-colors last:border-0 hover:bg-ivory-50/[0.02]', c.status === 'Needs Review' && 'bg-curtain-500/[0.05]')}>
                        <td className="px-5 py-3 font-mono text-[0.8rem] text-ivory-50">{c.id}</td>
                        <td className="py-3"><DeptBadge department={c.department} /></td>
                        <td className="py-3 pr-4 text-ivory-200">
                          <span className="mr-1.5 text-[0.65rem] tracking-wider text-ivory-500 uppercase">{c.triggerType}</span>
                          {c.trigger}
                        </td>
                        <td className="py-3 pr-4 text-ivory-300">{c.instruction}</td>
                        <td className="py-2.5">
                          <StatusSelect cue={c} onChange={(st) => dispatch({ type: 'SET_CUE_STATUS', cueId: c.id, status: st })} />
                        </td>
                        <td className="py-2.5 pr-3">
                          <button onClick={() => openEditor(c)} className="rounded-md p-2 text-ivory-400 hover:bg-ivory-50/5 hover:text-ivory-50" aria-label={`Edit ${c.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile cards */}
                <ul className="divide-y divide-ivory-50/[0.05] md:hidden">
                  {sceneCues.map((c) => (
                    <li key={c.id} className="space-y-2 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm text-ivory-50">{c.id}</span>
                        <button onClick={() => openEditor(c)} className="rounded-md p-1.5 text-ivory-400 hover:text-ivory-50" aria-label={`Edit ${c.id}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <DeptBadge department={c.department} />
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm text-ivory-200">{c.trigger}</p>
                      <p className="text-sm text-ivory-400">{c.instruction}</p>
                      <StatusSelect cue={c} onChange={(st) => dispatch({ type: 'SET_CUE_STATUS', cueId: c.id, status: st })} />
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}

function StatusSelect({ cue, onChange }: { cue: Cue; onChange: (s: CueStatus) => void }) {
  const { can } = useWorkspace()
  return (
    <Select aria-label={`Status for ${cue.id}`} disabled={!can('cues')} value={cue.status} onChange={(e) => onChange(e.target.value as CueStatus)} className="w-full md:w-36">
      {statuses.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </Select>
  )
}
