import { Building2, ClipboardList, Lightbulb, Route } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { PageHero, Section } from '../components/ui/Section'
import { CtaBand } from '../components/marketing/Blocks'
import { StageScene, type SceneVariant } from '../components/ui/StageScene'

const cases: Array<{
  id: string
  icon: typeof ClipboardList
  eyebrow: string
  title: string
  body: string
  scenario: string
  outcomes: string[]
  scene: SceneVariant
  alt: string
}> = [
  {
    id: 'stage-managers',
    icon: ClipboardList,
    eyebrow: 'Stage managers & show callers',
    title: 'Walk into the tech knowing what changed.',
    body: 'Rehearsal rewrites arrive late and in pieces. Stagewoven compares each draft with the last and gives the stage manager one list of cues that need a decision.',
    scenario: 'A two-line cut on Monday evening flags three cues. By Tuesday’s afternoon session each one has an owner, and two are approved.',
    outcomes: ['One review list instead of four email threads', 'Every call anchored to the current words', 'A record of who approved each change'],
    scene: 'script',
    alt: 'A marked-up prompt book with a highlighted line.',
  },
  {
    id: 'designers',
    icon: Lightbulb,
    eyebrow: 'Lighting & sound designers',
    title: 'Keep design intent attached to the moment.',
    body: 'Designers write cue intent once, against the line or action it belongs to. When that moment moves, they are told, with the reason and a suggested new anchor.',
    scenario: 'The sound designer sees SND-014 lost its trigger, accepts the suggested stage direction as the new anchor and approves the cue in one pass.',
    outcomes: ['Department-filtered cue sheets', 'Flags routed to the designer who owns the cue', 'Notes kept beside the cue, not in a separate file'],
    scene: 'rig',
    alt: 'Lighting fixtures on a truss throwing beams through haze.',
  },
  {
    id: 'touring',
    icon: Route,
    eyebrow: 'Touring productions',
    title: 'Carry one current cue sheet between venues.',
    body: 'Touring shows are rewritten for new spaces and new casts. Stagewoven keeps each version of the script and cue sheet, and shows exactly what differs between them.',
    scenario: 'Week three of a tour: a cast change trims a scene. The resident stage manager compares the tour script with the new cut before the get-in.',
    outcomes: ['Version history across venues', 'Cue sheets exported for each local crew', 'Change summaries for the company manager'],
    scene: 'stage',
    alt: 'A station platform set under a warm spotlight framed by curtains.',
  },
  {
    id: 'companies',
    icon: Building2,
    eyebrow: 'Production companies & venues',
    title: 'See review progress across every production.',
    body: 'Production coordinators get a single view of each show’s cue readiness, without asking each department for an update.',
    scenario: 'With two shows in tech and one on tour, the production office sees open reviews by show, department and owner each morning.',
    outcomes: ['Organisation-wide cue conventions', 'Shared templates for new productions', 'Review status across shows at a glance'],
    scene: 'ghostlight',
    alt: 'A dark stage lit by a ghost light, a ladder and flats in the wings.',
  },
]

export default function UseCases() {
  useDocumentMeta('Use Cases', 'How stage managers, designers, touring productions and production companies use Stagewoven to keep cues in step with script changes.', '/use-cases')

  return (
    <>
      <PageHero
        eyebrow="Use cases"
        title="One production, seen from every seat in the building."
        intro="Stagewoven is shaped around the way theatre teams already work: the prompt book, the production meeting and the note session."
      >
        <nav aria-label="Use cases">
          <ul className="flex flex-wrap gap-2">
            {cases.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm text-ivory-200 transition-colors hover:border-ivory-50/25 hover:text-ivory-50">
                  <c.icon className="h-4 w-4 text-brass-400" aria-hidden="true" /> {c.eyebrow}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {cases.map((c, i) => (
        <Section key={c.id} id={c.id} labelledBy={`${c.id}-title`} className={`scroll-mt-16 ${i ? 'border-t hairline' : ''} ${i % 2 ? 'bg-ink-900/30' : ''}`}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className={i % 2 ? 'lg:order-2' : ''}>
              <p className="eyebrow">{c.eyebrow}</p>
              <h2 id={`${c.id}-title`} className="mt-4 font-serif text-4xl leading-tight font-light text-ivory-50 sm:text-5xl">
                {c.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ivory-300">{c.body}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {c.outcomes.map((o) => (
                  <li key={o} className="rounded-xl border hairline bg-ink-900/60 p-4 text-sm leading-snug text-ivory-200">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <StageScene variant={c.scene} alt={c.alt} className="aspect-[4/3]" />
              <blockquote className="mt-5 border-l-2 border-brass-400/50 pl-4">
                <p className="font-serif text-lg text-ivory-200 italic">{c.scenario}</p>
                <footer className="mt-2 font-mono text-[0.65rem] tracking-[0.14em] text-ivory-500 uppercase">Illustrative scenario</footer>
              </blockquote>
            </div>
          </div>
        </Section>
      ))}

      <CtaBand />
    </>
  )
}
