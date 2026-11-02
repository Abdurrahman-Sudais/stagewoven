import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarClock, CheckCircle2, Loader2, Mail, MessageSquare } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { cn } from '../lib/cn'
import { FOUNDERS, company } from '../data/site'
import { hubspotConfig, leadPayload } from '../lib/lead'
import { pricingTiers } from '../data/pricing'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { PageHero, Section } from '../components/ui/Section'
import { ErrorNotice } from '../components/ui/States'

type FormType = 'general' | 'demo'
type Values = Record<'name' | 'email' | 'organisation' | 'role' | 'plan' | 'productions' | 'message', string>
type Errors = Partial<Record<keyof Values, string>>

const roles = ['Stage manager', 'Show caller / DSM', 'Lighting designer', 'Sound designer', 'Production manager / coordinator', 'Producer / company director', 'Other']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(type: FormType, v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address does not look complete.'
  if (type === 'demo') {
    if (!v.organisation.trim()) e.organisation = 'Please tell us your company or production.'
    if (!v.role) e.role = 'Please choose the role closest to yours.'
  }
  if (type === 'general' && v.message.trim().length < 20) e.message = 'Please write at least 20 characters so we can help.'
  if (v.message.length > 2000) e.message = 'Please keep your message under 2,000 characters.'
  return e
}

const ENQUIRIES_KEY = 'stagewoven-enquiries'

export default function Contact() {
  const [params, setParams] = useSearchParams()
  const type: FormType = params.get('type') === 'demo' ? 'demo' : 'general'
  const planParam = params.get('plan') ?? ''
  const [values, setValues] = useState<Values>({ name: '', email: '', organisation: '', role: '', plan: planParam, productions: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState('')
  const [marketing, setMarketing] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [sentVia, setSentVia] = useState<'hubspot' | 'local'>('local')
  const hubspot = hubspotConfig()
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`Stagewoven ${type === 'demo' ? 'demo request' : 'enquiry'}${values.organisation ? ` — ${values.organisation}` : ''}`)}&body=${encodeURIComponent(`${values.message}\n\nName: ${values.name}\nOrganisation: ${values.organisation}\nRole: ${values.role}\nProductions per year: ${values.productions}\nPlan: ${values.plan}`)}`

  useDocumentMeta(type === 'demo' ? 'Request a demo' : 'Contact', 'Contact Stagewoven or request a guided demo of the production cue planning workspace.', '/contact')

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const switchType = (t: FormType) => {
    setErrors({})
    setStatus('idle')
    setParams(t === 'demo' ? { type: 'demo' } : {}, { replace: true })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (honeypot) return // bots fill hidden fields
    const found = validate(type, values)
    setErrors(found)
    setConsentError(consent ? '' : 'Please confirm we may contact you about this request.')
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    if (!consent) {
      document.getElementById('f-consent')?.focus()
      return
    }
    if (!hubspot) {
      try {
        const prev = JSON.parse(localStorage.getItem(ENQUIRIES_KEY) ?? '[]') as unknown[]
        localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([...prev, { ...values, type, marketing, at: new Date().toISOString() }]))
      } catch {
        /* storage unavailable: the email link still works */
      }
      setSentVia('local')
      setStatus('success')
      return
    }
    setStatus('submitting')
    try {
      const r = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(hubspot.portalId)}/${encodeURIComponent(hubspot.formGuid)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload({ ...values, enquiryType: type, marketing }, { pageUri: location.href.split('#')[0] ?? location.href, pageName: document.title }, hubspot)),
      })
      if (!r.ok) throw new Error(String(r.status))
      setSentVia('hubspot')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputProps = (key: keyof Values) => ({
    id: `f-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `f-${key}-error` : undefined,
    className: 'input',
  })

  return (
    <>
      <PageHero
        eyebrow="Early access"
        title={type === 'demo' ? 'See Stagewoven with your own script.' : 'Talk to the Stagewoven team.'}
        intro={
          type === 'demo'
            ? 'Tell us about your production and we will arrange a guided session, using a draft of your script if you would like.'
            : 'Questions about the product, pricing or working together. We read every message.'
        }
      />

      <Section labelledBy="form-title" className="!pt-14">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="panel p-6 sm:p-10">
            <h2 id="form-title" className="sr-only">
              {type === 'demo' ? 'Demo request form' : 'Contact form'}
            </h2>
            <div role="tablist" aria-label="Form type" className="mb-8 inline-flex rounded-full border hairline bg-ink-950 p-1">
              {([
                ['general', 'General enquiry', MessageSquare],
                ['demo', 'Request a demo', CalendarClock],
              ] as const).map(([t, label, Icon]) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={type === t}
                  onClick={() => switchType(t)}
                  className={cn('inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors', type === t ? 'bg-ivory-50 text-ink-950' : 'text-ivory-300 hover:text-ivory-50')}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" /> {label}
                </button>
              ))}
            </div>

            {status === 'success' ? (
              <div role="status" className="animate-scale-in py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-sage-400" aria-hidden="true" />
                <p className="mt-5 font-serif text-3xl text-ivory-50">Thank you, {values.name.split(' ')[0]}.</p>
                {sentVia === 'hubspot' ? (
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory-300">Your {type === 'demo' ? 'demo request' : 'message'} has been received. We’ll reply by email.</p>
                ) : (
                  <>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory-300">This site has no form backend configured yet, so your {type === 'demo' ? 'request' : 'message'} was saved in this browser only. To send it, open it as an email:</p>
                    <a href={mailto} className="mt-5 inline-flex items-center gap-2 rounded-full bg-brass-400 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-brass-300"><Mail className="h-4 w-4" aria-hidden="true" /> Email {company.email}</a>
                  </>
                )}
                <Button
                  variant="secondary"
                  className="mt-8"
                  onClick={() => {
                    setValues({ name: '', email: '', organisation: '', role: '', plan: '', productions: '', message: '' })
                    setStatus('idle')
                  }}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="relative space-y-5">
                {status === 'error' && (
                  <ErrorNotice title="We couldn’t send that just now." body="Check your connection and try again. Your answers are still here." />
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="f-name" label="Full name" required error={errors.name}>
                    <input {...inputProps('name')} autoComplete="name" placeholder="Ama Osei" />
                  </Field>
                  <Field id="f-email" label="Work email" required error={errors.email}>
                    <input {...inputProps('email')} type="email" autoComplete="email" placeholder="ama@northlight.example" />
                  </Field>
                </div>
                {type === 'demo' && (
                  <div className="grid animate-fade-in gap-5 sm:grid-cols-2">
                    <Field id="f-organisation" label="Company or production" required error={errors.organisation}>
                      <input {...inputProps('organisation')} autoComplete="organization" placeholder="Northlight Theatre Company" />
                    </Field>
                    <Field id="f-role" label="Your role" required error={errors.role}>
                      <select {...inputProps('role')}>
                        <option value="">Choose a role</option>
                        {roles.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </Field>
                    <Field id="f-productions" label="Productions per year" hint="Optional">
                      <select {...inputProps('productions')}>
                        <option value="">Choose a range</option>
                        <option>1–2</option>
                        <option>3–6</option>
                        <option>7–15</option>
                        <option>More than 15</option>
                      </select>
                    </Field>
                    <Field id="f-plan" label="Plan of interest" hint="Optional">
                      <select {...inputProps('plan')}>
                        <option value="">Not sure yet</option>
                        {pricingTiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                )}
                <Field
                  id="f-message"
                  label={type === 'demo' ? 'What would you like to see?' : 'Message'}
                  required={type === 'general'}
                  error={errors.message}
                  hint={type === 'demo' ? 'Optional. For example: touring versions, a particular script format, or your review process.' : undefined}
                >
                  <textarea {...inputProps('message')} rows={5} placeholder={type === 'demo' ? 'We open in February and expect heavy rewrites in week two…' : 'How can we help?'} />
                </Field>
                <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
                </div>
                <div className="space-y-2 text-sm text-ivory-300">
                  <label className="flex items-start gap-2">
                    <input id="f-consent" type="checkbox" className="mt-0.5 h-4 w-4 accent-brass-400" checked={consent} onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentError('') }} aria-invalid={consentError ? true : undefined} aria-describedby={consentError ? 'f-consent-error' : undefined} />
                    <span>I agree that Stagewoven may contact me about this request. <span className="text-curtain-300">*</span></span>
                  </label>
                  {consentError && <p id="f-consent-error" className="text-xs text-curtain-300">{consentError}</p>}
                  <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brass-400" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                    <span>Also send me occasional product updates (optional).</span>
                  </label>
                </div>
                <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <p className="text-xs text-ivory-500">{hubspot ? 'Submitting sends these details to Stagewoven’s customer-relationship system so we can reply.' : 'No form backend is configured: your message is saved in this browser and offered as an email.'} See the <a href="/privacy" className="underline">privacy notice</a>.</p>
                  <Button type="submit" size="lg" disabled={status === 'submitting'}>
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
                      </>
                    ) : type === 'demo' ? (
                      'Request a demo'
                    ) : (
                      'Send message'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-8">
            <div>
              <p className="eyebrow !text-ivory-500">Email</p>
              <a href={`mailto:${company.email}`} className="mt-3 inline-flex items-center gap-2 font-serif text-2xl text-ivory-50 hover:text-brass-300">
                <Mail className="h-5 w-5" aria-hidden="true" /> {company.email}
              </a>
            </div>
            <div>
              <p className="eyebrow !text-ivory-500">Founders</p>
              <ul className="mt-3 space-y-3">
                {FOUNDERS.map((f) => (
                  <li key={f.name} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brass-400/30 font-mono text-xs text-brass-300">{f.initials}</span>
                    <span><span className="block text-ivory-100">{f.name}</span><span className="block text-xs text-ivory-500">{f.role}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border hairline bg-ink-900/60 p-6 text-sm leading-relaxed text-ivory-400">
              <p className="font-medium text-ivory-100">In tech week?</p>
              <p className="mt-2">We know the timing. Tell us your first preview date and we will work around your calls, not the other way round.</p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
