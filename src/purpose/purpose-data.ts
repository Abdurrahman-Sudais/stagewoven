// Purpose story for the home page: why Stagewoven exists, what changes, what we believe and where it is going.
import { FOUNDERS } from '../data/site'

export default {
  name: 'Stagewoven',
  eyebrow: 'Why Stagewoven exists',
  manifesto:
    'A show is hundreds of small promises kept in the dark: the light that rises on a word, the sound that lands on a door slam, the wall that moves on a breath. When the script changes, every one of those promises has to move with it. We believe no cue should be left behind by a rewrite.',
  purpose:
    'Stagewoven exists to keep every cue anchored to the script it serves, so that when the words change, the people who run the show know exactly what to look at before the next run.',
  why: 'Rewrites are how good shows get made. The trouble is the routes the news travels by: a margin note, a group message, a cue sheet updated by one department and not another. The cost lands in tech week and in front of an audience.',
  stakesTitle: 'The nights that depend on getting it right.',
  stats: [
    { value: 17.1, dec: 1, suffix: 'M', label: 'people attended West End shows in 2023, a record year for London theatre.', source: 'Society of London Theatre, via WhatsOnStage', url: 'https://www.whatsonstage.com/news/west-end-attendance-data-for-2024-released_1672264' },
    { value: 1.54, dec: 2, prefix: '$', suffix: 'bn', label: 'grossed by Broadway shows in the 2023–24 season, across thousands of performances run cue by cue.', source: 'The Broadway League (2024)', url: 'https://www.broadwayleague.com/press/press-releases/broadways-2023-2024-end-of-season-statistics-reveal-123-million-attendances-and-grosses-of-154-billion/' },
    { value: 892.9, dec: 1, prefix: '£', suffix: 'M', label: 'in London theatre box office revenue in 2022, the year audiences returned in force.', source: 'Society of London Theatre', url: 'https://solt.co.uk/box-office-2022-data-london-theatres-ticket-pricing-stays-consistent-despite-rising-costs/' },
  ],
  statsNote: 'Published industry figures from the sources linked. They show the scale of live performance, not Stagewoven results.',
  changeTitle: 'From four copies of the truth to one script everyone trusts.',
  before: [
    'Cue sheets kept separately by every department',
    'Rewrites passed on by message, if they are passed on',
    'Orphaned cues discovered at the technical rehearsal',
    'Nobody sure which version of the script is current',
  ],
  after: [
    'Every cue anchored to the line that triggers it',
    'Each rewrite compared against the last draft automatically',
    'Affected cues routed to the right department for review',
    'One current script, with every change on the record',
  ],
  principlesTitle: 'What we believe about running a show.',
  principles: [
    ['The script is the source of truth', 'Cues belong to lines, not to spreadsheets that drift away from them.'],
    ['Change is normal', 'Rewrites are part of the craft. Tools should make them safe, not discourage them.'],
    ['People call the show', 'Stagewoven suggests new anchors; a designer or stage manager accepts every one.'],
    ['Every department, one view', 'Lighting, sound and scenery see the same change at the same moment.'],
    ['Nothing hidden', 'Every suggestion shows what changed and why it was flagged.'],
    ['Fit the rehearsal room', 'Fast enough to use between notes, simple enough to trust at the half.'],
  ],
  letterTitle: 'Why we are building Stagewoven.',
  letter: [
    'We have watched a single cut line ripple through a production: a sound cue that lost its trigger, a lighting state that fired a beat early, a scene change that waited for a line nobody would say again. No one was careless. The information simply travelled by too many routes.',
    'Stagewoven is our answer: one workspace where every cue is tied to the words it serves, every new draft is compared with the last, and every affected cue reaches the person responsible before the next run.',
    'We are building it with the people who make live performance happen, starting small with a single production and earning trust one rehearsal at a time. The show should be the only thing that surprises an audience.',
  ],
  founders: FOUNDERS.map((f) => ({ name: f.name, role: f.role })),
  visionTitle: 'Where Stagewoven is going.',
  visionIntro: 'A careful path from one production to the whole season.',
  vision: [
    { stage: 'Now', title: 'Prototype and pilots', text: 'An interactive workspace on sample productions, and early conversations with production teams.' },
    { stage: 'Next', title: 'One production, end to end', text: 'Script import, cue anchoring, revision comparison and department review on a live rehearsal process.' },
    { stage: 'Then', title: 'Show control links', text: 'Exporting reviewed cue lists to the consoles and playback systems departments already use.' },
    { stage: 'Later', title: 'A season in sync', text: 'Shared cue libraries, touring adaptations and a production record that outlives the run.' },
  ],
}
