import { useWorkspace } from '../store'
import { team } from '../seed'
import { Avatar, ViewHeader } from '../ui'

export default function Team() {
  const { state } = useWorkspace()
  return (
    <>
      <ViewHeader title="Team" description="The production team for The Last Train and the reviews assigned to each person." />
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {team.map((m) => {
          const assigned = state.reviews.filter((r) => r.assigneeId === m.id && r.status !== 'Resolved').length
          const owned = state.cues.filter((c) => c.department === m.department).length
          return (
            <li key={m.id} className="panel flex items-center gap-4 p-5">
              <Avatar initials={m.initials} className="h-11 w-11 text-xs" />
              <div className="min-w-0 flex-1">
                <p className="text-ivory-50">{m.name}</p>
                <p className="truncate text-xs text-ivory-400">{m.role}</p>
                <p className="mt-1 text-xs text-ivory-500">{assigned} open review{assigned === 1 ? '' : 's'}{owned ? ` · ${owned} ${m.department.toLowerCase()} cues` : ''}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
