/** HubSpot Forms API helpers for the contact / early-access form. */
export interface HubspotConfig {
  portalId: string
  formGuid: string
  marketingSubscriptionTypeId?: string | undefined
}

export function hubspotConfig(env: Record<string, string | undefined> = (import.meta.env ?? {}) as Record<string, string | undefined>): HubspotConfig | null {
  const portalId = env.VITE_HUBSPOT_PORTAL_ID?.trim()
  const formGuid = env.VITE_HUBSPOT_FORM_GUID?.trim()
  if (!portalId || !formGuid) return null
  return { portalId, formGuid, marketingSubscriptionTypeId: env.VITE_HUBSPOT_MARKETING_SUBSCRIPTION_ID?.trim() || undefined }
}

export interface LeadValues {
  name: string
  email: string
  organisation: string
  role: string
  plan: string
  productions: string
  message: string
  enquiryType: 'general' | 'demo'
  marketing: boolean
}

export function leadPayload(v: LeadValues, context: { pageUri: string; pageName: string }, config: Partial<HubspotConfig> = {}) {
  const [first, ...rest] = v.name.trim().split(/\s+/)
  const fields = (
    [
      ['firstname', first],
      ['lastname', rest.join(' ')],
      ['email', v.email.trim()],
      ['company', v.organisation.trim()],
      ['jobtitle', v.role],
      ['productions_per_year', v.productions],
      ['plan_of_interest', v.plan],
      ['enquiry_type', v.enquiryType],
      ['enquiry_message', v.message.trim()],
    ] as const
  )
    .filter(([, val]) => val)
    .map(([name, value]) => ({ objectTypeId: '0-1', name, value }))
  return {
    fields,
    context,
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: 'I agree that Stagewoven may contact me about this request.',
        communications: v.marketing && config.marketingSubscriptionTypeId ? [{ value: true, subscriptionTypeId: Number(config.marketingSubscriptionTypeId), text: 'Send me occasional product updates.' }] : [],
      },
    },
  }
}
