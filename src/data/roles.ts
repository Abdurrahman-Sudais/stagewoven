import { ClipboardList, Headphones, Lightbulb, Megaphone, Network } from 'lucide-react'

export const roles = [
  {
    icon: ClipboardList,
    title: 'Stage managers',
    body: 'One source of truth for the prompt book. See which cues a rewrite touches before the next run, not during it.',
  },
  {
    icon: Megaphone,
    title: 'Show callers',
    body: 'Every standby and go anchored to the words on the page, with a clear note when a trigger has moved.',
  },
  {
    icon: Lightbulb,
    title: 'Lighting designers',
    body: 'Keep cue intent and timing notes beside the line they belong to, and get flagged when that line changes.',
  },
  {
    icon: Headphones,
    title: 'Sound designers',
    body: 'Track effects, ambiences and follows by scene. Know which sound cues lost their trigger in tonight’s cuts.',
  },
  {
    icon: Network,
    title: 'Production coordinators',
    body: 'See review progress across departments and productions without chasing updates by email.',
  },
]
