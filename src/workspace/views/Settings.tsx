import { Button } from '../../components/ui/Button'
import { useWorkspace } from '../store'
import { SimulatedNotice, ViewHeader } from '../ui'
import { useWorkspaceUi } from '../uiContext'

const integrations = [
  { name: 'Script comparison service', body: 'The demo uses a local, rule-based comparison of seeded drafts.' },
  { name: 'Rehearsal transcription provider', body: 'Speech-to-text for rehearsal recordings. Not connected.' },
]

export default function Settings() {
  const { state, dispatch } = useWorkspace()
  const { toast } = useWorkspaceUi()
  return (
    <>
      <ViewHeader title="Settings" description="Demo preferences and integrations." />
      <div className="space-y-4">
        <section className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm text-ivory-50">Save demo changes in this browser</h2>
            <p className="mt-1 text-sm text-ivory-400">Uses localStorage. Nothing leaves your device.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-ivory-200">
            <input type="checkbox" className="h-4 w-4 accent-brass-400" checked={state.persist} onChange={(e) => dispatch({ type: 'SET_PERSIST', persist: e.target.checked })} />
            {state.persist ? 'On' : 'Off'}
          </label>
        </section>
        <section className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm text-ivory-50">Reset sample production</h2>
            <p className="mt-1 text-sm text-ivory-400">Restore The Last Train to its original cues and clear the review queue.</p>
          </div>
          <Button variant="danger" onClick={() => { dispatch({ type: 'RESET' }); toast('Demo data reset.') }}>Reset demo data</Button>
        </section>
        <section className="panel p-5">
          <h2 className="text-sm text-ivory-50">Integrations</h2>
          <ul className="mt-4 divide-y divide-ivory-50/[0.06]">
            {integrations.map((i) => (
              <li key={i.name} className="flex items-center justify-between gap-4 py-3">
                <div><p className="text-sm text-ivory-200">{i.name}</p><p className="text-xs text-ivory-500">{i.body}</p></div>
                <span className="rounded-full border border-ivory-50/10 px-2.5 py-0.5 text-xs text-ivory-400">Not connected</span>
              </li>
            ))}
          </ul>
          <SimulatedNotice className="mt-4">Stagewoven does not connect to lighting desks, sound consoles or show control equipment.</SimulatedNotice>
        </section>
      </div>
    </>
  )
}
