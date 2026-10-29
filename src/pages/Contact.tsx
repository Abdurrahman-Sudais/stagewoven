import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarClock, CheckCircle2, Loader2, Mail, MessageSquare } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { cn } from '../lib/cn'
import { company } from '../data/site'
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

export default function Contact() {
  const [params, setParams] = useSearchParams()
  const type: FormType = params.get('type') === 'demo' ? 'demo' : 'general'
  const planParam = params.get('plan') ?? ''
  const [values, setValues] = useState<Values>({ name: '', email: '', organisation: '', role: '', plan: planParam, productions: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

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
    const found = validate(type, values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    setStatus('submitting')
    try {
      // No form backend is connected; simulate a short round trip.
      await new Promise((r) => setTimeout(r, 900))
      if (!navigator.onLine) throw new Error('offline')
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
        eyebrow="Contact"
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
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory-300">
                  Your {type === 'demo' ? 'demo request' : 'message'} passed validation. This preview site has no form backend connected, so nothing has been sent. Please
                  email{' '}
                  <a href={`mailto:${company.email}`} className="text-brass-300 underline underline-offset-4">
                    {company.email}
                  </a>{' '}
                  to reach the team directly.
                </p>
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
              <form noValidate onSubmit={onSubmit} className="space-y-5">
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
                <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <p className="text-xs text-ivory-500">We only use these details to reply to you.</p>
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
              <p className="eyebrow !text-ivory-500">Founder</p>
              <p className="mt-3 text-ivory-100">{company.founder}</p>
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
