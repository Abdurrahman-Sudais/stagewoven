import type { Cue, Priority, ScriptLine, ScriptRevision } from './types'

export type DiffRow =
  | { kind: 'same'; left: ScriptLine; right: ScriptLine }
  | { kind: 'modified'; left: ScriptLine; right: ScriptLine }
  | { kind: 'removed'; left: ScriptLine }
  | { kind: 'added'; right: ScriptLine }

export type CueFinding = {
  cue: Cue
  priority: Priority
  change: 'removed' | 'modified'
  line: ScriptLine
  revisedLine?: ScriptLine
  suggestedLine?: ScriptLine
  reason: string
}

/**
 * Line-level comparison of two script revisions, aligned by stable line ID.
 * This runs locally on seeded data; it stands in for a comparison service.
 */
export function diffRevisions(original: ScriptRevision, revised: ScriptRevision): DiffRow[] {
  const a = original.lines
  const b = revised.lines
  const inA = new Set(a.map((l) => l.id))
  const inB = new Set(b.map((l) => l.id))
  const rows: DiffRow[] = []
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    const left = a[i]
    const right = b[j]
    if (left && right && left.id === right.id) {
      rows.push(left.text === right.text ? { kind: 'same', left, right } : { kind: 'modified', left, right })
      i++
      j++
    } else if (left && !inB.has(left.id)) {
      rows.push({ kind: 'removed', left })
      i++
    } else if (right && !inA.has(right.id)) {
      rows.push({ kind: 'added', right })
      j++
    } else {
      // Reordered line: show as removed then added so nothing is hidden.
      if (left) {
        rows.push({ kind: 'removed', left })
        i++
      }
      if (right) {
        rows.push({ kind: 'added', right })
        j++
      }
    }
  }
  return rows
}

export function findAffectedCues(rows: DiffRow[], cues: Cue[]): CueFinding[] {
  const findings: CueFinding[] = []
  rows.forEach((row, index) => {
    if (row.kind !== 'removed' && row.kind !== 'modified') return
    const line = row.left
    const linked = cues.filter((c) => c.lineRef === line.id)
    if (!linked.length) return

    let suggestedLine: ScriptLine | undefined
    if (row.kind === 'removed') {
      // Suggest the nearest line in the revised script that now occupies this moment.
      for (let k = index + 1; k < rows.length; k++) {
        const r = rows[k]
        if (r.kind === 'removed') continue
        if (r.right.sceneId === line.sceneId) suggestedLine = r.right
        break
      }
    }

    for (const cue of linked) {
      const reason =
        row.kind === 'removed'
          ? `The trigger line “${line.text}” (${line.id}) no longer appears in the revised script. ${cue.id} is anchored to that line, so the show caller would have nothing to call it on.`
          : `The trigger line ${line.id} was reworded. ${cue.id} is still anchored to it, but the written trigger may no longer match what the actor says.`
      findings.push({
        cue,
        priority: row.kind === 'removed' ? 'High' : 'Medium',
        change: row.kind,
        line,
        revisedLine: row.kind === 'modified' ? row.right : undefined,
        suggestedLine,
        reason,
      })
    }
  })
  return findings
}

export function describeLine(line: ScriptLine) {
  return line.kind === 'dialogue' ? `${line.character}: “${line.text}”` : line.text
}
