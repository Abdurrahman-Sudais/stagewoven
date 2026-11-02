import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCheck, ClipboardCheck, GitCompareArrows, MapPin, Pencil, RotateCcw, ThumbsUp } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button, ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'
import { useWorkspace } from '../store'
import { revisions, team } from '../seed'
import { describeLine } from '../compare'
import type { Priority } from '../types'
import { DeptBadge, formatDateTime, PriorityBadge, ReviewStatusBadge, Select, SimulatedNotice, StatusBadge, ViewHeader } from '../ui'
import { useWorkspaceUi } from '../uiContext'

const allLines = new Map(revisions.flatMap((r) => r.lines).map((l) => [l.id, l]))
const priorityRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }

export default function ReviewQueue() {
  const { state, dispatch, can } = useWorkspace()
  const { openEditor, toast } = useWorkspaceUi()
  const [params, setParams] = useSearchParams()
  const priority = params.get('priority') ?? ''
  const status = params.get('status') ?? 'active'
  const dept = params.get('dept') ?? ''
  const selectedId = params.get('item')

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const items = useMemo(
    () =>
      state.reviews
        .filter((r) => (status === 'active' ? r.status !== 'Resolved' : status === 'all' ? true : r.status === status))
        .filter((r) => !priority || r.priority === priority)
        .filter((r) => !dept || state.cues.find((c) => c.id === r.cueId)?.department === dept)
        .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]),
    [state.reviews, state.cues, status, priority, dept],
  )
  const selected = items.find((r) => r.id === selectedId) ?? items[0]
  const cue = selected && state.cues.find((c) => c.id === selected.cueId)
  const changed = selected?.changedLineRef ? allLines.get(selected.changedLineRef) : undefined
  const revisedText = selected?.change === 'modified' && changed ? revisions[revisions.length - 1].lines.find((l) => l.id === changed.id) : undefined
  const suggested = selected?.suggestedLineRef ? allLines.get(selected.suggestedLineRef) : undefined
  const alreadyMoved = cue && suggested && cue.lineRef === suggested.id

  return (
    <>
      <ViewHeader title="Review Queue" description="Cues flagged by revision comparisons or by the team. Assign each one, check the trigger, then mark it reviewed or approve it." />
      <SimulatedNotice className="mb-5" />

      <div className="panel mb-5 grid grid-cols-3 gap-2 p-3 lg:flex">
        <Select aria-label="Filter by review status" value={status} onChange={(e) => set('status', e.target.value)}>
          <option value="active">Open and in review</option>
          <option value="Open">Open</option>
          <option value="In Review">In review</option>
          <option value="Resolved">Resolved</option>
          <option value="all">All</option>
        </Select>
        <Select aria-label="Filter by priority" value={priority} onChange={(e) => set('priority', e.target.value)}>
          <option value="">All priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </Select>
        <Select aria-label="Filter by department" value={dept} onChange={(e) => set('dept', e.target.value)}>
          <option value="">All departments</option>
          <option>Lighting</option>
          <option>Sound</option>
          <option>Scene Change</option>
        </Select>
      </div>

      {items.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Nothing to review here"
            body={state.comparedAt ? 'No review items match these filters.' : 'Run “Compare Revisions” on the Scripts page to find cues affected by draft 4.'}
            action={
              !state.comparedAt && (
                <ButtonLink to="/workspace/scripts?compare=1" size="sm">
                  <GitCompareArrows className="h-3.5 w-3.5" /> Compare Revisions
                </ButtonLink>
              )
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
          <ul className="space-y-2" aria-label="Review items">
            {items.map((r) => {
              const c = state.cues.find((x) => x.id === r.cueId)
              const who = team.find((m) => m.id === r.assigneeId)
              return (
                <li key={r.id}>
                  <button
                    onClick={() => set('item', r.id)}
                    aria-current={selected?.id === r.id}
                    className={cn('w-full rounded-xl border p-4 text-left transition-colors', selected?.id === r.id ? 'border-brass-400/40 bg-brass-400/[0.05]' : 'hairline bg-ink-900/60 hover:border-ivory-50/15')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm text-ivory-50">{r.cueId}</span>
                      <PriorityBadge priority={r.priority} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {c && <DeptBadge department={c.department} />}
                      <ReviewStatusBadge status={r.status} />
                    </div>
                    <p className="mt-2 truncate text-xs text-ivory-500">
                      {r.source} · {who ? who.name : 'Unassigned'}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>

          {selected && cue && (
            <article key={selected.id} className="panel animate-slide-in-right p-6" aria-labelledby="review-title">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="review-title" className="font-mono text-xl text-ivory-50">{cue.id}</h2>
                <DeptBadge department={cue.department} />
                <StatusBadge status={cue.status} />
                <PriorityBadge priority={selected.priority} />
              </div>
              <p className="mt-3 text-ivory-200">{cue.instruction}</p>
              <p className="mt-1 text-sm text-ivory-400">
                <span className="text-[0.65rem] tracking-wider uppercase">Trigger · </span>
                {cue.trigger}
              </p>

              <div className="mt-5 rounded-lg border hairline bg-ink-900/60 p-4">
                <p className="text-xs font-medium text-ivory-300">Why it was flagged</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory-300">{selected.reason}</p>
                {changed && (
                  <div className="mt-3 space-y-1 font-serif text-sm">
                    <p className={selected.change === 'removed' ? 'text-curtain-300 line-through decoration-curtain-400/60' : 'text-ivory-400'}>
                      <span className="mr-2 font-sans text-[0.6rem] tracking-wider uppercase no-underline">{selected.change === 'removed' ? 'Removed' : 'Before'}</span>
                      {describeLine(changed)}
                    </p>
                    {revisedText && (
                      <p className="text-brass-200">
                        <span className="mr-2 font-sans text-[0.6rem] tracking-wider uppercase">After</span>
                        {describeLine(revisedText)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {suggested && (
                <div className="mt-3 flex flex-col gap-3 rounded-lg border border-sage-400/20 bg-sage-400/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-2 text-sm text-sage-300">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      Suggested anchor in draft 4: {describeLine(suggested)} <span className="font-mono text-xs opacity-70">({suggested.id})</span>
                    </span>
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={!can('apply') || !!alreadyMoved || selected.status === 'Resolved'}
                    onClick={() => {
                      dispatch({ type: 'APPLY_SUGGESTION', reviewId: selected.id })
                      toast(`${cue.id} now triggers on ${suggested.id}.`)
                    }}
                  >
                    {alreadyMoved ? 'Applied' : 'Use suggestion'}
                  </Button>
                </div>
              )}

              <div className="mt-6 grid gap-4 border-t hairline pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="block">
                  <span className="mb-1.5 block text-xs text-ivory-400">Assigned to</span>
                  <Select
                    className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!can('assign')}
                    value={selected.assigneeId ?? ''}
                    onChange={(e) => {
                      if (!e.target.value) return
                      dispatch({ type: 'ASSIGN', reviewId: selected.id, assigneeId: e.target.value })
                      toast(`Review assigned to ${team.find((m) => m.id === e.target.value)?.name}.`)
                    }}
                  >
                    <option value="">Unassigned</option>
                    {team.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} · {m.role}
                      </option>
                    ))}
                  </Select>
                </label>
                <Button variant="secondary" size="sm" className="h-9" disabled={!can('cues')} onClick={() => openEditor(cue)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit trigger
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selected.status === 'Resolved' ? (
                  <>
                    <p className="mr-auto self-center text-sm text-sage-300">{selected.resolution}</p>
                    <Button variant="ghost" size="sm" disabled={!can('review')} onClick={() => dispatch({ type: 'REOPEN', reviewId: selected.id })}>
                      <RotateCcw className="h-3.5 w-3.5" /> Reopen
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      disabled={!can('review')}
                      onClick={() => {
                        dispatch({ type: 'MARK_REVIEWED', reviewId: selected.id })
                        toast(`${cue.id} marked as reviewed.`)
                      }}
                    >
                      <CheckCheck className="h-4 w-4" /> Mark as reviewed
                    </Button>
                    <Button
                      disabled={!can('approve')}
                      title={can('approve') ? undefined : 'Only the production stage manager can approve revised cues'}
                      onClick={() => {
                        dispatch({ type: 'APPROVE', reviewId: selected.id })
                        toast(`Revised ${cue.id} approved.`)
                      }}
                    >
                      <ThumbsUp className="h-4 w-4" /> Approve revised cue
                    </Button>
                  </>
                )}
              </div>
              <p className="mt-5 text-xs text-ivory-500">
                Flagged {formatDateTime(selected.createdAt)} · <Link to={`/workspace/cues?q=${cue.id}`} className="underline-offset-2 hover:underline">View in cue sheet</Link>
              </p>
            </article>
          )}
        </div>
      )}
    </>
  )
}
