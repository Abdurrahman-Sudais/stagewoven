export const company = {
  name: 'Stagewoven',
  domain: 'stagewoven.top',
  url: 'https://stagewoven.top',
  founder: 'Salim Abdulrahman',
  email: 'nneka@stagewoven.top',
  tagline: 'Every cue. Every change. In sync.',
  category: 'Theatre technology, live production software and AI-assisted production management',
}

export interface Person {
  name: string
  initials: string
  role: string
  email?: string
  bio: string
  focus: string[]
}

/** The founding team, credited on the home page, About, Contact and in the footer. */
export const FOUNDERS: Person[] = [
  {
    name: 'Salim Abdulrahman',
    initials: 'SA',
    role: 'Founder/CEO',
    bio: 'Salim founded Stagewoven so production teams can keep every cue in step with a script that keeps changing — and leads product, customers and every pilot.',
    focus: ['Product', 'Productions', 'Pilots'],
  },
  {
    name: 'Yusuf Abdulhamid',
    initials: 'YA',
    role: 'Co-founder/CTO',
    bio: 'Yusuf co-founded Stagewoven and leads its technology — from script parsing and revision comparison to the cue engine and the cloud platform it runs on.',
    focus: ['Script parsing', 'Revision engine', 'Cloud platform'],
  },
]

export const mainNav = [
  { label: 'Problem', to: '/#problem' },
  { label: 'Product', to: '/product' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Technology', to: '/technology' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Team', to: '/about' },
  { label: 'Security', to: '/security' },
]

export const footerNav = [
  {
    heading: 'Product',
    links: [
      { label: 'Overview', to: '/product' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Interactive workspace', to: '/workspace' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    heading: 'Teams',
    links: [
      { label: 'Stage managers', to: '/use-cases#stage-managers' },
      { label: 'Lighting & sound', to: '/use-cases#designers' },
      { label: 'Touring productions', to: '/use-cases#touring' },
      { label: 'Production companies', to: '/use-cases#companies' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About & team', to: '/about' },
      { label: 'Technology (AWS)', to: '/technology' },
      { label: 'Security & safeguards', to: '/security' },
      { label: 'Request early access', to: '/contact?type=demo' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy notice', to: '/privacy' },
      { label: 'Terms of use', to: '/terms' },
    ],
  },
]
