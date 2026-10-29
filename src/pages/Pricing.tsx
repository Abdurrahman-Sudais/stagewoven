import { useState } from 'react'
import { Check, Info } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { cn } from '../lib/cn'
import { ANNUAL_DISCOUNT, priceFor, pricingTiers } from '../data/pricing'
import { ButtonLink } from '../components/ui/Button'
import { PageHero, Section } from '../components/ui/Section'
import { CtaBand } from '../components/marketing/Blocks'

const faqs = [
  { q: 'Are these final prices?', a: 'No. These are illustrative introductory prices proposed for early productions. They are not a verified commercial offer and may change before general availability.' },
  { q: 'Does Stagewoven connect to our lighting desk or sound console?', a: 'No. Stagewoven plans, documents and reviews cues. Programming and firing cues stays with your operators and your existing show control equipment.' },
  { q: 'Is rehearsal transcription included?', a: 'Transcription depends on a connected speech-to-text provider. It is listed on the Production Team tier as integration-dependent and is not part of the public demo.' },
  { q: 'Can we try it first?', a: 'Yes. The interactive workspace runs with sample data in your browser. For a guided session with your own script, request a demo.' },
]

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  useDocumentMeta('Pricing', 'Illustrative introductory pricing for Stagewoven: Solo Production, Production Team and Production Company plans.', '/pricing')

  return (
    <>
      <PageHero eyebrow="Pricing" title="Priced per production, not per seat in the house." intro="Three plans for productions of different sizes. Every plan includes the cue workspace and revision comparison." />

      <Section labelledBy="plans-title" className="!pt-14">
        <h2 id="plans-title" className="sr-only">Plans</h2>
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="flex items-center gap-2 rounded-full border border-brass-400/25 bg-brass-400/[0.06] px-4 py-2 text-xs text-brass-200">
            <Info className="h-3.5 w-3.5" aria-hidden="true" /> Illustrative introductory pricing, not a verified commercial offer.
          </p>
          <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full border hairline bg-ink-900 p-1">
            {(['monthly', 'annual'] as const).map((b) => (
              <button
                key={b}
                role="radio"
                aria-checked={billing === b}
                onClick={() => setBilling(b)}
                className={cn('rounded-full px-4 py-1.5 text-sm transition-colors', billing === b ? 'bg-ivory-50 text-ink-950' : 'text-ivory-300 hover:text-ivory-50')}
              >
                {b === 'monthly' ? 'Monthly' : `Annual · save ${Math.round(ANNUAL_DISCOUNT * 100)}%`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const price = priceFor(tier, billing)
            return (
              <article
                key={tier.id}
                aria-labelledby={`${tier.id}-name`}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-8',
                  tier.featured ? 'border-brass-400/35 bg-gradient-to-b from-brass-400/[0.07] to-ink-900' : 'hairline bg-ink-900/70',
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-brass-400 px-3 py-1 font-mono text-[0.62rem] tracking-wider text-ink-950 uppercase">Most productions</span>
                )}
                <h3 id={`${tier.id}-name`} className="font-serif text-2xl text-ivory-50">
                  {tier.name}
                </h3>
                <p className="mt-2 min-h-12 text-sm text-ivory-400">{tier.summary}</p>
                <div className="mt-6 flex items-baseline gap-1.5" aria-live="polite">
                  {price === null ? (
                    <span className="font-serif text-5xl font-light text-ivory-50">Custom</span>
                  ) : (
                    <>
                      <span className="font-serif text-5xl font-light text-ivory-50 tabular-nums">${price}</span>
                      <span className="text-sm text-ivory-400">/ month</span>
                    </>
                  )}
                </div>
                <p className="mt-1 h-5 text-xs text-ivory-500">
                  {price === null ? 'Tailored to your season and teams' : billing === 'annual' ? `Billed annually ($${price * 12}/year)` : 'Billed monthly'}
                </p>
                <ButtonLink to={tier.cta.to} variant={tier.featured ? 'primary' : 'secondary'} className="mt-7 w-full">
                  {tier.cta.label}
                </ButtonLink>
                <ul className="mt-8 space-y-3 border-t hairline pt-7">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ivory-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" aria-hidden="true" /> {f}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </Section>

      <Section labelledBy="faq-title" className="border-t hairline">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 id="faq-title" className="font-serif text-4xl font-light text-ivory-50">
            Questions about plans
          </h2>
          <div className="divide-y divide-ivory-50/[0.08] border-y hairline">
            {faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-ivory-100 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-normal">{f.q}</h3>
                  <span className="text-2xl leading-none text-ivory-500 transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
