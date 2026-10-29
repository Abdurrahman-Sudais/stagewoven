import { Mail } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { company } from '../data/site'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import { StageScene } from '../components/ui/StageScene'
import { CtaBand } from '../components/marketing/Blocks'

const principles = [
  { title: 'People make the call', body: 'Stagewoven flags and suggests. Stage managers and designers decide. Nothing on a cue sheet changes without a person approving it.' },
  { title: 'Honest about what is automated', body: 'We label what runs in the product today, what needs an integration and what is planned. No hidden claims about AI.' },
  { title: 'Built around theatre practice', body: 'Prompt books, standbys, follows and note sessions. We use the language production teams already use.' },
  { title: 'Out of the show-control path', body: 'Stagewoven never sits between the operator and the desk. It documents the show; it does not run it.' },
]

export default function About() {
  useDocumentMeta('About', `Stagewoven was founded by ${company.founder} to keep production paperwork in step with the show as scripts change.`, '/about')

  return (
    <>
      <PageHero
        eyebrow="About Stagewoven"
        title="Built for the hour between the rewrite and the half."
        intro="Stagewoven started from a simple observation: the cue sheet is usually right, until the script changes. Then everyone is working from a slightly different version of the show."
      />

      <Section labelledBy="story-title">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <StageScene variant="ghostlight" alt="An empty theatre after the show, lit only by a ghost light." caption="After the house empties" className="aspect-[4/5] lg:aspect-auto" />
          <div>
            <SectionHeader id="story-title" eyebrow="Our story" title="Paperwork that keeps up with rehearsal." />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-ivory-300">
              <p>
                {company.founder} founded Stagewoven after seeing the same pattern across productions: a scene is cut in the afternoon, the prompt book is updated, and the
                lighting and sound cue lists are still pointing at a line that no longer exists when the evening run begins.
              </p>
              <p>
                The fix is rarely difficult. Finding it is. Stagewoven links every cue to the moment it belongs to, compares each new draft with the last, and gives the
                team one list of what needs another look.
              </p>
              <p>
                We are building with stage managers, show callers and designers, and we would rather ship a small tool that is trusted on show night than a large one
                that is not.
              </p>
            </div>
            <div className="mt-10 rounded-xl border hairline bg-ink-900/60 p-6">
              <p className="eyebrow !text-ivory-500">Founder</p>
              <p className="mt-2 font-serif text-2xl text-ivory-50">{company.founder}</p>
              <a href={`mailto:${company.email}`} className="mt-3 inline-flex items-center gap-2 text-sm text-ivory-300 hover:text-brass-300">
                <Mail className="h-4 w-4" aria-hidden="true" /> {company.email}
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="principles-title" className="border-t hairline bg-ink-900/30">
        <SectionHeader id="principles-title" eyebrow="How we work" title="Four principles we design against." />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border hairline bg-ivory-50/[0.08] md:grid-cols-2">
          {principles.map((p, i) => (
            <li key={p.title} className="bg-ink-900 p-8">
              <span className="font-mono text-xs text-brass-400">0{i + 1}</span>
              <h3 className="mt-4 font-serif text-2xl text-ivory-50">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory-400">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />
    </>
  )
}
