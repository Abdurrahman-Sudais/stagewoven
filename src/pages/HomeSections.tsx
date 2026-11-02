import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Check, Clock, Compass, Mail, Rocket, ShieldCheck, Sparkles, X } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import { ButtonLink } from '../components/ui/Button'
import { cn } from '../lib/cn'
import { FOUNDERS, company, type Person } from '../data/site'
import { pricingTiers } from '../data/pricing'
import { PIPELINE, SAFEGUARDS } from './Trust'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties

export function AiSection() {
  return (
    <Section className="border-t hairline">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <SectionHeader eyebrow="AI, used carefully" title="Answers from your own cue sheets, not guesses." intro="Stagewoven’s assistant explains what changed and which cues it touches. The comparison is deterministic; the wording only makes it easier to read." />
          <ul className="mt-8 space-y-3">
            {(
              [
                [true, 'Summarise a cue: trigger, anchor line, status and any open review'],
                [true, 'Answer “which cues need review?” and “who has open reviews?”'],
                [true, 'Suggest where a moved trigger now sits — for someone to accept'],
                [true, 'List the records it used, so every answer can be checked'],
                [false, 'Rewrite, cut or reinterpret the script'],
                [false, 'Decide design intent or fire cues during a show'],
              ] as const
            ).map(([ok, t], i) => (
              <li key={t} className="reveal lift flex gap-3 rounded-xl border hairline bg-ink-900/70 p-4 text-sm text-ivory-200" style={delay(i * 60)}>
                {ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-300" aria-label="Does" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-curtain-300" aria-label="Never does" />}
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal relative" style={delay(120)}>
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-brass-400/10 blur-2xl" aria-hidden="true" />
          <div className="panel relative p-6">
            <div className="flex items-center gap-2 text-sm text-ivory-50"><Bot className="h-4 w-4 text-brass-300" /> Ask about this production <span className="rounded-full border border-brass-400/25 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-brass-300 uppercase">Sample data</span></div>
            <p className="mt-5 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-brass-400/15 px-3 py-2 text-sm text-brass-200">Which cues need review?</p>
            <div className="mt-3 max-w-[92%] rounded-2xl rounded-bl-sm border hairline bg-ink-900 p-3 text-sm text-ivory-200">
              <p>After the latest draft, three cues sit on lines that were cut or reworded in scene 2. Each is flagged for review, with a suggested new anchor where one was found.</p>
              <p className="mt-3 font-mono text-[0.68rem] text-ivory-500">From records in the review queue</p>
            </div>
            <p className="mt-4 ml-auto w-fit rounded-2xl rounded-br-sm bg-brass-400/15 px-3 py-2 text-sm text-brass-200">Rewrite scene 2 for me.</p>
            <div className="mt-3 max-w-[92%] rounded-2xl rounded-bl-sm border hairline bg-ink-900 p-3 text-sm text-ivory-400">That’s a creative decision for your team. I can show which cues the last rewrite touched.</div>
            <ButtonLink to="/workspace" size="sm" className="mt-6">Try the assistant in the demo <ArrowRight className="h-3.5 w-3.5" /></ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function SafeguardsSection() {
  return (
    <Section className="border-t hairline bg-ink-900/30">
      <SectionHeader eyebrow="Safeguards" title="The software flags. Your team decides." />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SAFEGUARDS.map(([t, b], i) => (
          <div key={t} className="reveal lift spot panel p-6" style={delay((i % 3) * 90)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border hairline bg-ink-800 text-brass-300"><ShieldCheck className="h-5 w-5" /></span>
            <h3 className="mt-4 text-ivory-50">{t}</h3>
            <p className="mt-2 text-sm text-ivory-400">{b}</p>
          </div>
        ))}
      </div>
      <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-sm text-brass-300 hover:underline">Security and safeguards in detail <ArrowRight className="h-4 w-4" /></Link>
    </Section>
  )
}

export function TechnologySection() {
  return (
    <Section id="technology" className="border-t hairline">
      <SectionHeader eyebrow="Technology" title="How we use Amazon Web Services" intro="A proposed serverless architecture: anchor every cue to a line, compare drafts deterministically, and use Amazon Bedrock only to suggest." />
      <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {PIPELINE.map((p, i) => (
          <li key={p.step} className="reveal lift spot panel p-5" style={delay(i * 90)}>
            <span className="font-mono text-xs text-brass-300">{p.step}</span>
            <h3 className="mt-3 font-serif text-2xl text-ivory-50">{p.title}</h3>
            <p className="mt-1 font-mono text-[0.68rem] text-brass-400">{p.services}</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory-400">{p.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-ivory-500">These services are proposed, not deployed. The demo runs in your browser on sample data. <Link to="/technology" className="text-brass-300 underline">The full architecture</Link></p>
    </Section>
  )
}

export function PricingSection() {
  return (
    <Section id="pricing" className="border-t hairline bg-ink-900/30">
      <SectionHeader eyebrow="Pricing" title="Simple plans for every company size." align="center" />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {pricingTiers.map((t, i) => (
          <div key={t.id} className={cn('reveal lift spot relative flex flex-col rounded-2xl border p-7', t.featured ? 'border-brass-400/60 bg-gradient-to-b from-ink-800 to-ink-900' : 'hairline bg-ink-900/70')} style={delay(i * 100)}>
            {t.featured && <span className="absolute -top-3 left-7 rounded-full bg-brass-400 px-2.5 py-0.5 text-xs text-ink-950">Most popular</span>}
            <h3 className="font-serif text-2xl text-ivory-50">{t.name}</h3>
            <p className="mt-1 text-sm text-ivory-400">{t.summary}</p>
            <div className="mt-5 flex items-baseline gap-1"><span className="font-serif text-5xl text-ivory-50">{t.monthly === null ? 'Custom' : `$${t.monthly}`}</span>{t.monthly !== null && <span className="text-ivory-500">/month</span>}</div>
            <ul className="mt-5 flex-1 space-y-2.5">{t.features.map((f) => <li key={f} className="flex gap-2 text-sm text-ivory-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-300" /> {f}</li>)}</ul>
            <ButtonLink to={t.cta.to} variant={t.featured ? 'primary' : 'secondary'} className="mt-7 w-full">{t.cta.label}</ButtonLink>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-ivory-500">Illustrative prices in USD, excluding taxes. Early-access companies are onboarded directly by the founders. <Link to="/pricing" className="text-brass-300 underline">Compare plans</Link></p>
    </Section>
  )
}

export const ROADMAP = [
  { icon: Sparkles, stage: 'Now', title: 'Live demo & early access', items: ['Interactive workspace on a sample production', 'Revision comparison, review queue, cue sheets', 'Roles, audit log and grounded assistant', 'Early-access requests open'], current: true },
  { icon: Compass, stage: 'Next', title: 'Pilot on one production', items: ['Import your own script drafts (PDF, Final Draft, Word)', 'Live sync between the prompt desk and designers', 'Review routing with email notifications'] },
  { icon: Rocket, stage: 'Then', title: 'General availability', items: ['Multiple productions and touring versions', 'Single sign-on with roles enforced on the server', 'Suggested triggers written with Amazon Bedrock', 'Department-specific exports for every venue'] },
  { icon: Clock, stage: 'Later', title: 'Exploring with pilot teams', items: ['Read-only cue-list exchange with lighting and sound consoles', 'Rehearsal-report integration', 'Company-wide production libraries'] },
]

export function RoadmapSection() {
  return (
    <Section id="roadmap" className="border-t hairline">
      <SectionHeader eyebrow="Roadmap" title="Where Stagewoven is going" intro="Built with early-access companies. The order below is our plan and may change based on what pilots teach us." />
      <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {ROADMAP.map((r, i) => (
          <li key={r.stage} className={cn('reveal lift rounded-2xl border p-6', r.current ? 'border-brass-400/50 bg-ink-850' : 'hairline bg-ink-900/70')} style={delay(i * 100)}>
            <div className="flex items-center justify-between">
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', r.current ? 'bg-brass-400 text-ink-950' : 'border hairline text-ivory-400')}><r.icon className="h-5 w-5" /></span>
              <span className={cn('flex items-center gap-2 font-mono text-xs tracking-wider uppercase', r.current ? 'text-brass-300' : 'text-ivory-500')}>{r.current && <span className="live-dot" aria-hidden="true" />}{r.stage}</span>
            </div>
            <h3 className="mt-4 font-serif text-2xl text-ivory-50">{r.title}</h3>
            <ul className="mt-3 space-y-2">{r.items.map((t) => <li key={t} className="flex gap-2 text-sm text-ivory-400"><Check className={cn('mt-0.5 h-4 w-4 shrink-0', r.current ? 'text-sage-300' : 'text-ivory-600')} /> {t}</li>)}</ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function PersonCard({ person, delayMs = 0 }: { person: Person; delayMs?: number }) {
  return (
    <article className="reveal lift spot relative overflow-hidden rounded-2xl border hairline bg-gradient-to-br from-ink-850 to-ink-900 p-6 sm:p-8" style={delay(delayMs)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center" aria-hidden="true">
          <div className="spin-slow absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#e6a23f,#b13a2f,#f6d9a8,#e6a23f)]" style={{ animationDelay: `-${delayMs / 10}s` }} />
          <div className="absolute inset-[3px] grid place-items-center rounded-full bg-ink-900 font-serif text-3xl text-brass-200">{person.initials}</div>
        </div>
        <div>
          <p className="eyebrow">{person.role}</p>
          <h3 className="mt-1 font-serif text-3xl text-ivory-50">{person.name}</h3>
          <p className="mt-3 max-w-xl text-ivory-300">{person.bio}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Focus areas">{person.focus.map((f) => <li key={f} className="rounded-full border hairline px-2.5 py-1 text-xs text-ivory-300">{f}</li>)}</ul>
          {person.email && <a href={`mailto:${person.email}`} className="mt-4 inline-flex items-center gap-1.5 text-sm text-brass-300 hover:underline"><Mail className="h-4 w-4" /> {person.email}</a>}
        </div>
      </div>
    </article>
  )
}

export function FoundersGrid() {
  return <div className="grid gap-5 lg:grid-cols-2">{FOUNDERS.map((p, i) => <PersonCard key={p.name} person={p} delayMs={i * 120} />)}</div>
}

export function TeamSection() {
  return (
    <Section id="team" className="border-t hairline bg-ink-900/30">
      <SectionHeader eyebrow="Team" title="The people building Stagewoven" intro={`Founded by ${FOUNDERS.map((f) => f.name).join(' and ')}, and built together with the stage managers and designers who will use it.`} />
      <div className="mt-12"><FoundersGrid /></div>
      <div className="reveal mt-5 grid gap-6 rounded-2xl border hairline bg-ink-900/70 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h3 className="font-serif text-2xl text-ivory-50">Building with production teams</h3>
          <p className="mt-2 text-sm text-ivory-400">Stagewoven is shaped by conversations with stage managers, designers and production offices. Early-access companies get a direct line to the founders and a say in what we build next.</p>
          <Link to="/about" className="mt-4 inline-flex items-center gap-2 text-sm text-brass-300 hover:underline">Our story <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div>
          <p className="eyebrow">We’d like to hear from</p>
          <ul className="mt-3 space-y-2 text-sm text-ivory-200">{['Companies with a production going into rehearsal', 'Stage managers and designers', 'Advisors who know touring and live events'].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-300" /> {t}</li>)}</ul>
        </div>
      </div>
    </Section>
  )
}

export const FAQS: [string, string][] = [
  ['Does Stagewoven change cues on its own?', 'No. When a new draft arrives, it flags the cues anchored to lines that were cut, moved or reworded, and may suggest where a trigger now sits. A person accepts or rejects every change, and the stage manager approves revised cues.'],
  ['What problem does it actually solve?', 'Scripts change through rehearsals, but cue sheets live in separate spreadsheets, laptops and the prompt book. Stagewoven anchors every lighting, sound and scene-change cue to a line, so the team sees exactly which cues a rewrite touches before the next run — not during it.'],
  ['Does it control our lighting desk or sound console?', 'No. Stagewoven plans and documents cues. It does not fire cues or connect to show-control equipment.'],
  ['Which script formats can we import?', 'The pilot plan covers PDF, Final Draft and Word drafts. We confirm formats during the early-access conversation.'],
  ['Who can change what?', 'Production stage managers, deputies, designers and coordinators each get only the actions they need, and every change is written to an audit log. Try “Demo as” in the workspace.'],
  ['What does the AI do?', 'It summarises what changed, answers questions from your cue sheets and suggests new trigger lines — always listing the records it used. It never rewrites the script or decides design intent.'],
  ['Is our unreleased script safe?', 'In the proposed design, scripts are encrypted, visible only to your production team, and never used to train models.'],
  ['How much does it cost?', 'Solo Production starts at $29/month; company and enterprise plans are on the pricing page. Prices are illustrative and exclude taxes.'],
  ['Is it available today?', 'Stagewoven is in early access. The demo workspace runs in your browser on a sample production; a pilot runs on one of yours. Request early access and one of the founders will reply personally.'],
]

export function FaqSection() {
  return (
    <Section id="faq" className="border-t hairline">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <SectionHeader eyebrow="FAQ" title="Questions production teams ask" />
          <a href={`mailto:${company.email}`} className="reveal mt-6 inline-flex items-center gap-2 text-sm text-brass-300 hover:underline"><Mail className="h-4 w-4" /> Email the founders</a>
        </div>
        <div className="reveal divide-y divide-ivory-50/10 rounded-2xl border hairline bg-ink-900/70">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-ivory-50">{q}<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border hairline text-brass-300 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-ivory-400">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
