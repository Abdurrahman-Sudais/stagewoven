import type { ReactNode } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { LogoMark } from './Logo'
import { cn } from '../../lib/cn'

export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-ink-950">
      <LogoMark className="h-10 w-10 animate-pulse" />
      <p className="flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-ivory-400 uppercase">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> {label}
      </p>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  body: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border hairline bg-ink-800 text-ivory-400">
        {icon}
      </div>
      <h3 className="font-serif text-xl text-ivory-50">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory-400">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorNotice({ title, body, action }: { title: string; body: ReactNode; action?: ReactNode }) {
  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-curtain-400/30 bg-curtain-500/[0.07] p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-curtain-300" />
      <div className="text-sm">
        <p className="font-medium text-curtain-300">{title}</p>
        <div className="mt-1 text-ivory-300">{body}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}
