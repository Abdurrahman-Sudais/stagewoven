import { createContext, useContext } from 'react'
import type { Cue } from './types'

export type UiCtx = {
  openEditor: (cue?: Cue) => void
  toast: (message: string) => void
}

export const UiContext = createContext<UiCtx | null>(null)

export function useWorkspaceUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useWorkspaceUi must be used inside WorkspaceApp')
  return ctx
}
