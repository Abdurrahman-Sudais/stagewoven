import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowRight, FileText, GitCompareArrows, Loader2, MapPin, RotateCcw } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/ui/Button'
import { useWorkspace } from '../store'
import { revisions, scenes } from '../seed'
import { describeLine, diffRevisions, findAffectedCues, type CueFinding, type DiffRow } from '../compare'
import type { ScriptLine } from '../types'
import { DeptBadge, deptStyle, formatDateTime, PriorityBadge, SimulatedNotice, ViewHeader } from '../ui'

const [original, revised] = revisions
const diffRows = diffRevisions(original, revised)

export default function Scripts() {
  const { state, dispatch } = useWorkspace()
  const [params, setParams] = useSearchParams()
  const [revId, setRevId] = useState(revised.id)
  const [sceneId, setSceneId] = useState('s2')
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')
  const [findings, setFindings] = useState<CueFinding[]>([])
  const resultsRef = useRef<HTMLDivElement>(null)
  const autoRan = useRef(false)

  const revision = revisions.find((r) => r.id === revId)!
  const lines = revision.lines.filter((l) => l.sceneId === sceneId)

  function runComparison() {
    setPhase('running')
    window.setTimeout(() => {
      const found = findAffectedCues(diffRows, state.cues)
      setFindings(found)
      dispatch({ type: 'RUN_COMPARISON', findings: found })
      setPhase('done')
      window.setTimeout(() => resultsRef.current?.focus(), 50)
    }, 900)
  }

  useEffect(() => {
    if (params.get('compare') === '1' && !autoRan.current) {
      autoRan.current = true
      setParams({}, { replace: true })
      runComparison()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ViewHeader
        title="Scripts"
        description="Rehearsal drafts for The Last Train. Lines keep stable references across drafts, so cues can be checked when the words change."
        actions={
          <Button onClick={runComparison} disabled={phase === 'running'}>
            {phase === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompareArrows className="h-4 w-4" />}
            {phase === 'running' ? 'Comparing…' : phase === 'done' ? 'Compare again' : 'Compare Revisions'}
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {revisions.map((r) => (
          <button
            key={r.id}
            onClick={() => setRevId(r.id)}
            aria-pressed={revId === r.id}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              revId === r.id ? 'border-brass-400/40 bg-brass-400/[0.06]' : 'hairline bg-ink-900/60 hover:border-ivory-50/15',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm text-ivory-50">
                <FileText className="h-4 w-4 text-ivory-400" aria-hidden="true" /> {r.label}
              </p>
              <span className="font-mono text-[0.68rem] text-ivory-500">{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ivory-400">{r.note}</p>
          </button>
        ))}
      </div>

      {phase === 'running' && (
        <div role="status" className="panel mt-6 p-6">
          <p className="flex items-center gap-2 text-sm text-ivory-200">
            <Loader2 className="h-4 w-4 animate-spin text-brass-400" /> Comparing {original.label} with {revised.label}…
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-ivory-50/[0.05]" style={{ width: `${60 + ((i * 17) % 35)}%` }} />
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div ref={resultsRef} tabIndex={-1} className="mt-6 animate-fade-up outline-none" aria-label="Comparison results">
          <ComparisonResults findings={findings} />
        </div>
      )}

      {phase === 'idle' && state.comparedAt && (
        <p className="mt-4 text-xs text-ivory-500">Last compared {formatDateTime(state.comparedAt)}. Flags from that comparison are in the review queue.</p>
      )}

      <section className="panel mt-6 overflow-hidden" aria-labelledby="reader-title">
        <div className="flex flex-col gap-3 border-b hairline px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="reader-title" className="text-sm text-ivory-100">
            {revision.label} · cue markers
          </h2>
          <div role="tablist" aria-label="Scene" className="flex gap-1">
            {scenes.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={sceneId === s.id}
                onClick={() => setSceneId(s.id)}
                className={cn('rounded-md px-3 py-1.5 text-xs transition-colors', sceneId === s.id ? 'bg-ivory-50/10 text-ivory-50' : 'text-ivory-400 hover:text-ivory-100')}
              >
                Scene {s.number}
              </button>
            ))}
          </div>
        </div>
        <ScriptReader lines={lines} />
      </section>
    </>
  )
}

function ScriptReader({ lines }: { lines: ScriptLine[] }) {
  const { state } = useWorkspace()
  return (
    <ol className="divide-y divide-ivory-50/[0.04]">
      {lines.map((line) => {
        const cues = state.cues.filter((c) => c.lineRef === line.id)
        return (
          <li key={line.id} className="grid grid-cols-[3.5rem_1fr] gap-2 px-5 py-3 sm:grid-cols-[3.5rem_1fr_13rem]">
            <span className="pt-0.5 font-mono text-[0.68rem] text-ivory-600">{line.id}</span>
            <div className="font-serif text-[0.95rem] leading-relaxed">
              {line.kind === 'heading' && <p className="font-sans text-xs tracking-[0.16em] text-ivory-300">{line.text}</p>}
              {line.kind === 'direction' && <p className="text-ivory-400 italic">{line.text}</p>}
              {line.kind === 'dialogue' && (
                <p className="text-ivory-100">
                  <span className="mr-2 font-sans text-[0.68rem] tracking-wider text-ivory-400">{line.character}</span>
                  {line.text}
                </p>
              )}
            </div>
            <div className="col-start-2 flex flex-wrap gap-1.5 sm:col-start-3 sm:justify-end">
              {cues.map((c) => (
                <Link
                  key={c.id}
                  to={`/workspace/cues?q=${c.id}`}
                  className={cn(
                    'rounded-md border px-1.5 py-0.5 font-mono text-[0.66rem] transition-colors hover:bg-ivory-50/5',
                    c.status === 'Needs Review' ? 'border-curtain-400/50 text-curtain-300' : cn('border-ivory-50/10', deptStyle[c.department].text),
                  )}
                  title={c.instruction}
                >
                  {c.id}
                </Link>
              ))}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function ComparisonResults({ findings }: { findings: CueFinding[] }) {
  const changedScenes = useMemo(() => {
    const ids = new Set<string>()
    diffRows.forEach((r) => {
      if (r.kind !== 'same') ids.add(r.kind === 'added' ? r.right.sceneId : r.left.sceneId)
    })
    return scenes.filter((s) => ids.has(s.id))
  }, [])
  const counts = {
    removed: diffRows.filter((r) => r.kind === 'removed').length,
    modified: diffRows.filter((r) => r.kind === 'modified').length,
    added: diffRows.filter((r) => r.kind === 'added').length,
  }

  return (
    <div className="space-y-4">
      <SimulatedNotice />
      <section className="panel overflow-hidden" aria-labelledby="diff-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-5 py-3.5">
          <h2 id="diff-title" className="flex items-center gap-2 text-sm text-ivory-50">
            <GitCompareArrows className="h-4 w-4 text-brass-400" aria-hidden="true" /> {original.label} → {revised.label}
          </h2>
          <ul className="flex gap-3 font-mono text-[0.68rem] tracking-wide uppercase">
            <li className="text-curtain-300">{counts.removed} removed</li>
            <li className="text-brass-300">{counts.modified} reworded</li>
            <li className="text-sage-300">{counts.added} added</li>
          </ul>
        </div>
        {changedScenes.map((scene) => (
          <div key={scene.id}>
            <p className="border-b hairline bg-ink-900/60 px-5 py-2 text-xs text-ivory-300">
              Scene {scene.number} — {scene.title}
            </p>
            <div className="grid grid-cols-2 border-b hairline text-[0.65rem] tracking-[0.14em] text-ivory-500 uppercase">
              <p className="px-5 py-2">{original.label}</p>
              <p className="border-l hairline px-5 py-2">{revised.label}</p>
            </div>
            {diffRows
              .filter((r) => (r.kind === 'added' ? r.right : r.left).sceneId === scene.id && (r.kind === 'added' ? r.right : r.left).kind !== 'heading')
              .map((row, i) => (
                <DiffLine key={i} row={row} />
              ))}
          </div>
        ))}
      </section>

      <section aria-labelledby="findings-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 id="findings-title" className="flex items-center gap-2 text-sm text-ivory-50">
            <AlertTriangle className="h-4 w-4 text-curtain-300" aria-hidden="true" />
            {findings.length ? `${findings.length} cue${findings.length > 1 ? 's' : ''} may be affected` : 'No cues are anchored to changed lines'}
          </h2>
          {findings.length > 0 && (
            <Link to="/workspace/review" className="inline-flex items-center gap-1.5 text-sm text-brass-300 hover:text-brass-200">
              Open the review queue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        {findings.length === 0 ? (
          <div className="panel flex items-center gap-3 p-5 text-sm text-ivory-300">
            <RotateCcw className="h-4 w-4 text-ivory-500" aria-hidden="true" /> Every cue tied to the changed lines has already been re-anchored. Nothing new was added to the queue.
          </div>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-3">
            {findings.map((f) => (
              <li key={f.cue.id} className={cn('panel animate-scale-in p-4', f.priority === 'High' && 'border-curtain-400/30')}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm text-ivory-50">{f.cue.id}</span>
                  <DeptBadge department={f.cue.department} />
                  <PriorityBadge priority={f.priority} />
                </div>
                <p className="mt-2 text-sm text-ivory-200">{f.cue.instruction}</p>
                <p className="mt-3 text-xs leading-relaxed text-ivory-400">
                  <span className="font-medium text-ivory-300">Why it was flagged: </span>
                  {f.reason}
                </p>
                {f.suggestedLine && (
                  <p className="mt-3 flex items-start gap-1.5 rounded-md bg-sage-400/[0.07] px-2.5 py-2 text-xs text-sage-300">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>
                      Suggested anchor: {describeLine(f.suggestedLine)} <span className="font-mono opacity-70">({f.suggestedLine.id})</span>
                    </span>
                  </p>
                )}
                <p className="mt-3 text-[0.7rem] text-ivory-500">Added to review queue · status set to Needs Review</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function DiffLine({ row }: { row: DiffRow }) {
  const left = row.kind !== 'added' ? row.left : null
  const right = row.kind !== 'removed' ? row.right : null
  const render = (line: ScriptLine | null, tone: string, label?: string, strike = false) => (
    <div
      className={cn(
        'relative min-h-11 px-5 py-2.5 font-serif text-[0.9rem] leading-snug',
        tone,
        !line && 'bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,rgb(246_241_231/0.025)_6px,rgb(246_241_231/0.025)_12px)]',
      )}
    >
      {line && (
        <>
          {label && <span className="mr-2 rounded border border-current/30 px-1 py-px font-sans text-[0.58rem] tracking-wider uppercase">{label}</span>}
          <span className={cn(strike && 'line-through decoration-curtain-400/70')}>
            {line.kind === 'dialogue' ? (
              <>
                <span className="mr-1.5 font-sans text-[0.65rem] tracking-wider opacity-70">{line.character}</span>
                {line.text}
              </>
            ) : (
              <span className="italic">{line.text}</span>
            )}
          </span>
        </>
      )}
    </div>
  )
  return (
    <div className="grid grid-cols-2 border-b border-ivory-50/[0.04] last:border-0">
      {render(
        left,
        row.kind === 'removed' ? 'animate-flag bg-curtain-500/[0.14] text-curtain-300' : row.kind === 'modified' ? 'bg-brass-400/[0.06] text-brass-200' : 'text-ivory-400',
        row.kind === 'removed' ? 'Removed' : row.kind === 'modified' ? 'Before' : undefined,
        row.kind === 'removed',
      )}
      <div className="border-l hairline">
        {render(
          right,
          row.kind === 'added' ? 'bg-sage-400/[0.08] text-sage-300' : row.kind === 'modified' ? 'bg-brass-400/[0.06] text-brass-200' : 'text-ivory-400',
          row.kind === 'added' ? 'Added' : row.kind === 'modified' ? 'After' : undefined,
        )}
      </div>
    </div>
  )
}
