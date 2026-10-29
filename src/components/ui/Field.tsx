import type { ReactNode } from 'react'

export function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[0.8rem] font-medium text-ivory-200">
        {label}
        {required && (
          <span className="ml-0.5 text-brass-400" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-curtain-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-ivory-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
