import { AlertTriangle, FileText, ListChecks } from 'lucide-react'
import { cn } from '../../lib/cn'
import { revisions, scenes, seedCues } from '../../workspace/seed'
import { deptStyle, StatusBadge } from '../../workspace/ui'

const scriptLines = revisions[0].lines.filter((l) => l.sceneId === 's2' && l.kind !== 'heading').slice(0, 7)
const sceneCues = seedCues.filter((c) => c.sceneId === 's2').slice(0, 6)
const FLAGGED = 'SND-014'

export function HeroPreview() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-x-10 -top-16 -bottom-10 bg-[radial-gradient(50%_50%_at_50%_30%,rgb(230_162_63/0.12),transparent_70%)]" />
      <div
        role="img"
        aria-label="Stagewoven workspace preview: the Scene 2 script beside its lighting and sound cues, a scene timeline, and sound cue SND-014 flagged for review because its trigger line was removed."
        className="panel relative overflow-hidden rounded-2xl bg-ink-900/90 backdrop-blur"
      >
        {/* window bar */}
        <div className="flex items-center justify-between border-b hairline px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-ivory-50/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-ivory-50/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-ivory-50/15" />
            </div>
            <p className="text-[0.72rem] text-ivory-300">
              <span className="text-ivory-50">The Last Train</span>
              <span className="mx-1.5 text-ivory-600">/</span>Scene 2 — Platform Four
            </p>
          </div>
          <span className="hidden rounded-full border hairline px-2 py-0.5 font-mono text-[0.62rem] text-ivory-400 sm:inline">Draft 3 → Draft 4</span>
        </div>

        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* script */}
          <div className="hidden border-r hairline p-5 md:block">
            <p className="mb-4 flex items-center gap-2 text-[0.68rem] tracking-[0.14em] text-ivory-500 uppercase">
              <FileText className="h-3.5 w-3.5" /> Script
            </p>
            <div className="space-y-2.5 font-serif text-[0.82rem] leading-snug">
              {scriptLines.map((line) => {
                const removed = line.id === 'L2-06'
                return (
                  <div
                    key={line.id}
                    className={cn(
                      'relative rounded-md px-2.5 py-1.5',
                      removed && 'animate-flag border border-curtain-400/40 bg-curtain-500/10',
                    )}
                  >
                    <span className="absolute top-1.5 -left-1 font-mono text-[0.55rem] text-ivory-600">{line.id.slice(3)}</span>
                    {line.kind === 'dialogue' ? (
                      <p className="pl-4">
                        <span className="font-sans text-[0.62rem] tracking-wider text-ivory-400">{line.character}</span>
                        <br />
                        <span className={cn('text-ivory-100', removed && 'text-curtain-300 line-through decoration-curtain-400/70')}>{line.text}</span>
                      </p>
                    ) : (
                      <p className="pl-4 text-ivory-400 italic">{line.text}</p>
                    )}
                    {removed && (
                      <span className="absolute top-1.5 right-2 rounded bg-curtain-500/80 px-1.5 py-px font-sans text-[0.55rem] font-medium tracking-wider text-ivory-50 uppercase">
                        Cut in draft 4
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* cues */}
          <div className="p-4 sm:p-5">
            <p className="mb-4 flex items-center gap-2 text-[0.68rem] tracking-[0.14em] text-ivory-500 uppercase">
              <ListChecks className="h-3.5 w-3.5" /> Cues · Scene 2
            </p>
            <ul className="space-y-1.5">
              {sceneCues.map((cue) => {
                const flagged = cue.id === FLAGGED
                const s = deptStyle[cue.department]
                return (
                  <li
                    key={cue.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors',
                      flagged ? 'border-curtain-400/40 bg-curtain-500/[0.08]' : 'border-transparent bg-ivory-50/[0.025]',
                    )}
                  >
                    <span className={cn('h-6 w-0.5 rounded-full', s.dot)} />
                    <span className={cn('w-14 shrink-0 font-mono text-[0.7rem]', s.text)}>{cue.id}</span>
                    <span className="min-w-0 flex-1 truncate text-[0.75rem] text-ivory-200">{cue.instruction}</span>
                    <StatusBadge status={flagged ? 'Needs Review' : cue.status} className="hidden sm:inline-flex" />
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 rounded-lg border border-curtain-400/30 bg-ink-950/60 p-3.5">
              <p className="flex items-center gap-2 text-[0.72rem] font-medium text-curtain-300">
                <AlertTriangle className="h-3.5 w-3.5" /> SND-014 may need another look
              </p>
              <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ivory-300">
                Its trigger, “The train has arrived.”, was removed in draft 4. Suggested new anchor: Elias steps towards the edge.
              </p>
            </div>
          </div>
        </div>

        {/* timeline */}
        <div className="border-t hairline px-4 py-4 sm:px-5">
          <div className="flex items-center gap-1.5">
            {scenes.map((scene) => {
              const cues = seedCues.filter((c) => c.sceneId === scene.id)
              return (
                <div key={scene.id} className="flex-1">
                  <p className={cn('mb-2 truncate text-[0.62rem] tracking-wider uppercase', scene.id === 's2' ? 'text-brass-300' : 'text-ivory-500')}>
                    {scene.number}. {scene.title}
                  </p>
                  <div className={cn('relative h-7 rounded-md border', scene.id === 's2' ? 'border-brass-400/30 bg-brass-400/[0.05]' : 'hairline bg-ivory-50/[0.02]')}>
                    {cues.map((c, i) => (
                      <span
                        key={c.id}
                        title={c.id}
                        className={cn(
                          'absolute top-1.5 h-4 w-[3px] rounded-full',
                          c.id === FLAGGED ? 'bg-curtain-400 ring-2 ring-curtain-400/30' : deptStyle[c.department].dot,
                        )}
                        style={{ left: `${8 + (i / Math.max(cues.length - 1, 1)) * 84}%` }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
