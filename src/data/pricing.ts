/**
 * Illustrative pricing. These figures are proposed examples, not verified
 * commercial offers. Edit this file to change every price shown on the site.
 */
export const ANNUAL_DISCOUNT = 0.2

export type PricingTier = {
  id: string
  name: string
  monthly: number | null
  summary: string
  cta: { label: string; to: string }
  featured?: boolean
  features: string[]
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'solo',
    name: 'Solo Production',
    monthly: 29,
    summary: 'For small productions managing scripts and cue sheets.',
    cta: { label: 'Start with Solo', to: '/contact?type=demo&plan=solo' },
    features: [
      '1 active production',
      'Up to 3 collaborators',
      'Script import and cue-to-line references',
      'Lighting, sound and scene-change cue sheets',
      'Revision comparison for uploaded scripts',
      'PDF and CSV cue-sheet export',
    ],
  },
  {
    id: 'team',
    name: 'Production Team',
    monthly: 99,
    summary: 'For teams coordinating multiple departments and revision workflows.',
    cta: { label: 'Talk to us about Team', to: '/contact?type=demo&plan=team' },
    featured: true,
    features: [
      'Up to 5 active productions',
      'Up to 25 collaborators',
      'Everything in Solo Production',
      'Review queue with assignments and priorities',
      'Suggested cue locations after script changes',
      'Department permissions and sign-off history',
      'Rehearsal transcript import (integration-dependent)',
    ],
  },
  {
    id: 'company',
    name: 'Production Company',
    monthly: null,
    summary: 'For organisations managing multiple productions and teams.',
    cta: { label: 'Contact sales', to: '/contact?type=demo&plan=company' },
    features: [
      'Unlimited productions and seasons',
      'Organisation-wide templates and cue conventions',
      'SSO and audit history',
      'Touring and remount version management',
      'Onboarding for stage management teams',
      'Priority support with agreed response times',
    ],
  },
]

export function priceFor(tier: PricingTier, billing: 'monthly' | 'annual') {
  if (tier.monthly === null) return null
  return billing === 'annual' ? Math.round(tier.monthly * (1 - ANNUAL_DISCOUNT)) : tier.monthly
}
