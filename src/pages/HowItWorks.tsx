import { ArrowRight, Check } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { ButtonLink } from '../components/ui/Button'
import { PageHero, Section } from '../components/ui/Section'
import { CtaBand, processSteps } from '../components/marketing/Blocks'
import { StageScene, type SceneVariant } from '../components/ui/StageScene'

const detail: Array<{ points: string[]; scene: SceneVariant; alt: string; example: string }> = [
  {
    scene: 'script',
    alt: 'A rehearsal script on a desk with a highlighted line and cue mark.',
    example: 'Northlight imports rehearsal draft 3 of “The Last Train”: three scenes, 26 numbered lines.',
    points: ['Import scripts as text or structured documents', 'Scenes and lines are numbered automatically, and stay stable across drafts', 'Rehearsal transcripts can be attached when a transcription service is connected'],
  },
  {
    scene: 'rig',
    alt: 'Stage lighting fixtures on a truss, beams cutting through haze.',
    example: 'Priya anchors LX-021 to Elias’s line “The train has arrived.” Tomás anchors SND-014 to the same line.',
    points: ['Choose a trigger type: line, action, visual moment or follow', 'Group and filter cues by department, scene and status', 'Record instructions in the language each department already uses'],
  },
  {
    scene: 'stage',
    alt: 'A figure on a station platform set under a single spotlight.',
    example: 'Draft 4 cuts the line. Stagewoven flags SND-014 and LX-021 as high priority and LX-022 as medium, then suggests the new stage direction as an anchor.',
    points: ['Side-by-side comparison of any two drafts', 'Each flag carries a priority and a plain-language reason', 'Suggested anchors are offered, never applied automatically'],
  },
  {
    scene: 'ghostlight',
    alt: 'An empty theatre at night lit by a single ghost light.',
    example: 'Daniel, the show caller, reviews the suggestions. Tomás approves the revised SND-014. The updated cue sheet goes to the prompt desk.',
    points: ['Assign reviews to designers, the show caller or the stage manager', 'Mark as reviewed, edit the trigger or approve the revised cue', 'Export department cue sheets once everything is signed off'],
  },
]

export default function HowItWorks() {
  useDocumentMeta('How It Works', 'Add a script, organise cues by scene and trigger, review changes and suggested cues, then approve and export the updated cue sheet.', '/how-it-works')

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="From a new draft to a signed-off cue sheet, in four steps."
        intro="Follow one revision of “The Last Train” through Stagewoven, from the moment a line is cut in rehearsal to the updated cue sheet on the prompt desk."
      >
        <ButtonLink to="/workspace/scripts" size="lg">
          Try the revision in the workspace <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </PageHero>

      <Section labelledBy="steps-title">
        <h2 id="steps-title" className="sr-only">The four steps</h2>
        <ol className="space-y-24">
          {processSteps.map((step, i) => {
            const d = detail[i]
            return (
              <li key={step.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div className={i % 2 ? 'lg:order-2' : ''}>
                  <p className="flex items-center gap-3 font-mono text-xs text-brass-400">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass-400/40">0{i + 1}</span>
                    Step {i + 1} of 4
                  </p>
                  <h3 className="mt-6 font-serif text-3xl leading-tight text-ivory-50 sm:text-4xl">{step.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-ivory-300">{step.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {d.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-ivory-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-400" aria-hidden="true" /> {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-7 border-l-2 border-brass-400/50 pl-4 font-serif text-[1.05rem] text-ivory-200 italic">{d.example}</p>
                </div>
                <StageScene variant={d.scene} alt={d.alt} className="aspect-[4/3]" caption={`Step ${i + 1}`} />
              </li>
            )
          })}
        </ol>
      </Section>

      <CtaBand title="Try the revision on “The Last Train”." body="The workspace runs entirely in your browser with sample data. Press “Compare Revisions” and follow the flags." />
    </>
  )
}
