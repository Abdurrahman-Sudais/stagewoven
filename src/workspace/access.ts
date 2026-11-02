import { team } from './seed'

/** Demo roles. In production these are identity-provider groups, checked again on the server. */
export type DemoRole = 'psm' | 'dsm' | 'designer' | 'coordinator'
export type Action = 'compare' | 'cues' | 'flag' | 'assign' | 'apply' | 'review' | 'approve' | 'audit'

export const ROLE_LABEL: Record<DemoRole, string> = {
  psm: 'Production stage manager',
  dsm: 'Deputy stage manager',
  designer: 'Designer / head of department',
  coordinator: 'Production coordinator',
}

export const ACTION_LABEL: Record<Action, string> = {
  compare: 'Compare script revisions',
  cues: 'Add, edit and set cue status',
  flag: 'Flag cues for review',
  assign: 'Assign reviews',
  apply: 'Move a cue to a suggested trigger',
  review: 'Mark reviewed or reopen',
  approve: 'Approve revised cues',
  audit: 'Read and export the audit log',
}

export const ACTIONS = Object.keys(ACTION_LABEL) as Action[]

const MATRIX: Record<DemoRole, Action[]> = {
  psm: ACTIONS,
  dsm: ['compare', 'cues', 'flag', 'apply', 'review'],
  designer: ['cues', 'flag', 'review'],
  coordinator: ['assign'],
}

export const MEMBER_ROLE: Record<string, DemoRole> = {
  ama: 'psm',
  dan: 'dsm',
  priya: 'designer',
  tomas: 'designer',
  kofi: 'designer',
  hannah: 'coordinator',
}

export const roleOf = (id: string): DemoRole => MEMBER_ROLE[id] ?? 'coordinator'
export const can = (role: DemoRole, action: Action) => MATRIX[role].includes(action)
export const memberName = (id: string) => team.find((t) => t.id === id)?.name ?? id

export interface AuditEntry {
  id: string
  at: string
  userId: string
  action: Action
  detail: string
}
