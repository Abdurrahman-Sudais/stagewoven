export type Department = 'Lighting' | 'Sound' | 'Scene Change'
export type CueStatus = 'Draft' | 'Approved' | 'Needs Review' | 'Reviewed'
export type Priority = 'High' | 'Medium' | 'Low'
export type TriggerType = 'Line' | 'Action' | 'Visual' | 'Follow'

export type Scene = {
  id: string
  number: number
  title: string
  setting: string
  runningTime: string
}

export type ScriptLine = {
  id: string
  sceneId: string
  kind: 'heading' | 'direction' | 'dialogue'
  character?: string
  text: string
}

export type ScriptRevision = {
  id: string
  label: string
  date: string
  author: string
  note: string
  lines: ScriptLine[]
}

export type Cue = {
  id: string
  department: Department
  sceneId: string
  triggerType: TriggerType
  trigger: string
  /** Script line the trigger is anchored to, if any. */
  lineRef?: string
  instruction: string
  status: CueStatus
  updatedAt: string
  updatedBy: string
}

export type ReviewStatus = 'Open' | 'In Review' | 'Resolved'

export type ReviewItem = {
  id: string
  cueId: string
  priority: Priority
  status: ReviewStatus
  source: 'Revision comparison' | 'Manual flag'
  reason: string
  /** Script line that changed, and how, when flagged by a comparison. */
  changedLineRef?: string
  change?: 'removed' | 'modified'
  /** Revised-script line suggested as a new anchor, if one was found. */
  suggestedLineRef?: string
  assigneeId?: string
  createdAt: string
  resolution?: string
}

export type TeamMember = {
  id: string
  name: string
  role: string
  department: Department | 'Stage Management' | 'Production'
  initials: string
}

export type Activity = {
  id: string
  at: string
  text: string
}
