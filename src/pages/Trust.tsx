import { Link } from 'react-router-dom'
import { ArrowRight, Check, Info } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import { CtaBand } from '../components/marketing/Blocks'
import { company } from '../data/site'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties

export const PIPELINE = [
  { step: '01', title: 'Import', services: 'Amazon S3 · AWS Lambda', body: 'Each draft of the script is uploaded and parsed into scenes and numbered lines, so every cue can point at a moment rather than a page.' },
  { step: '02', title: 'Plan', services: 'Amazon Aurora PostgreSQL · AWS AppSync', body: 'Lighting, sound and scene-change cues are anchored to lines and synced live across the prompt desk, designers’ laptops and the production office.' },
  { step: '03', title: 'Compare', services: 'AWS Lambda · AWS Step Functions', body: 'When a new draft arrives, a deterministic diff finds lines that were cut, moved or reworded, and flags every cue anchored to them.' },
  { step: '04', title: 'Suggest', services: 'Amazon Bedrock', body: 'For a cue whose line changed, a model may suggest where the trigger now sits in the new draft. It is a suggestion for a person to accept — never applied on its own.' },
  { step: '05', title: 'Review & export', services: 'Amazon Cognito · Amazon SES', body: 'Reviews are routed by department and signed off by the stage manager; clean, department-specific cue sheets export for the desk and the touring file.' },
]

const SERVICES: [string, string][] = [
  ['Amazon S3', 'Stores script drafts, attachments and exported cue sheets with encryption and versioning.'],
  ['AWS AppSync', 'Live sync of cue sheets between the prompt desk, designers and the production office.'],
  ['Amazon Aurora PostgreSQL', 'Productions, scripts, cues, reviews, team roles and the append-only audit log.'],
  ['AWS Lambda & Step Functions', 'Script parsing, revision comparison and review routing.'],
  ['Amazon Bedrock', 'Suggested trigger lines and plain-language summaries of what changed between drafts.'],
  ['Amazon Cognito', 'Sign-in, single sign-on and role groups for stage managers, designers and coordinators.'],
  ['Amazon SES', 'Review assignments and sign-off notifications by email.'],
  ['Amazon CloudWatch', 'Monitoring and alarms for imports, comparisons and sync.'],
  ['AWS KMS', 'Company-specific encryption keys — unreleased scripts stay private.'],
]

export const SAFEGUARDS: [string, string][] = [
  ['People decide every cue', 'A flagged cue is a reason to look again, never an automatic change. Suggested triggers are only applied when someone accepts them.'],
  ['The script is never rewritten', 'Stagewoven reads drafts to keep cues in step. It does not write, edit or reinterpret the script.'],
  ['Not a show-control system', 'Stagewoven plans and documents cues. It does not fire lighting desks, sound consoles or automation.'],
  ['Unreleased work stays private', 'Scripts and designs are visible only to the production team you invite.'],
  ['Roles, enforced', 'Stage managers, deputies, designers and coordinators each get only the actions they need. The demo checks every action; production enforces it on the server.'],
  ['Everything audited', 'Cue edits, comparisons, assignments, accepted suggestions and approvals are written to an append-only audit log the stage manager can export.'],
]

const SECURITY: [string, string][] = [
  ['Encryption', 'TLS 1.2+ in transit; AWS KMS encryption at rest for databases and script storage.'],
  ['Company isolation', 'Every record carries a company identifier filtered on every query; productions never cross companies.'],
  ['Single sign-on', 'Sign in with your identity provider through Amazon Cognito, with multi-factor authentication for stage managers.'],
  ['Least privilege', 'Each service gets only the permissions it needs; no human uses root credentials.'],
  ['Script confidentiality', 'Model calls receive only the lines needed for a suggestion; scripts are never used to train models.'],
  ['Data portability', 'Cue sheets and scripts export at any time; they remain yours.'],
]

export function Technology() {
  useDocumentMeta('Technology', 'How Stagewoven proposes to use AWS: script import, live cue sync, deterministic revision comparison and Amazon Bedrock suggestions for people to accept.', '/technology')
  return (
    <>
      <PageHero eyebrow="Technology" title="How we use Amazon Web Services" intro="A proposed architecture for moving from this browser demo to a production service: keep every cue anchored to a line, compare drafts deterministically, and use AI only to suggest — never to decide." />
      <Section className="border-t hairline">
        <SectionHeader eyebrow="Pipeline" title="From a new draft to a clean cue sheet." />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {PIPELINE.map((p, i) => (
            <li key={p.step} className="reveal lift spot panel p-5" style={delay(i * 80)}>
              <span className="font-mono text-xs text-brass-300">{p.step}</span>
              <h3 className="mt-3 font-serif text-2xl text-ivory-50">{p.title}</h3>
              <p className="mt-1 font-mono text-[0.68rem] text-brass-400">{p.services}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory-400">{p.body}</p>
            </li>
          ))}
        </ol>
        <div className="reveal mt-8 flex gap-3 rounded-xl border border-brass-400/25 bg-brass-400/[0.06] p-4 text-sm text-ivory-200"><Info className="mt-0.5 h-4 w-4 shrink-0 text-brass-300" /><p><strong>Proposed, not deployed.</strong> None of these services are connected to this website or the demo workspace, which run entirely in your browser on sample data.</p></div>
      </Section>
      <Section className="border-t hairline bg-ink-900/30">
        <SectionHeader eyebrow="Services" title="What each service does." />
        <dl className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(([n, b], i) => <div key={n} className="reveal panel p-5" style={delay((i % 3) * 80)}><dt className="text-ivory-50">{n}</dt><dd className="mt-2 text-sm text-ivory-400">{b}</dd></div>)}
        </dl>
        <Link to="/security" className="mt-8 inline-flex items-center gap-2 text-sm text-brass-300 hover:underline">Security and safeguards <ArrowRight className="h-4 w-4" /></Link>
      </Section>
      <CtaBand />
    </>
  )
}

export function Security() {
  useDocumentMeta('Security & safeguards', 'How Stagewoven keeps people in charge: suggestions only applied when accepted, the script never rewritten, not a show-control system, role-based access and an audit log.', '/security')
  return (
    <>
      <PageHero eyebrow="Security & safeguards" title="The software flags. Your team decides." intro="The demo already enforces the safeguards below. The security controls describe the proposed production design." />
      <Section className="border-t hairline">
        <SectionHeader eyebrow="Production safeguards" title="Built into the demo you can try today." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SAFEGUARDS.map(([t, b], i) => <div key={t} className="reveal lift spot panel p-6" style={delay((i % 3) * 80)}><Check className="h-5 w-5 text-sage-300" /><h3 className="mt-3 text-ivory-50">{t}</h3><p className="mt-2 text-sm text-ivory-400">{b}</p></div>)}
        </div>
        <Link to="/workspace/audit" className="mt-8 inline-flex items-center gap-2 text-sm text-brass-300 hover:underline">See roles and the audit log in the demo <ArrowRight className="h-4 w-4" /></Link>
      </Section>
      <Section className="border-t hairline bg-ink-900/30">
        <SectionHeader eyebrow="Proposed security design" title="Controls for the production service." />
        <dl className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SECURITY.map(([t, b], i) => <div key={t} className="reveal panel p-5" style={delay((i % 3) * 80)}><dt className="text-ivory-50">{t}</dt><dd className="mt-2 text-sm text-ivory-400">{b}</dd></div>)}
        </dl>
        <p className="mt-6 max-w-3xl text-sm text-ivory-500">These controls are part of the proposed architecture and are not yet independently audited or certified.</p>
      </Section>
      <CtaBand />
    </>
  )
}

const PRIVACY: [string, string][] = [
  ['What this website is', 'This website describes Stagewoven and includes an interactive demo workspace that runs entirely in your browser on a sample production. No lighting desks, sound consoles or customer systems are connected.'],
  ['Demo data in your browser', 'Cue edits, reviews, the chosen demo user and the demo audit log are saved in your browser’s local storage under the key stagewoven-demo-v1 (you can turn this off in Settings). That data never leaves your device. “Reset demo data”, or clearing site data, removes it.'],
  ['Early-access requests', `Until a form service is configured, the contact form saves your message in your browser (key stagewoven-enquiries) and offers a pre-filled email to ${company.email}; nothing is sent until you send that email. If the operator connects the form to a customer-relationship service (proposed: HubSpot), submitting it sends the fields you enter, your consent choices and the page address to that service so Stagewoven can reply. Product updates are sent only if you tick the optional box. This notice must be updated with the confirmed service and retention before that is switched on.`],
  ['Analytics and cookies', 'This website includes no analytics or advertising trackers and sets no cookies. A hosting provider may process routine request data to serve and protect the site.'],
  ['Your requests', `Contact ${company.email} with questions about information you have sent to Stagewoven, or to ask for it to be corrected or deleted.`],
]

const TERMS: [string, string][] = [
  ['Demonstration only', 'The workspace is a demonstration on a sample production. It is not a production system and must not be used to run a real show.'],
  ['Not show control', 'Stagewoven plans and documents cues. It does not control lighting desks, sound consoles or automation, and it never rewrites scripts.'],
  ['Pricing and availability', 'Prices shown are illustrative and exclude taxes. Early-access requests do not create a subscription or any commitment.'],
  ['Use of the site', 'Use the site and demo lawfully. Do not upload unreleased scripts or personal information to the demo or the contact form.'],
  ['Changes', 'These terms are a review draft. Operator details, governing law and production service terms will be set out separately before launch.'],
]

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const privacy = kind === 'privacy'
  useDocumentMeta(privacy ? 'Privacy notice' : 'Terms of use', privacy ? 'How the Stagewoven website and demo workspace handle information.' : 'Terms for using the Stagewoven website and demonstration workspace.', privacy ? '/privacy' : '/terms')
  return (
    <>
      <PageHero eyebrow="Review draft · operator details to be confirmed" title={privacy ? 'Privacy notice' : 'Terms of use'} intro={privacy ? 'How this website and its demo workspace handle information.' : 'Terms for using this website and its demonstration workspace.'} />
      <Section className="border-t hairline">
        <div className="max-w-3xl space-y-8">
          {(privacy ? PRIVACY : TERMS).map(([t, b]) => <div key={t} className="reveal"><h2 className="font-serif text-2xl text-ivory-50">{t}</h2><p className="mt-2 leading-relaxed text-ivory-300">{b}</p></div>)}
          <p className="text-sm text-ivory-500">Contact: <a href={`mailto:${company.email}`} className="text-brass-300 underline">{company.email}</a></p>
        </div>
      </Section>
    </>
  )
}
