import { describe, expect, it } from 'vitest'
import { seedCues, seedReviews } from '../seed'
import { EXAMPLE_QUESTIONS, answer } from '../assistant'
import { ACTIONS, MEMBER_ROLE, can } from '../access'
import { team } from '../seed'

const c = { cues: seedCues, reviews: seedReviews }

describe('grounded assistant', () => {
  it('answers every example question', () => {
    for (const q of EXAMPLE_QUESTIONS) expect(answer(q, c).lines.length).toBeGreaterThan(0)
  })
  it('refuses creative and live-show decisions', () => {
    for (const q of ['Rewrite scene 2 for me', 'What should the storm sound like?', 'Call the show tonight']) expect(answer(q, c).kind).toBe('refusal')
  })
  it('summarises a cue from its records', () => {
    expect(answer('What happened to SND-005?', c).sources[0]).toBe('SND-005')
  })
  it('falls back to help', () => {
    expect(answer('What is the weather?', c).kind).toBe('help')
  })
})

describe('demo roles', () => {
  it('gives the production stage manager everything', () => {
    for (const a of ACTIONS) expect(can('psm', a)).toBe(true)
  })
  it('keeps approval and the audit log with the PSM', () => {
    for (const r of ['dsm', 'designer', 'coordinator'] as const) {
      expect(can(r, 'approve')).toBe(false)
      expect(can(r, 'audit')).toBe(false)
    }
    expect(can('coordinator', 'cues')).toBe(false)
    expect(can('designer', 'cues')).toBe(true)
  })
  it('assigns a role to every team member', () => {
    for (const m of team) expect(MEMBER_ROLE[m.id]).toBeDefined()
  })
})
