import { ArrowRight, GitCompareArrows } from 'lucide-react'
import { cn } from '../../lib/cn'
import { diffRevisions } from '../../workspace/compare'
import { revisions } from '../../workspace/seed'
import { DeptBadge, PriorityBadge } from '../../workspace/ui'

const rows = diffRevisions(revisions[0], revisions[1]).filter((r) => {
  const line = r.kind === 'added' ? r.right : r.left
  return line.sceneId === 's2' && ['L2-04', 'L2-05', 'L2-06', 'L2-06a', 'L2-07', 'L2-08'].includes(line.id)
})

export function ChangeDetectionPreview() {
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b hairline px-5 py-3.5">
        <p className="flex items-center gap-2 text-sm text-ivory-100">
          <GitCompareArrows className="h-4 w-4 text-brass-400" /> Scene 2 · draft 3 compared with draft 4
        </p>
        <span className="font-mono text-[0.65rem] tracking-wider text-ivory-500 uppercase">1 removed · 1 reworded · 1 added</span>
      </div>
      <div className="grid grid-cols-2 border-b hairline text-[0.65rem] tracking-[0.14em] text-ivory-500 uppercase">
        <p className="border-r hairline px-5 py-2">Draft 3</p>
        <p className="px-5 py-2">Draft 4</p>
      </div>
      <div className="font-serif text-[0.85rem]">
        {rows.map((row, i) => {
          const left = row.kind !== 'added' ? row.left : null
          const right = row.kind !== 'removed' ? row.right : null
          return (
            <div key={i} className="grid grid-cols-2">
              <Cell line={left} tone={row.kind === 'removed' ? 'removed' : row.kind === 'modified' ? 'modified' : 'plain'} />
              <Cell line={right} tone={row.kind === 'added' ? 'added' : row.kind === 'modified' ? 'modified' : 'plain'} border />
            </div>
          )
        })}
      </div>
      <div className="grid gap-3 border-t hairline bg-ink-950/50 p-5 sm:grid-cols-2">
        <Flag id="SND-014" dept="Sound" priority="High" text="Trigger line removed. Play the arriving train sound effect." />
        <Flag id="LX-022" dept="Lighting" priority="Medium" text="Trigger line reworded. Check the call still lands on “Tonight”." />
      </div>
    </div>
  )
}

function Cell({ line, tone, border }: { line: { id: string; character?: string; text: string; kind: string } | null; tone: 'removed' | 'added' | 'modified' | 'plain'; border?: boolean }) {
  return (
    <div
      className={cn(
        'min-h-12 px-5 py-2.5 leading-snug',
        border && 'border-l hairline',
        tone === 'removed' && line && 'bg-curtain-500/[0.12] text-curtain-300 line-through decoration-curtain-400/60',
        tone === 'added' && line && 'bg-sage-400/[0.08] text-sage-300',
        tone === 'modified' && 'bg-brass-400/[0.06] text-brass-200',
        tone === 'plain' && 'text-ivory-300',
        !line && 'bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,rgb(246_241_231/0.025)_6px,rgb(246_241_231/0.025)_12px)]',
      )}
    >
      {line &&
        (line.kind === 'dialogue' ? (
          <>
            <span className="mr-1.5 font-sans text-[0.62rem] tracking-wider no-underline opacity-70">{line.character}</span>
            {line.text}
          </>
        ) : (
          <span className="italic">{line.text}</span>
        ))}
    </div>
  )
}

function Flag({ id, dept, priority, text }: { id: string; dept: 'Sound' | 'Lighting'; priority: 'High' | 'Medium'; text: string }) {
  return (
    <div className="rounded-lg border hairline bg-ink-850 p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-ivory-50">{id}</span>
        <DeptBadge department={dept} />
        <PriorityBadge priority={priority} />
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-[0.78rem] leading-relaxed text-ivory-300">
        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-ivory-500" /> {text}
      </p>
    </div>
  )
}
