import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Activity, Cue, CueStatus, Priority, ReviewItem } from './types'
import type { CueFinding } from './compare'
import { describeLine } from './compare'
import { revisions, seedCues, seedReviews, team } from './seed'

const STORAGE_KEY = 'stagewoven-demo-v1'

export type WorkspaceState = {
  cues: Cue[]
  reviews: ReviewItem[]
  comparedAt?: string
  activity: Activity[]
  persist: boolean
}

type Action =
  | { type: 'RUN_COMPARISON'; findings: CueFinding[] }
  | { type: 'SAVE_CUE'; cue: Cue; isNew: boolean }
  | { type: 'SET_CUE_STATUS'; cueId: string; status: CueStatus }
  | { type: 'FLAG_CUE'; cueId: string; reason: string; priority: Priority }
  | { type: 'ASSIGN'; reviewId: string; assigneeId: string }
  | { type: 'APPLY_SUGGESTION'; reviewId: string }
  | { type: 'MARK_REVIEWED'; reviewId: string }
  | { type: 'APPROVE'; reviewId: string }
  | { type: 'REOPEN'; reviewId: string }
  | { type: 'SET_PERSIST'; persist: boolean }
  | { type: 'RESET' }

const ME = 'Ama Osei'
const now = () => new Date().toISOString()
let counter = 0
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`

function initialState(persist = true): WorkspaceState {
  return {
    cues: seedCues,
    reviews: seedReviews,
    activity: [{ id: 'a0', at: '2026-10-26T09:05:00', text: 'Tomás Varga flagged SND-024 for a fade-time check.' }],
    persist,
  }
}

function load(): WorkspaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as WorkspaceState
      if (Array.isArray(parsed.cues) && Array.isArray(parsed.reviews)) return parsed
    }
  } catch {
    /* storage unavailable or corrupt: fall back to seed data */
  }
  return initialState()
}

function log(state: WorkspaceState, text: string): Activity[] {
  return [{ id: uid('a'), at: now(), text }, ...state.activity].slice(0, 40)
}

const lineById = new Map(revisions.flatMap((r) => r.lines).map((l) => [l.id, l]))

function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case 'RUN_COMPARISON': {
      const added: ReviewItem[] = []
      const flagged = new Set<string>()
      for (const f of action.findings) {
        const existing = state.reviews.find((r) => r.cueId === f.cue.id && r.source === 'Revision comparison' && r.status !== 'Resolved')
        if (existing) continue
        added.push({
          id: uid('RV'),
          cueId: f.cue.id,
          priority: f.priority,
          status: 'Open',
          source: 'Revision comparison',
          reason: f.reason,
          suggestedLineRef: f.suggestedLine?.id,
          changedLineRef: f.line.id,
          change: f.change,
          createdAt: now(),
        })
        flagged.add(f.cue.id)
      }
      const reviews = [...added, ...state.reviews]
      const cues = state.cues.map((c) => (flagged.has(c.id) ? { ...c, status: 'Needs Review' as const, updatedAt: now(), updatedBy: 'Revision comparison' } : c))
      return {
        ...state,
        cues,
        reviews,
        comparedAt: now(),
        activity: log(
          state,
          flagged.size
            ? `Compared draft 3 with draft 4. ${flagged.size} cue${flagged.size > 1 ? 's' : ''} added to the review queue.`
            : 'Compared draft 3 with draft 4. No new cues needed review.',
        ),
      }
    }
    case 'SAVE_CUE': {
      const cue = { ...action.cue, updatedAt: now(), updatedBy: ME }
      const cues = action.isNew ? [...state.cues, cue] : state.cues.map((c) => (c.id === cue.id ? cue : c))
      return { ...state, cues, activity: log(state, `${ME} ${action.isNew ? 'added' : 'edited'} ${cue.id}.`) }
    }
    case 'SET_CUE_STATUS':
      return {
        ...state,
        cues: state.cues.map((c) => (c.id === action.cueId ? { ...c, status: action.status, updatedAt: now(), updatedBy: ME } : c)),
        activity: log(state, `${ME} set ${action.cueId} to ${action.status}.`),
      }
    case 'FLAG_CUE':
      return {
        ...state,
        cues: state.cues.map((c) => (c.id === action.cueId ? { ...c, status: 'Needs Review', updatedAt: now(), updatedBy: ME } : c)),
        reviews: [
          { id: uid('RV'), cueId: action.cueId, priority: action.priority, status: 'Open', source: 'Manual flag', reason: action.reason, createdAt: now() },
          ...state.reviews,
        ],
        activity: log(state, `${ME} flagged ${action.cueId} for review.`),
      }
    case 'ASSIGN': {
      const member = team.find((m) => m.id === action.assigneeId)
      const review = state.reviews.find((r) => r.id === action.reviewId)
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === action.reviewId ? { ...r, assigneeId: action.assigneeId, status: r.status === 'Resolved' ? r.status : 'In Review' } : r,
        ),
        activity: log(state, `${ME} assigned the ${review?.cueId} review to ${member?.name ?? 'a team member'}.`),
      }
    }
    case 'APPLY_SUGGESTION': {
      const review = state.reviews.find((r) => r.id === action.reviewId)
      const line = review?.suggestedLineRef ? lineById.get(review.suggestedLineRef) : undefined
      if (!review || !line) return state
      return {
        ...state,
        cues: state.cues.map((c) =>
          c.id === review.cueId
            ? { ...c, lineRef: line.id, triggerType: line.kind === 'dialogue' ? 'Line' : 'Action', trigger: describeLine(line), updatedAt: now(), updatedBy: ME }
            : c,
        ),
        activity: log(state, `${ME} moved ${review.cueId} to the suggested trigger at ${line.id}.`),
      }
    }
    case 'MARK_REVIEWED':
    case 'APPROVE': {
      const review = state.reviews.find((r) => r.id === action.reviewId)
      if (!review) return state
      const status: CueStatus = action.type === 'APPROVE' ? 'Approved' : 'Reviewed'
      const resolution = action.type === 'APPROVE' ? `Revised cue approved by ${ME}.` : `Marked as reviewed by ${ME}; awaiting final approval.`
      return {
        ...state,
        cues: state.cues.map((c) => (c.id === review.cueId ? { ...c, status, updatedAt: now(), updatedBy: ME } : c)),
        reviews: state.reviews.map((r) => (r.id === review.id ? { ...r, status: 'Resolved', resolution } : r)),
        activity: log(state, `${ME} ${action.type === 'APPROVE' ? 'approved the revised' : 'marked as reviewed'} ${review.cueId}.`),
      }
    }
    case 'REOPEN': {
      const review = state.reviews.find((r) => r.id === action.reviewId)
      if (!review) return state
      return {
        ...state,
        cues: state.cues.map((c) => (c.id === review.cueId ? { ...c, status: 'Needs Review', updatedAt: now(), updatedBy: ME } : c)),
        reviews: state.reviews.map((r) => (r.id === review.id ? { ...r, status: r.assigneeId ? 'In Review' : 'Open', resolution: undefined } : r)),
        activity: log(state, `${ME} reopened the ${review.cueId} review.`),
      }
    }
    case 'SET_PERSIST':
      return { ...state, persist: action.persist }
    case 'RESET':
      return initialState(state.persist)
  }
}

type Ctx = { state: WorkspaceState; dispatch: React.Dispatch<Action> }
const WorkspaceContext = createContext<Ctx | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      if (state.persist) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* private mode or quota: the demo still works in memory */
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}

export function nextCueId(cues: Cue[], department: Cue['department']) {
  const prefix = department === 'Lighting' ? 'LX' : department === 'Sound' ? 'SND' : 'SC'
  const max = cues
    .filter((c) => c.id.startsWith(prefix + '-'))
    .reduce((m, c) => Math.max(m, parseInt(c.id.split('-')[1], 10) || 0), 0)
  return `${prefix}-${String(max + 1).padStart(3, '0')}`
}
