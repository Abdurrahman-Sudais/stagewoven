import { ArrowRight, FileStack, FileText, GitCompareArrows, ListChecks, MessagesSquare, Share2, Unlink, UserCheck } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { ButtonLink } from '../components/ui/Button'
import { Container, Section, SectionHeader } from '../components/ui/Section'
import { StageScene } from '../components/ui/StageScene'
import { HeroPreview } from '../components/marketing/HeroPreview'
import { ChangeDetectionPreview } from '../components/marketing/ChangeDetectionPreview'
import { DashboardPreview } from '../components/marketing/DashboardPreview'
import { CtaBand, FeatureCard, ProcessSteps } from '../components/marketing/Blocks'
import { roles } from '../data/roles'

const fragments = [
  { icon: FileText, label: 'Rehearsal draft 4', note: 'Emailed Monday, 23:10' },
  { icon: MessagesSquare, label: 'Rehearsal notes', note: 'Shared document, 6 editors' },
  { icon: ListChecks, label: 'LX cue sheet v7', note: 'Designer’s laptop' },
  { icon: FileStack, label: 'Sound cue list', note: 'Spreadsheet, last week' },
]

const workspaceFeatures = [
  { icon: <FileText className="h-5 w-5" />, title: 'Script management', body: 'Every draft kept with line-level references, so a cue points to a moment, not a page that has since moved.' },
  { icon: <ListChecks className="h-5 w-5" />, title: 'Cue planning', body: 'Lighting, sound and scene-change cues in one sheet, filterable by department, scene and status.' },
  { icon: <GitCompareArrows className="h-5 w-5" />, title: 'Revision tracking', body: 'Compare any two drafts side by side and see which cues sit on lines that were cut, moved or reworded.' },
  { icon: <UserCheck className="h-5 w-5" />, title: 'Review assignments', body: 'Route each flagged cue to the right designer with a priority, a reason and a record of who signed it off.' },
  { icon: <Share2 className="h-5 w-5" />, title: 'Exports', body: 'Clean, department-specific cue sheets for the prompt desk, production meetings and the touring file.' },
]

export default function Home() {
  useDocumentMeta('', 'Plan lighting, sound and scene-change cues in one workspace. When scripts and rehearsals change, Stagewoven helps your team find the cues that may need another look.', '/')

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="stage-light relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 h-[520px] w-[900px] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_160deg,rgb(246_217_168/0.06)_180deg,transparent_200deg)]" />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <div>
            <p className="eyebrow mb-6 animate-fade-up">Every cue. Every change. In sync.</p>
            <h1 id="hero-title" className="animate-fade-up font-serif text-[2.9rem] leading-[1.02] font-light tracking-tight text-ivory-50 [animation-delay:60ms] sm:text-6xl xl:text-7xl">
              Keep every cue in <em className="text-brass-300">step</em> with the show.
            </h1>
            <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-ivory-300 [animation-delay:120ms]">
              Plan lighting, sound, and scene changes in one workspace. When scripts and rehearsals change, Stagewoven helps your team find the cues that may need another look.
            </p>
            <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:180ms] sm:flex-row">
              <ButtonLink to="/workspace" size="lg">
                Explore the Workspace <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink to="/how-it-works" variant="secondary" size="lg">
                See How It Works
              </ButtonLink>
            </div>
            <p className="mt-6 animate-fade-up text-xs text-ivory-500 [animation-delay:240ms]">Interactive demo with sample data. No sign-up needed.</p>
          </div>
          <div className="animate-fade-up [animation-delay:200ms]">
            <HeroPreview />
          </div>
        </Container>
      </section>

      {/* A. Problem */}
      <Section labelledBy="problem-title" className="border-t hairline">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader
              id="problem-title"
              eyebrow="The production coordination problem"
              title="A line is cut at 6 p.m. Three departments find out at the half."
              intro="Scripts change in rehearsal. Notes go into one document, cue sheets live in another, and each department keeps its own copy. Nobody is careless; the information simply travels by too many routes."
            />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {fragments.map((f) => (
                <li key={f.label} className="flex items-start gap-3 rounded-xl border hairline bg-ink-900/60 p-4">
                  <f.icon className="mt-0.5 h-4 w-4 text-ivory-500" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-ivory-100">{f.label}</p>
                    <p className="text-xs text-ivory-500">{f.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-curtain-300">
              <Unlink className="h-4 w-4" aria-hidden="true" /> Four copies of the truth, none of them linked.
            </p>
          </div>
          <div className="grid grid-rows-[1.3fr_1fr] gap-4">
            <StageScene variant="script" alt="A marked-up rehearsal script under a desk lamp, one line highlighted with a cue mark in the margin." caption="Prompt book, rehearsal week 3" className="min-h-[260px]" />
            <div className="grid grid-cols-2 gap-4">
              <StageScene variant="rig" alt="Lighting fixtures on an overhead truss casting warm beams through haze." className="min-h-[160px]" />
              <StageScene variant="ghostlight" alt="An empty stage at night, lit only by a ghost light." className="min-h-[160px]" />
            </div>
          </div>
        </div>
      </Section>

      {/* B. One workspace */}
      <Section labelledBy="workspace-title" className="border-t hairline bg-ink-900/30">
        <SectionHeader
          id="workspace-title"
          eyebrow="One workspace for every department"
          title="The script, the cues and the changes, held together."
          intro="Stagewoven links each cue to the moment in the script it is called on. When that moment changes, the link tells you."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaceFeatures.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title}>
              {f.body}
            </FeatureCard>
          ))}
          <div className="flex flex-col justify-between rounded-2xl border border-brass-400/20 bg-gradient-to-br from-brass-400/[0.08] to-transparent p-7">
            <p className="font-serif text-[1.35rem] leading-snug text-ivory-50">See each of these on a seeded production, “The Last Train”.</p>
            <ButtonLink to="/product" variant="secondary" className="mt-6 self-start">
              Explore the product <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* C. How it works */}
      <Section labelledBy="how-title" className="border-t hairline">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader id="how-title" eyebrow="How Stagewoven works" title="Four steps from new draft to clean cue sheet." />
          <ButtonLink to="/how-it-works" variant="ghost" className="self-start lg:self-auto">
            The full walkthrough <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
        <div className="mt-14">
          <ProcessSteps />
        </div>
      </Section>

      {/* D. Interactive preview */}
      <Section labelledBy="preview-title" className="border-t hairline bg-ink-900/30">
        <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader
              id="preview-title"
              eyebrow="Interactive product preview"
              title="Run a script revision yourself."
              intro="The workspace is a working demonstration. Compare two rehearsal drafts, watch the affected cues land in the review queue, then assign, edit and approve them."
            />
            <ul className="mt-8 space-y-3 text-sm text-ivory-300">
              {['18 sample cues across three scenes', 'Two script drafts with a real cut and a rewording', 'Filters, search, cue editor and review queue', 'Changes saved in your browser only'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-px w-5 bg-brass-400" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <DashboardPreview />
        </div>
      </Section>

      {/* E. Change detection */}
      <Section labelledBy="detect-title" className="border-t hairline">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 lg:order-1">
            <ChangeDetectionPreview />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader
              id="detect-title"
              eyebrow="AI-assisted change detection"
              title="When the words move, the cues that hang on them are flagged."
              intro="Stagewoven compares each new draft with the last, line by line. Cues anchored to removed lines are marked high priority; reworded lines get a lighter check. Where it can, Stagewoven suggests the nearest new moment to call the cue on."
            />
            <p className="mt-6 rounded-lg border hairline bg-ink-900/60 p-4 text-sm leading-relaxed text-ivory-400">
              Suggestions are prompts for a person to check, never automatic changes. Designers and the stage manager decide what is called, and when.
            </p>
          </div>
        </div>
      </Section>

      {/* F. Teams */}
      <Section labelledBy="teams-title" className="border-t hairline bg-ink-900/30">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader id="teams-title" eyebrow="Built for production teams" title="Made for the people on cans." intro="Each role sees the same production, filtered to what they are responsible for." />
            <StageScene variant="stage" alt="A lone figure on a station platform set under a single warm spotlight, framed by red curtains." className="mt-10 hidden aspect-[4/3] lg:block" caption="The Last Train · Scene 2" />
          </div>
          <ul className="divide-y divide-ivory-50/[0.08] border-y hairline">
            {roles.map((r) => (
              <li key={r.title} className="group grid gap-4 py-8 sm:grid-cols-[auto_1fr] sm:gap-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-ivory-400 transition-colors group-hover:border-brass-400/40 group-hover:text-brass-300">
                  <r.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-ivory-50">{r.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ivory-400">{r.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
