import type { Cue, ReviewItem, Scene, ScriptLine, ScriptRevision, TeamMember } from './types'

export const production = {
  id: 'last-train',
  title: 'The Last Train',
  company: 'Northlight Theatre Company',
  venue: 'The Corn Exchange Studio',
  phase: 'Technical rehearsals',
  firstPreview: '2026-11-14',
  pressNight: '2026-11-19',
}

export const otherProductions = [
  { id: 'salt-house', title: 'Salt House', venue: 'Riverside Playhouse', phase: 'Pre-production', cues: 0, openReviews: 0 },
  { id: 'paper-moons', title: 'Paper Moons (UK tour)', venue: '6 venues', phase: 'On tour — week 3', cues: 212, openReviews: 2 },
]

export const scenes: Scene[] = [
  { id: 's1', number: 1, title: 'The Waiting Room', setting: 'Platform 4 waiting room, 11:32 p.m.', runningTime: '14 min' },
  { id: 's2', number: 2, title: 'Platform Four', setting: 'The open platform, rain', runningTime: '11 min' },
  { id: 's3', number: 3, title: 'The Last Carriage', setting: 'Inside the final carriage', runningTime: '17 min' },
]

export const team: TeamMember[] = [
  { id: 'ama', name: 'Ama Osei', role: 'Production Stage Manager', department: 'Stage Management', initials: 'AO' },
  { id: 'dan', name: 'Daniel Reyes', role: 'Deputy Stage Manager (show caller)', department: 'Stage Management', initials: 'DR' },
  { id: 'priya', name: 'Priya Nair', role: 'Lighting Designer', department: 'Lighting', initials: 'PN' },
  { id: 'tomas', name: 'Tomás Varga', role: 'Sound Designer', department: 'Sound', initials: 'TV' },
  { id: 'kofi', name: 'Kofi Mensah', role: 'Head of Stage', department: 'Scene Change', initials: 'KM' },
  { id: 'hannah', name: 'Hannah Cole', role: 'Production Coordinator', department: 'Production', initials: 'HC' },
]

const s1: ScriptLine[] = [
  { id: 'L1-01', sceneId: 's1', kind: 'heading', text: 'SCENE 1 — THE WAITING ROOM' },
  { id: 'L1-02', sceneId: 's1', kind: 'direction', text: 'A station waiting room after hours. One bench, one clock, one radiator that ticks. MARA sweeps. ELIAS enters with a suitcase, soaked.' },
  { id: 'L1-03', sceneId: 's1', kind: 'dialogue', character: 'MARA', text: 'Nobody waits this late for the 11:40.' },
  { id: 'L1-04', sceneId: 's1', kind: 'dialogue', character: 'ELIAS', text: "Then I'm nobody. Is it running?" },
  { id: 'L1-05', sceneId: 's1', kind: 'direction', text: 'ELIAS drops the suitcase. It lands harder than it should.' },
  { id: 'L1-06', sceneId: 's1', kind: 'dialogue', character: 'MARA', text: "It runs when it wants. Sit. The radiator's the only warm thing left." },
  { id: 'L1-07', sceneId: 's1', kind: 'dialogue', character: 'ELIAS', text: 'I was told to be here before midnight.' },
  { id: 'L1-08', sceneId: 's1', kind: 'dialogue', character: 'MARA', text: 'Everyone is. Come on. Out to the platform.' },
]

const s2v1: ScriptLine[] = [
  { id: 'L2-01', sceneId: 's2', kind: 'heading', text: 'SCENE 2 — PLATFORM FOUR' },
  { id: 'L2-02', sceneId: 's2', kind: 'direction', text: 'The open platform. Sodium lamps buzz overhead. MARA stands at the edge with a lantern.' },
  { id: 'L2-03', sceneId: 's2', kind: 'dialogue', character: 'MARA', text: 'There. You see it? Down past the signal box.' },
  { id: 'L2-04', sceneId: 's2', kind: 'dialogue', character: 'ELIAS', text: 'I see nothing but rain.' },
  { id: 'L2-05', sceneId: 's2', kind: 'direction', text: 'A low rumble builds beneath the stage.' },
  { id: 'L2-06', sceneId: 's2', kind: 'dialogue', character: 'ELIAS', text: 'The train has arrived.' },
  { id: 'L2-07', sceneId: 's2', kind: 'dialogue', character: 'MARA', text: "It always arrives for someone. Tonight it's you." },
  { id: 'L2-08', sceneId: 's2', kind: 'direction', text: 'Steam rolls across the platform. The doors hiss open.' },
  { id: 'L2-09', sceneId: 's2', kind: 'dialogue', character: 'ELIAS', text: "And if I don't get on?" },
  { id: 'L2-10', sceneId: 's2', kind: 'dialogue', character: 'MARA', text: "Then you'll wait here with me. Forever, most likely." },
]

const s2v2: ScriptLine[] = [
  s2v1[0],
  s2v1[1],
  s2v1[2],
  s2v1[3],
  s2v1[4],
  { id: 'L2-06a', sceneId: 's2', kind: 'direction', text: 'ELIAS steps towards the edge, silent. The rumble swells.' },
  { id: 'L2-07', sceneId: 's2', kind: 'dialogue', character: 'MARA', text: "It always comes for someone. Tonight, it's you." },
  s2v1[7],
  s2v1[8],
  s2v1[9],
]

const s3: ScriptLine[] = [
  { id: 'L3-01', sceneId: 's3', kind: 'heading', text: 'SCENE 3 — THE LAST CARRIAGE' },
  { id: 'L3-02', sceneId: 's3', kind: 'direction', text: 'Inside the final carriage. Seats in two rows. The windows show nothing at all.' },
  { id: 'L3-03', sceneId: 's3', kind: 'dialogue', character: 'ELIAS', text: 'Where does it stop?' },
  { id: 'L3-04', sceneId: 's3', kind: 'dialogue', character: 'CONDUCTOR', text: 'Wherever you finally sit still.' },
  { id: 'L3-05', sceneId: 's3', kind: 'direction', text: 'The carriage lurches. The lights stutter twice.' },
  { id: 'L3-06', sceneId: 's3', kind: 'dialogue', character: 'ELIAS', text: 'Mara? Mara, are you on board?' },
  { id: 'L3-07', sceneId: 's3', kind: 'direction', text: 'ELIAS sits. For the first time, he puts the suitcase down gently.' },
  { id: 'L3-08', sceneId: 's3', kind: 'dialogue', character: 'CONDUCTOR', text: 'Next stop, the morning.' },
]

export const revisions: ScriptRevision[] = [
  {
    id: 'rev-3',
    label: 'Rehearsal draft 3',
    date: '2026-10-21',
    author: 'Ama Osei',
    note: 'Locked for the first technical rehearsal.',
    lines: [...s1, ...s2v1, ...s3],
  },
  {
    id: 'rev-4',
    label: 'Rehearsal draft 4',
    date: '2026-10-26',
    author: 'Ama Osei',
    note: "Director's cut from Monday rehearsal: the arrival plays in silence. Mara's reply reworded.",
    lines: [...s1, ...s2v2, ...s3],
  },
]

const d = (day: number, time: string) => `2026-10-${String(day).padStart(2, '0')}T${time}:00`

export const seedCues: Cue[] = [
  { id: 'LX-001', department: 'Lighting', sceneId: 's1', triggerType: 'Visual', trigger: 'Pre-show announcement ends', instruction: 'House to half over 5s, then out over 3s. Cold blue wash up on the waiting room.', status: 'Approved', updatedAt: d(20, '14:10'), updatedBy: 'Priya Nair' },
  { id: 'SND-001', department: 'Sound', sceneId: 's1', triggerType: 'Follow', trigger: 'Follows LX-001 at full', instruction: 'Station ambience loop (rain on glass, distant tannoy) fades in over 8s.', status: 'Approved', updatedAt: d(20, '14:22'), updatedBy: 'Tomás Varga' },
  { id: 'LX-004', department: 'Lighting', sceneId: 's1', triggerType: 'Line', trigger: 'MARA: “Nobody waits this late for the 11:40.”', lineRef: 'L1-03', instruction: 'Practical clock lamp flickers once on “11:40”.', status: 'Approved', updatedAt: d(21, '10:05'), updatedBy: 'Priya Nair' },
  { id: 'SND-005', department: 'Sound', sceneId: 's1', triggerType: 'Action', trigger: 'Elias drops the suitcase', lineRef: 'L1-05', instruction: 'Heavy suitcase thud, reinforced from the stage-left foldback.', status: 'Draft', updatedAt: d(24, '16:40'), updatedBy: 'Tomás Varga' },
  { id: 'SC-001', department: 'Scene Change', sceneId: 's1', triggerType: 'Line', trigger: 'MARA: “Out to the platform.”', lineRef: 'L1-08', instruction: 'Bench trucks downstage to the platform edge. Waiting-room flats fly out on a 6-count.', status: 'Approved', updatedAt: d(21, '11:30'), updatedBy: 'Kofi Mensah' },
  { id: 'LX-009', department: 'Lighting', sceneId: 's1', triggerType: 'Follow', trigger: 'Follows SC-001 when flats are clear', instruction: 'Crossfade to the platform state over 4s. Rain gobo on the floor.', status: 'Approved', updatedAt: d(21, '11:42'), updatedBy: 'Priya Nair' },

  { id: 'LX-012', department: 'Lighting', sceneId: 's2', triggerType: 'Line', trigger: 'MARA: “There. You see it?”', lineRef: 'L2-03', instruction: 'Sodium lamp specials buzz up to 70% over 2s.', status: 'Approved', updatedAt: d(22, '09:15'), updatedBy: 'Priya Nair' },
  { id: 'SND-012', department: 'Sound', sceneId: 's2', triggerType: 'Action', trigger: 'Low rumble begins (stage direction)', lineRef: 'L2-05', instruction: 'Sub-bass rumble builds over 10s from under-stage speakers.', status: 'Approved', updatedAt: d(22, '09:40'), updatedBy: 'Tomás Varga' },
  { id: 'SND-014', department: 'Sound', sceneId: 's2', triggerType: 'Line', trigger: 'Character says, “The train has arrived.”', lineRef: 'L2-06', instruction: 'Play the arriving train sound effect.', status: 'Approved', updatedAt: d(22, '10:02'), updatedBy: 'Tomás Varga' },
  { id: 'LX-021', department: 'Lighting', sceneId: 's2', triggerType: 'Line', trigger: 'ELIAS: “The train has arrived.”', lineRef: 'L2-06', instruction: 'Headlight special sweeps across the platform from stage right over 3s.', status: 'Approved', updatedAt: d(22, '10:10'), updatedBy: 'Priya Nair' },
  { id: 'LX-022', department: 'Lighting', sceneId: 's2', triggerType: 'Line', trigger: 'MARA: “…Tonight it’s you.”', lineRef: 'L2-07', instruction: 'Tighten to Mara and Elias; platform drops to 30%.', status: 'Approved', updatedAt: d(22, '10:18'), updatedBy: 'Priya Nair' },
  { id: 'SND-016', department: 'Sound', sceneId: 's2', triggerType: 'Action', trigger: 'Steam rolls across the platform', lineRef: 'L2-08', instruction: 'Door hiss and steam release, centre cluster. Haze cue called with this.', status: 'Approved', updatedAt: d(22, '10:30'), updatedBy: 'Tomás Varga' },
  { id: 'SC-004', department: 'Scene Change', sceneId: 's2', triggerType: 'Line', trigger: 'MARA: “Forever, most likely.”', lineRef: 'L2-10', instruction: 'Carriage wagon tracks on from upstage left. Platform edge strikes in blackout.', status: 'Draft', updatedAt: d(25, '15:05'), updatedBy: 'Kofi Mensah' },

  { id: 'LX-030', department: 'Lighting', sceneId: 's3', triggerType: 'Follow', trigger: 'Follows SC-004 when wagon is spiked', instruction: 'Carriage interior fluorescent state; windows dark.', status: 'Approved', updatedAt: d(23, '13:00'), updatedBy: 'Priya Nair' },
  { id: 'SND-020', department: 'Sound', sceneId: 's3', triggerType: 'Follow', trigger: 'Follows LX-030', instruction: 'Rolling-stock interior loop, low, centre and surrounds.', status: 'Approved', updatedAt: d(23, '13:12'), updatedBy: 'Tomás Varga' },
  { id: 'LX-034', department: 'Lighting', sceneId: 's3', triggerType: 'Action', trigger: 'The carriage lurches', lineRef: 'L3-05', instruction: 'Two fluorescent stutters, 0.4s each, as rehearsed.', status: 'Reviewed', updatedAt: d(25, '17:20'), updatedBy: 'Daniel Reyes' },
  { id: 'SND-024', department: 'Sound', sceneId: 's3', triggerType: 'Line', trigger: 'CONDUCTOR: “Next stop, the morning.”', lineRef: 'L3-08', instruction: 'Brakes and long whistle, fade over 12s into silence.', status: 'Draft', updatedAt: d(26, '09:00'), updatedBy: 'Tomás Varga' },
  { id: 'SC-006', department: 'Scene Change', sceneId: 's3', triggerType: 'Follow', trigger: 'Follows SND-024 at silence', instruction: 'Final blackout. House curtain in on a slow 10-count.', status: 'Approved', updatedAt: d(23, '13:40'), updatedBy: 'Kofi Mensah' },
]

export const seedReviews: ReviewItem[] = [
  {
    id: 'RV-101',
    cueId: 'SND-024',
    priority: 'Low',
    status: 'Open',
    source: 'Manual flag',
    reason: 'Director asked to try the whistle shorter in Thursday’s run. Confirm the final fade time with the show caller.',
    assigneeId: 'tomas',
    createdAt: d(26, '09:05'),
  },
]
