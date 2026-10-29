import { Link } from 'react-router-dom'
import { useWorkspace } from '../store'
import { otherProductions, production } from '../seed'
import { ViewHeader } from '../ui'

export default function Productions() {
  const { state } = useWorkspace()
  const open = state.reviews.filter((r) => r.status !== 'Resolved').length
  const rows = [{ id: production.id, title: production.title, venue: production.venue, phase: production.phase, cues: state.cues.length, openReviews: open }, ...otherProductions]
  return (
    <>
      <ViewHeader title="Productions" description="Only The Last Train is interactive in this demo. The other productions are shown for context." />
      <ul className="grid gap-4 md:grid-cols-3">
        {rows.map((p, i) => (
          <li key={p.id} className={`panel p-5 ${i ? 'opacity-70' : 'border-brass-400/30'}`}>
            <p className="font-serif text-2xl text-ivory-50">{p.title}</p>
            <p className="mt-1 text-sm text-ivory-400">{p.venue} · {p.phase}</p>
            <p className="mt-4 text-xs text-ivory-500">{p.cues} cues · {p.openReviews} open reviews</p>
            {i === 0 ? <Link to="/workspace/cues" className="mt-4 inline-block text-sm text-brass-300 hover:text-brass-200">Open cue sheets →</Link> : <p className="mt-4 text-xs text-ivory-600">Not available in demo</p>}
          </li>
        ))}
      </ul>
    </>
  )
}
