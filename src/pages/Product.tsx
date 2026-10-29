import { ArrowRight, Ban, FileDown, FileText, GitCompareArrows, Link2, MapPin, Mic, UserCheck, Users } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { ButtonLink } from '../components/ui/Button'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import { AvailabilityTag, CtaBand, FeatureCard } from '../components/marketing/Blocks'
import { ChangeDetectionPreview } from '../components/marketing/ChangeDetectionPreview'

const features = [
  {
    icon: FileText,
    title: 'Script and transcript organisation',
    kind: 'live' as const,
    body: 'Keep every rehearsal draft in one place, split into scenes and numbered lines. Transcripts imported from your own tools sit alongside the drafts they relate to.',
  },
  {
    icon: Link2,
    title: 'Cue-to-script references',
    kind: 'live' as const,
    body: 'Anchor each cue to a line, a stage direction, a visual moment or a follow. The reference travels with the cue into every export.',
  },
  {
    icon: GitCompareArrows,
    title: 'Script revision comparison',
    kind: 'live' as const,
    body: 'Compare any two drafts side by side. Removed, reworded and added lines are marked, and the cues that depend on them are listed with a reason.',
  },
  {
    icon: MapPin,
    title: 'Suggested cue locations',
    kind: 'live' as const,
    body: 'When a trigger line is cut, Stagewoven proposes the nearest moment in the new draft. A person always accepts or rejects the suggestion.',
  },
  {
    icon: Mic,
    title: 'AI-assisted rehearsal transcription',
    kind: 'integration' as const,
    body: 'Turn rehearsal recordings into searchable transcripts and compare them with the script. Requires a connected speech-to-text provider and is not part of the public demo.',
  },
  {
    icon: UserCheck,
    title: 'Cue review workflows',
    kind: 'live' as const,
    body: 'Flagged cues enter a review queue with a priority, an owner and a status. Approvals are recorded with who signed off and when.',
  },
  {
    icon: Users,
    title: 'Departmental collaboration',
    kind: 'live' as const,
    body: 'Lighting, sound and stage teams work on one production, each filtered to their own cues, with shared notes on the moments they share.',
  },
  {
    icon: FileDown,
    title: 'Cue-sheet exports',
    kind: 'live' as const,
    body: 'Produce department cue sheets for the prompt desk and touring file. The demo exports CSV; formatted PDF export is planned for the production release.',
  },
]

export default function Product() {
  useDocumentMeta('Product', 'Script organisation, cue-to-script references, revision comparison, suggested cue locations, review workflows and cue-sheet exports for theatre production teams.', '/product')

  return (
    <>
      <PageHero
        eyebrow="Product"
        title={
          <>
            Production paperwork that <em className="text-brass-300">notices</em> when the script moves.
          </>
        }
        intro="Stagewoven is a planning and review workspace for cues. It keeps your script, your cue sheets and your revisions linked, so the effect of a change is visible before the next rehearsal."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/workspace" size="lg">
            Explore the Workspace <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink to="/pricing" variant="secondary" size="lg">
            View pricing
          </ButtonLink>
        </div>
      </PageHero>

      <Section labelledBy="features-title">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader id="features-title" eyebrow="Capabilities" title="What Stagewoven does today, and what depends on integrations." />
          <ul className="flex flex-wrap gap-3 text-xs text-ivory-400" aria-label="Legend">
            <li className="flex items-center gap-2"><AvailabilityTag kind="live" /> Shown in the interactive demo</li>
            <li className="flex items-center gap-2"><AvailabilityTag kind="integration" /> Requires an external service</li>
          </ul>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={<f.icon className="h-5 w-5" />} title={f.title} tag={<AvailabilityTag kind={f.kind} />}>
              {f.body}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section labelledBy="compare-title" className="border-t hairline bg-ink-900/30">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader
            id="compare-title"
            eyebrow="Revision comparison in practice"
            title="Draft 4 cut one line. Two cues depended on it."
            intro="In “The Last Train”, the director cut Elias’s line “The train has arrived.” so the arrival plays in silence. Sound cue SND-014 and lighting cue LX-021 were both called on that line. Stagewoven flags both, explains why, and suggests calling them on Elias’s new move towards the platform edge."
          />
          <ChangeDetectionPreview />
        </div>
      </Section>

      <Section labelledBy="boundaries-title" className="border-t hairline">
        <div className="grid gap-10 rounded-2xl border hairline bg-ink-900/60 p-8 sm:p-12 lg:grid-cols-[auto_1fr]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-curtain-400/30 bg-curtain-500/10 text-curtain-300">
            <Ban className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="boundaries-title" className="font-serif text-3xl text-ivory-50">What Stagewoven does not do</h2>
            <div className="mt-5 grid gap-6 text-sm leading-relaxed text-ivory-400 md:grid-cols-3">
              <p>
                <strong className="block font-medium text-ivory-100">It does not run the show.</strong>
                Stagewoven does not connect to or control lighting desks, sound consoles, automation or any live performance equipment. Cues are still programmed and fired by your operators.
              </p>
              <p>
                <strong className="block font-medium text-ivory-100">It does not make artistic decisions.</strong>
                Flags and suggested locations are prompts for the creative team. Nothing changes on a cue sheet without a person approving it.
              </p>
              <p>
                <strong className="block font-medium text-ivory-100">It does not replace the prompt book.</strong>
                It keeps the prompt book’s cue information current and exportable. Your stage management practice stays yours.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
