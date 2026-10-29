import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle2, FileUp, GitCompareArrows, ListTree } from 'lucide-react'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Section'

export const processSteps = [
  {
    icon: FileUp,
    title: 'Add a script or rehearsal transcript',
    body: 'Import the current rehearsal draft. Stagewoven keeps every line addressable so cues can point at exact moments, not page numbers.',
  },
  {
    icon: ListTree,
    title: 'Organise cues by scene and trigger',
    body: 'Lighting, sound and scene-change cues sit against the line, action or visual they are called on, grouped by scene.',
  },
  {
    icon: GitCompareArrows,
    title: 'Review changes and suggested cues',
    body: 'When a new draft lands, Stagewoven compares it with the last one and lists the cues whose triggers moved, changed or disappeared.',
  },
  {
    icon: CheckCircle2,
    title: 'Approve and export the updated cue sheet',
    body: 'Assign each flag to the right designer, approve the revised cue and export a clean cue sheet for the prompt desk.',
  },
]

export function ProcessSteps({ compact }: { compact?: boolean }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border hairline bg-ivory-50/[0.08] sm:grid-cols-2 lg:grid-cols-4">
      {processSteps.map((step, i) => (
        <li key={step.title} className="group relative bg-ink-900 p-7 transition-colors hover:bg-ink-850">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-brass-400">0{i + 1}</span>
            <step.icon className="h-5 w-5 text-ivory-500 transition-colors group-hover:text-brass-300" aria-hidden="true" />
          </div>
          <h3 className="mt-10 font-serif text-xl leading-snug text-ivory-50">{step.title}</h3>
          {!compact && <p className="mt-3 text-sm leading-relaxed text-ivory-400">{step.body}</p>}
        </li>
      ))}
    </ol>
  )
}

export function FeatureCard({ icon, title, children, tag }: { icon: ReactNode; title: string; children: ReactNode; tag?: ReactNode }) {
  return (
    <div className="group relative rounded-2xl border hairline bg-ink-900/70 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-ivory-50/15 hover:bg-ink-850">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border hairline bg-ink-800 text-brass-300">{icon}</div>
        {tag}
      </div>
      <h3 className="mt-6 font-serif text-[1.35rem] leading-snug text-ivory-50">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-ivory-400">{children}</div>
    </div>
  )
}

export function CtaBand({ title = 'Make every revision easier to manage.', body }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t hairline">
      <div className="absolute inset-0 bg-[radial-gradient(45%_70%_at_50%_100%,rgb(230_162_63/0.16),transparent_70%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-brass-400/50 to-transparent" aria-hidden="true" />
      <Container className="relative py-24 text-center sm:py-32">
        <p className="eyebrow">Ready when the next draft is</p>
        <h2 id="cta-title" className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-[1.05] font-light tracking-tight text-ivory-50 sm:text-6xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ivory-300">
          {body ?? 'Walk through a real revision on “The Last Train”, or talk to us about your next production.'}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to="/workspace" size="lg">
            Explore the Workspace <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink to="/contact?type=demo" variant="secondary" size="lg">
            Request a guided demo
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}

export function AvailabilityTag({ kind }: { kind: 'live' | 'integration' | 'future' }) {
  const map = {
    live: { label: 'In the demo', cls: 'border-sage-400/25 bg-sage-400/10 text-sage-300' },
    integration: { label: 'Needs integration', cls: 'border-steel-400/25 bg-steel-400/10 text-steel-300' },
    future: { label: 'Planned', cls: 'border-brass-400/25 bg-brass-400/10 text-brass-300' },
  }[kind]
  return <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] tracking-wider uppercase ${map.cls}`}>{map.label}</span>
}
