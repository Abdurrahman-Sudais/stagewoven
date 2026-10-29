import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { describeLine } from './compare'
import { nextCueId, useWorkspace } from './store'
import { revisions, scenes } from './seed'
import type { Cue, CueStatus, Department, TriggerType } from './types'

const departments: Department[] = ['Lighting', 'Sound', 'Scene Change']
const statuses: CueStatus[] = ['Draft', 'Needs Review', 'Reviewed', 'Approved']
const triggerTypes: TriggerType[] = ['Line', 'Action', 'Visual', 'Follow']
const currentLines = revisions[revisions.length - 1].lines

export function CueEditorModal({ cue, onClose, onSaved }: { cue?: Cue; onClose: () => void; onSaved: (msg: string) => void }) {
  const { state, dispatch } = useWorkspace()
  const isNew = !cue
  const [draft, setDraft] = useState<Cue>(
    () =>
      cue ?? {
        id: nextCueId(state.cues, 'Lighting'),
        department: 'Lighting',
        sceneId: 's1',
        triggerType: 'Line',
        trigger: '',
        instruction: '',
        status: 'Draft',
        updatedAt: '',
        updatedBy: '',
      },
  )
  const [errors, setErrors] = useState<{ trigger?: string; instruction?: string }>({})
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLSelectElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const sceneLines = useMemo(() => currentLines.filter((l) => l.sceneId === draft.sceneId && l.kind !== 'heading'), [draft.sceneId])
  const anchorMissing = draft.lineRef && !currentLines.some((l) => l.id === draft.lineRef)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    firstFieldRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, input, select, textarea, [href]')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [])

  const update = <K extends keyof Cue>(key: K, value: Cue[K]) => setDraft((d) => ({ ...d, [key]: value }))

  function onDepartment(dep: Department) {
    setDraft((d) => ({ ...d, department: dep, id: isNew ? nextCueId(state.cues, dep) : d.id }))
  }

  function onAnchor(lineId: string) {
    const line = currentLines.find((l) => l.id === lineId)
    setDraft((d) => ({
      ...d,
      lineRef: lineId || undefined,
      trigger: line ? describeLine(line) : d.trigger,
      triggerType: line ? (line.kind === 'dialogue' ? 'Line' : 'Action') : d.triggerType,
    }))
    if (line) setErrors((e) => ({ ...e, trigger: undefined }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (draft.trigger.trim().length < 3) errs.trigger = 'Describe what the cue is called on.'
    if (draft.instruction.trim().length < 3) errs.instruction = 'Add an instruction for the operator.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    dispatch({ type: 'SAVE_CUE', cue: { ...draft, trigger: draft.trigger.trim(), instruction: draft.instruction.trim() }, isNew })
    onSaved(isNew ? `${draft.id} added to the cue sheet.` : `${draft.id} saved.`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink-950/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cue-editor-title"
        className="relative flex max-h-[92dvh] w-full max-w-2xl animate-scale-in flex-col overflow-hidden rounded-t-2xl border hairline bg-ink-850 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-4">
          <div>
            <p className="font-mono text-xs text-brass-400">{draft.id}</p>
            <h2 id="cue-editor-title" className="font-serif text-2xl text-ivory-50">
              {isNew ? 'Add a cue' : 'Edit cue'}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-ivory-400 hover:bg-ivory-50/5 hover:text-ivory-50" aria-label="Close cue editor">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="scrollbar-thin space-y-5 overflow-y-auto px-6 py-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="ce-dept" label="Department">
                <select ref={firstFieldRef} id="ce-dept" className="input" value={draft.department} onChange={(e) => onDepartment(e.target.value as Department)}>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field id="ce-scene" label="Scene">
                <select
                  id="ce-scene"
                  className="input"
                  value={draft.sceneId}
                  onChange={(e) => setDraft((d) => ({ ...d, sceneId: e.target.value, lineRef: undefined }))}
                >
                  {scenes.map((s) => (
                    <option key={s.id} value={s.id}>
                      Scene {s.number}: {s.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="ce-status" label="Status">
                <select id="ce-status" className="input" value={draft.status} onChange={(e) => update('status', e.target.value as CueStatus)}>
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              id="ce-anchor"
              label="Script anchor (draft 4)"
              hint={anchorMissing ? `The current anchor ${draft.lineRef} is not in draft 4. Choose a new line, or leave it as is.` : 'Optional. Picking a line fills in the trigger.'}
            >
              <select id="ce-anchor" className="input" value={anchorMissing ? '' : (draft.lineRef ?? '')} onChange={(e) => onAnchor(e.target.value)}>
                <option value="">{anchorMissing ? `${draft.lineRef} (removed in draft 4)` : 'No script anchor'}</option>
                {sceneLines.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.id} · {describeLine(l).slice(0, 70)}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
              <Field id="ce-ttype" label="Trigger type">
                <select id="ce-ttype" className="input" value={draft.triggerType} onChange={(e) => update('triggerType', e.target.value as TriggerType)}>
                  {triggerTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field id="ce-trigger" label="Trigger" required error={errors.trigger}>
                <input
                  id="ce-trigger"
                  className="input"
                  value={draft.trigger}
                  aria-invalid={errors.trigger ? true : undefined}
                  aria-describedby={errors.trigger ? 'ce-trigger-error' : undefined}
                  onChange={(e) => {
                    update('trigger', e.target.value)
                    setErrors((er) => ({ ...er, trigger: undefined }))
                  }}
                  placeholder="ELIAS steps towards the edge"
                />
              </Field>
            </div>

            <Field id="ce-instruction" label="Instruction" required error={errors.instruction}>
              <textarea
                id="ce-instruction"
                className="input"
                rows={3}
                value={draft.instruction}
                aria-invalid={errors.instruction ? true : undefined}
                aria-describedby={errors.instruction ? 'ce-instruction-error' : undefined}
                onChange={(e) => {
                  update('instruction', e.target.value)
                  setErrors((er) => ({ ...er, instruction: undefined }))
                }}
                placeholder="Play the arriving train sound effect."
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 border-t hairline bg-ink-900/60 px-6 py-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isNew ? 'Add cue' : 'Save changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
