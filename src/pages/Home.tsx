import { AlertTriangle, ArrowRight, Check, CheckCircle2, ExternalLink, FileStack, FileText, GitCompareArrows, ListChecks, MessagesSquare, Minus, Share2, Sparkles, Unlink, UserCheck, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { useCountUp, useCycle } from '../lib/motion'
import { AiSection, FaqSection, PricingSection, RoadmapSection, SafeguardsSection, TeamSection, TechnologySection } from './HomeSections'
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

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** Published figures used in the problem section. Each one links to its source. */
export const PROBLEM_STATS = [
  { value: 540, decimals: 0, prefix: '', suffix: '', label: 'lighting cues run in a single Broadway musical — Hadestown — each one tied to a moment in the script.', source: 'Theatrecrafts — Hadestown production notes', url: 'https://www.theatrecrafts.com/pages/home/shows/hadestown/' },
  { value: 39, decimals: 0, prefix: '', suffix: '', label: 'new productions opened on Broadway in the 2023–24 season alone — every one rewritten through rehearsals and previews.', source: 'The Broadway League 2023–24 season statistics, via Talkin’ Broadway', url: 'https://talkinbroadway.com/allthatchat_new/d.php?id=2596404' },
  { value: 12.3, decimals: 1, prefix: '', suffix: 'M', label: 'admissions to Broadway shows in 2023–24 — audiences who expect the cue to land on the line, every night.', source: 'The Broadway League (2024)', url: 'https://www.broadwayleague.com/press/press-releases/broadways-2023-2024-end-of-season-statistics-reveal-123-million-attendances-and-grosses-of-154-billion/' },
]

const OUTCOME_WORDS = ['missed cues.', 'tech-week chaos.', 'outdated cue sheets.', 'blind spots.'] as const
const BUILT_FOR = ['Stage managers', 'Show callers', 'Lighting designers', 'Sound designers', 'Heads of stage', 'Production offices', 'Touring productions', 'Repertory companies', 'Musicals', 'New writing', 'Opera & dance', 'Live events', 'Drama schools']

function FloatCard({ className, icon, title, body, style }: { className: string; icon: ReactNode; title: string; body: string; style?: CSSProperties }) {
  return (
    <div className={`absolute z-10 max-w-[17rem] items-start gap-3 rounded-xl border hairline bg-ink-900/95 p-3 shadow-2xl shadow-black/60 backdrop-blur ${className}`} style={style} aria-hidden="true">
      <span className="mt-0.5">{icon}</span>
      <span><span className="block text-xs text-ivory-50">{title}</span><span className="mt-0.5 block text-xs text-ivory-400">{body}</span></span>
    </div>
  )
}

function Stat({ value, decimals, prefix, suffix, label, source, url, delayMs }: (typeof PROBLEM_STATS)[number] & { delayMs: number }) {
  const [ref, n] = useCountUp<HTMLDivElement>(value)
  return (
    <figure className="reveal lift spot rounded-2xl border hairline bg-ink-900/70 p-6" style={delay(delayMs)}>
      <div ref={ref} className="font-serif text-6xl font-light tracking-tight text-ivory-50 tabular-nums">{prefix}{n.toFixed(decimals)}<span className="text-brass-300">{suffix}</span></div>
      <figcaption>
        <p className="mt-3 text-sm leading-relaxed text-ivory-300">{label}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-start gap-1 text-xs text-ivory-500 hover:text-brass-300">Source: {source} <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" /></a>
      </figcaption>
    </figure>
  )
}

function Marquee() {
  const row = [...BUILT_FOR, ...BUILT_FOR]
  return (
    <section aria-label="Built for" className="marquee overflow-hidden border-y hairline bg-ink-900/40 py-6">
      <p className="eyebrow mb-4 text-center !text-ivory-500">Built for the people on cans</p>
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee-track flex w-max gap-10">{row.map((t, i) => <li key={i} aria-hidden={i >= BUILT_FOR.length} className="flex items-center gap-10 whitespace-nowrap font-serif text-2xl text-ivory-500 italic">{t}<span className="h-1 w-1 rounded-full bg-brass-400/60" /></li>)}</ul>
      </div>
    </section>
  )
}

function SolutionSection() {
  const today = ['Each department keeps its own cue sheet, on its own laptop.', 'A cut line at 6 p.m. reaches lighting at 7 and sound at the half.', 'Cues point at page numbers that moved two drafts ago.', 'Nobody can see which cues a rewrite touched until the run.', 'Sign-off lives in emails and margin notes.']
  const withSw = ['One shared cue sheet for lighting, sound and scene changes.', 'Every cue is anchored to a line, not a page.', 'A new draft is compared and every affected cue is flagged at once.', 'Reviews are routed to the right designer with a reason and priority.', 'Approvals and every change are recorded in an audit log.']
  return (
    <Section id="solution" className="border-t hairline bg-ink-900/30">
      <SectionHeader eyebrow="What we solve" title="From four copies of the truth to one cue sheet the whole team trusts." />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <div className="reveal rounded-2xl border hairline bg-ink-900/70 p-6 sm:p-8">
          <p className="eyebrow flex items-center gap-2 !text-ivory-500"><X className="h-3.5 w-3.5 text-curtain-300" /> Today</p>
          <ul className="mt-5 space-y-4">{today.map((t) => <li key={t} className="flex gap-3 text-ivory-400"><Minus className="mt-1 h-4 w-4 shrink-0 text-ivory-600" /> {t}</li>)}</ul>
        </div>
        <div className="reveal spot rounded-2xl border border-brass-400/40 bg-gradient-to-br from-ink-800 to-[#2a1d10] p-6 sm:p-8" style={delay(120)}>
          <p className="eyebrow flex items-center gap-2"><Check className="h-3.5 w-3.5" /> With Stagewoven</p>
          <ul className="mt-5 space-y-4">{withSw.map((t) => <li key={t} className="flex gap-3 text-ivory-100"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brass-300" /> {t}</li>)}</ul>
        </div>
      </div>
    </Section>
  )
}

type Cell = { v: 'yes' | 'no' | 'part'; t: string }
const COMPARE: { row: string; cols: [Cell, Cell, Cell, Cell] }[] = [
  { row: 'One cue sheet for every department', cols: [{ v: 'no', t: 'One per department' }, { v: 'part', t: 'Shared, unstructured' }, { v: 'no', t: 'Per console' }, { v: 'yes', t: 'Lighting, sound, scene change' }] },
  { row: 'Cues anchored to script lines', cols: [{ v: 'part', t: 'Page numbers' }, { v: 'part', t: 'Comments' }, { v: 'no', t: 'Cue numbers only' }, { v: 'yes', t: 'Line-level references' }] },
  { row: 'Shows which cues a rewrite touches', cols: [{ v: 'no', t: 'Found at the run' }, { v: 'no', t: 'Manual diff' }, { v: 'no', t: 'Not designed for it' }, { v: 'yes', t: 'Every affected cue flagged' }] },
  { row: 'Routes reviews to the right person', cols: [{ v: 'no', t: 'Group email' }, { v: 'part', t: '@mentions' }, { v: 'no', t: 'Out of scope' }, { v: 'yes', t: 'By department, with priority' }] },
  { row: 'Record of who approved what', cols: [{ v: 'no', t: 'Margin notes' }, { v: 'part', t: 'Version history' }, { v: 'part', t: 'Show file' }, { v: 'yes', t: 'Append-only audit log' }] },
  { row: 'Runs the show', cols: [{ v: 'no', t: '—' }, { v: 'no', t: '—' }, { v: 'yes', t: 'That’s its job' }, { v: 'no', t: 'By design — plans, never fires' }] },
]

function CompareSection() {
  const heads = ['Spreadsheets & email', 'Shared documents', 'Console software', 'Stagewoven']
  const Icon = ({ v }: { v: Cell['v'] }) => (v === 'yes' ? <Check className="h-4 w-4 shrink-0 text-sage-300" aria-label="Yes" /> : v === 'no' ? <X className="h-4 w-4 shrink-0 text-curtain-300" aria-label="No" /> : <Minus className="h-4 w-4 shrink-0 text-brass-300" aria-label="Partly" />)
  return (
    <Section id="compare" className="border-t hairline">
      <SectionHeader eyebrow="Why Stagewoven" title="How it compares with the way cues are planned today" intro="Stagewoven sits alongside your desks and consoles — it keeps the plan in step with the script so the show file stays right." />
      <div className="reveal mt-12 overflow-x-auto rounded-2xl border hairline">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead><tr className="border-b hairline bg-ink-900"><th className="p-4 font-normal"><span className="sr-only">Capability</span></th>{heads.map((h, i) => <th key={h} className={`p-4 font-normal ${i === 3 ? 'bg-brass-400/10 text-brass-200' : 'text-ivory-300'}`}>{h}</th>)}</tr></thead>
          <tbody>
            {COMPARE.map((r) => (
              <tr key={r.row} className="border-b hairline last:border-0">
                <th scope="row" className="p-4 font-normal text-ivory-50">{r.row}</th>
                {r.cols.map((c, i) => <td key={i} className={`p-4 align-top ${i === 3 ? 'bg-brass-400/[0.05]' : ''}`}><span className={`flex gap-2 ${i === 3 ? 'text-ivory-100' : 'text-ivory-400'}`}><Icon v={c.v} /> {c.t}</span></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

function EarlyAccessSection() {
  return (
    <Section id="early-access" className="border-t hairline bg-ink-900/30">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <SectionHeader eyebrow="Early access" title="Bring Stagewoven into your next production." intro="Early-access companies get guided setup on one production — using a draft of your own script if you like — and a direct say in what we build next." />
        <div className="reveal panel p-6">
          <p className="eyebrow">What happens next</p>
          <ol className="mt-4 space-y-3 text-sm text-ivory-300">
            <li>1. A founder replies to arrange a short call around your schedule.</li>
            <li>2. We walk through a real revision on your own script.</li>
            <li>3. If it’s a fit, we set up a pilot for one production.</li>
          </ol>
          <ButtonLink to="/contact?type=demo" size="lg" className="mt-6 w-full">Request early access <ArrowRight className="h-4 w-4" /></ButtonLink>
          <p className="mt-3 text-xs text-ivory-500">No commitment — a request is not a subscription.</p>
        </div>
      </div>
    </Section>
  )
}

export default function Home() {
  useDocumentMeta('', 'Plan lighting, sound and scene-change cues in one workspace. When scripts and rehearsals change, Stagewoven helps your team find the cues that may need another look.', '/')

  const word = useCycle(OUTCOME_WORDS, 2400)
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="stage-light relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
        <div aria-hidden="true" className="spotlight-sweep pointer-events-none absolute top-0 left-1/2 h-[520px] w-[900px] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_160deg,rgb(246_217_168/0.08)_180deg,transparent_200deg)]" />
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute -right-40 top-40 h-[26rem] w-[26rem] rounded-full bg-curtain-500/10 blur-3xl" />
        <Container className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <div>
            <a href="/contact?type=demo" className="group mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border hairline bg-ink-900/70 px-3 py-1.5 text-xs text-ivory-200 backdrop-blur hover:border-brass-400/40">
              <span className="live-dot" aria-hidden="true" /> Early access open · pilots on one production <ArrowRight className="h-3.5 w-3.5 text-brass-300 transition-transform group-hover:translate-x-0.5" />
            </a>
            <h1 id="hero-title" className="animate-fade-up font-serif text-[2.9rem] leading-[1.02] font-light tracking-tight text-ivory-50 [animation-delay:60ms] sm:text-6xl xl:text-7xl">
              Keep every cue in <em className="text-brass-300">step</em> with the show — not <span className="sr-only">missed cues, tech-week chaos, outdated cue sheets or blind spots.</span>
              <span aria-hidden="true" className="block min-h-[1.05em]"><em key={word} className="word-in"><span className="text-shimmer">{word}</span></em></span>
            </h1>
            <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-ivory-300 [animation-delay:120ms]">
              Plan lighting, sound and scene changes in one workspace, anchored to the script. When a rewrite lands, Stagewoven shows every cue it touches before the next run.
            </p>
            <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:180ms] sm:flex-row">
              <ButtonLink to="/contact?type=demo" size="lg">
                Request early access <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink to="/workspace" variant="secondary" size="lg">
                Explore the live demo
              </ButtonLink>
            </div>
            <ul className="mt-8 grid max-w-lg animate-fade-up gap-x-6 gap-y-2 text-sm text-ivory-300 [animation-delay:240ms] sm:grid-cols-2">
              {['Cues anchored to lines', 'Every rewrite compared', 'Reviews routed by department', 'People approve every change'].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brass-300" aria-hidden="true" /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="relative animate-fade-up [animation-delay:200ms]">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-brass-400/10 blur-2xl" aria-hidden="true" />
            <div className="relative"><HeroPreview /></div>
            <FloatCard className="float -left-6 -top-8 hidden lg:flex" icon={<AlertTriangle className="h-4 w-4 text-curtain-300" />} title="Line cut in draft 4 · line 06" body="SND-014 lost its trigger — flagged for review" />
            <FloatCard className="float-slow -bottom-10 right-4 hidden lg:flex" icon={<Sparkles className="h-4 w-4 text-brass-300" />} title="Suggested new anchor" body="Accept or reject — never applied on its own" style={{ animationDelay: '-2s' }} />
          </div>
        </Container>
      </section>
      <Marquee />

      {/* A. Problem */}
      <Section id="problem" labelledBy="problem-title" className="border-t hairline">
        <div className="mb-16 grid gap-5 md:grid-cols-3">{PROBLEM_STATS.map((st, i) => <Stat key={st.label} {...st} delayMs={i * 120} />)}</div>
        <p className="-mt-12 mb-16 text-xs text-ivory-500">Published figures from third-party sources, linked above. They describe the scale of live production, not Stagewoven results.</p>
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
                <li key={f.label} className="reveal lift flex items-start gap-3 rounded-xl border hairline bg-ink-900/60 p-4">
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

      <SolutionSection />

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
      <Section id="who" labelledBy="teams-title" className="border-t hairline bg-ink-900/30">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader id="teams-title" eyebrow="Built for production teams" title="Made for the people on cans." intro="Each role sees the same production, filtered to what they are responsible for." />
            <StageScene variant="stage" alt="A lone figure on a station platform set under a single warm spotlight, framed by red curtains." className="mt-10 hidden aspect-[4/3] lg:block" caption="The Last Train · Scene 2" />
          </div>
          <ul className="divide-y divide-ivory-50/[0.08] border-y hairline">
            {roles.map((r) => (
              <li key={r.title} className="reveal group grid gap-4 py-8 sm:grid-cols-[auto_1fr] sm:gap-8">
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

      <CompareSection />
      <AiSection />
      <SafeguardsSection />
      <TechnologySection />
      <PricingSection />
      <RoadmapSection />
      <TeamSection />
      <FaqSection />
      <EarlyAccessSection />
      <CtaBand />
    </>
  )
}
