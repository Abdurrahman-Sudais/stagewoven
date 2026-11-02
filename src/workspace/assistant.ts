/**
 * Simulated, record-grounded assistant for the demo workspace.
 * Answers only from the current cues and review queue, and lists the records it used.
 * Refuses to rewrite the script, decide artistic intent, or call the show — those belong to people.
 * No model or external API is called.
 */
import type { Cue, ReviewItem } from './types'
import { team } from './seed'

export interface AssistantContext {
  cues: Cue[]
  reviews: ReviewItem[]
}

export interface AssistantAnswer {
  kind: 'answer' | 'refusal' | 'help'
  title: string
  lines: string[]
  sources: string[]
  links: { label: string; to: string }[]
}

export const EXAMPLE_QUESTIONS = ['Which cues need review?', 'Which lighting cues are still drafts?', 'What happened to SND-005?', 'Who has open reviews?', 'Rewrite scene 2 for me'] as const

const REFUSAL_RE = /\b(rewrite|write (a|the|some)|re-?block|choreograph|design (the|a)|what should .{0,40}\b(look|sound|feel)( like)?|artistic|call the show|go on|cue it live|improve the (script|scene|line))\b/i

const REFUSAL: AssistantAnswer = {
  kind: 'refusal',
  title: 'That’s a creative decision for your team',
  lines: [
    'Stagewoven keeps cues in sync with the script — it shows which cues a rewrite touches and suggests where a trigger might now sit. It does not write or change the script, decide design intent, or call cues live.',
    'I can show which cues lost their trigger, what is still in draft, and who has open reviews.',
  ],
  sources: [],
  links: [{ label: 'Open the review queue', to: '/workspace/review' }],
}

const who = (id?: string) => team.find((t) => t.id === id)?.name ?? 'unassigned'
const DEPT: Record<string, Cue['department']> = { lighting: 'Lighting', lx: 'Lighting', sound: 'Sound', snd: 'Sound', scene: 'Scene Change', sc: 'Scene Change' }

function cueSummary(c: Cue, ctx: AssistantContext): AssistantAnswer {
  const reviews = ctx.reviews.filter((r) => r.cueId === c.id)
  return {
    kind: 'answer',
    title: `${c.id} · ${c.department}`,
    lines: [
      `${c.triggerType} on “${c.trigger}”${c.lineRef ? ` (anchored to ${c.lineRef})` : ' (no script anchor)'}. ${c.instruction}`,
      `Status: ${c.status}. Last updated by ${c.updatedBy}.`,
      ...(reviews.length
        ? reviews.map((r) => `${r.id}: ${r.status}, ${r.priority} priority, ${who(r.assigneeId)} — ${r.reason}${r.suggestedLineRef ? ` Suggested new anchor: ${r.suggestedLineRef}.` : ''}`)
        : ['No reviews are open or recorded for this cue.']),
    ],
    sources: [c.id, ...reviews.map((r) => r.id)],
    links: [{ label: 'Open cue sheets', to: '/workspace/cues' }, ...(reviews.length ? [{ label: 'Open the review queue', to: '/workspace/review' }] : [])],
  }
}

function needsReview(ctx: AssistantContext): AssistantAnswer {
  const open = ctx.reviews.filter((r) => r.status !== 'Resolved')
  return {
    kind: 'answer',
    title: open.length ? `${open.length} cue review${open.length === 1 ? '' : 's'} still open` : 'Every review is resolved',
    lines: open.length ? open.map((r) => `${r.cueId} (${r.priority}): ${r.reason} ${r.status}, ${who(r.assigneeId)}.`) : ['Nothing is waiting. Run a revision comparison on the Scripts page to check the latest rewrite.'],
    sources: open.map((r) => r.cueId),
    links: [{ label: 'Open the review queue', to: '/workspace/review' }],
  }
}

function drafts(ctx: AssistantContext, dept?: Cue['department']): AssistantAnswer {
  const rows = ctx.cues.filter((c) => c.status === 'Draft' && (!dept || c.department === dept))
  return {
    kind: 'answer',
    title: `${rows.length} ${dept ? dept.toLowerCase() + ' ' : ''}cue${rows.length === 1 ? ' is' : 's are'} still in draft`,
    lines: rows.length ? rows.map((c) => `${c.id}: ${c.triggerType} on “${c.trigger}”.`) : ['None — every cue in this group has moved past draft.'],
    sources: rows.map((c) => c.id),
    links: [{ label: 'Open cue sheets', to: '/workspace/cues' }],
  }
}

function workload(ctx: AssistantContext): AssistantAnswer {
  const open = ctx.reviews.filter((r) => r.status !== 'Resolved')
  const rows = team.map((m) => ({ m, n: open.filter((r) => r.assigneeId === m.id) })).filter((x) => x.n.length)
  const unassigned = open.filter((r) => !r.assigneeId)
  return {
    kind: 'answer',
    title: 'Open reviews by person',
    lines: open.length ? [...rows.map((x) => `${x.m.name} (${x.m.role}): ${x.n.map((r) => r.cueId).join(', ')}.`), ...(unassigned.length ? [`Unassigned: ${unassigned.map((r) => r.cueId).join(', ')}.`] : [])] : ['Nobody has an open review right now.'],
    sources: open.map((r) => r.cueId),
    links: [{ label: 'Open the team view', to: '/workspace/team' }],
  }
}

const HELP: AssistantAnswer = {
  kind: 'help',
  title: 'What I can answer',
  lines: ['Ask about a cue (for example “SND-005”), which cues need review, which cues are still drafts (by department), or who has open reviews.', 'I answer from the records in this workspace and list the ones I used.'],
  sources: [],
  links: [],
}

export function answer(question: string, ctx: AssistantContext): AssistantAnswer {
  const q = question.trim()
  if (!q) return HELP
  if (REFUSAL_RE.test(q)) return REFUSAL
  const id = q.toUpperCase().match(/\b(LX|SND|SC)-\d{3}\b/)?.[0]
  if (id) {
    const c = ctx.cues.find((x) => x.id === id)
    return c ? cueSummary(c, ctx) : { kind: 'answer', title: `No cue called ${id}`, lines: ['That ID is not in this workspace.'], sources: [], links: [{ label: 'Open cue sheets', to: '/workspace/cues' }] }
  }
  if (/\b(draft|unfinished|not approved)/i.test(q)) {
    const key = Object.keys(DEPT).find((k) => new RegExp(`\\b${k}\\b`, 'i').test(q))
    return drafts(ctx, key ? DEPT[key] : undefined)
  }
  if (/\b(who|assigned|workload|person|people)\b/i.test(q)) return workload(ctx)
  if (/\b(review|flag|changed|moved|lost|trigger|attention)/i.test(q)) return needsReview(ctx)
  return HELP
}
