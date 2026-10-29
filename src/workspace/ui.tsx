import type { ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDown, FlaskConical, Lightbulb, Move, Volume2 } from 'lucide-react'
import { cn } from '../lib/cn'
import type { CueStatus, Department, Priority, ReviewStatus } from './types'

export const deptColor: Record<Department, string> = { Lighting: '#c58020', Sound: '#4a95e0', 'Scene Change': '#c9609a' }

export const deptStyle: Record<Department, { text: string; bg: string; dot: string; icon: typeof Lightbulb; short: string }> = {
  Lighting: { text: 'text-brass-300', bg: 'bg-brass-400/10 border-brass-400/25', dot: 'bg-dept-lx', icon: Lightbulb, short: 'LX' },
  Sound: { text: 'text-steel-300', bg: 'bg-steel-400/10 border-steel-400/25', dot: 'bg-dept-snd', icon: Volume2, short: 'SND' },
  'Scene Change': { text: 'text-mauve-300', bg: 'bg-mauve-400/10 border-mauve-400/25', dot: 'bg-dept-sc', icon: Move, short: 'SC' },
}

const pill = 'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap'

export function DeptBadge({ department, className }: { department: Department; className?: string }) {
  const s = deptStyle[department]
  const Icon = s.icon
  return (
    <span className={cn(pill, s.bg, s.text, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {department}
    </span>
  )
}

const statusStyle: Record<CueStatus, string> = {
  Approved: 'border-sage-400/25 bg-sage-400/10 text-sage-300',
  Draft: 'border-ivory-50/10 bg-ivory-50/[0.04] text-ivory-300',
  'Needs Review': 'border-curtain-400/35 bg-curtain-500/15 text-curtain-300',
  Reviewed: 'border-steel-400/25 bg-steel-400/10 text-steel-300',
}

export function StatusBadge({ status, className }: { status: CueStatus; className?: string }) {
  return (
    <span className={cn(pill, statusStyle[status], className)}>
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'Approved' && 'bg-sage-400',
          status === 'Draft' && 'bg-ivory-500',
          status === 'Needs Review' && 'bg-curtain-400',
          status === 'Reviewed' && 'bg-steel-400',
        )}
      />
      {status}
    </span>
  )
}

const priorityStyle: Record<Priority, string> = {
  High: 'border-curtain-400/35 bg-curtain-500/15 text-curtain-300',
  Medium: 'border-brass-400/30 bg-brass-400/10 text-brass-300',
  Low: 'border-ivory-50/10 bg-ivory-50/[0.04] text-ivory-300',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={cn(pill, priorityStyle[priority])}>{priority} priority</span>
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={cn(
        pill,
        status === 'Open' && 'border-ivory-50/15 text-ivory-200',
        status === 'In Review' && 'border-steel-400/30 bg-steel-400/10 text-steel-300',
        status === 'Resolved' && 'border-sage-400/25 bg-sage-400/10 text-sage-300',
      )}
    >
      {status}
    </span>
  )
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ivory-50/10 bg-ink-700 font-mono text-[0.62rem] text-ivory-200',
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <select
        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-ivory-50/10 bg-ink-900 pr-8 pl-3 text-[0.8rem] text-ivory-100 transition-colors outline-none hover:border-ivory-50/20 focus:border-brass-400/60 focus:ring-2 focus:ring-brass-400/20"
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ivory-500" />
    </span>
  )
}

export function SimulatedNotice({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start gap-2.5 rounded-lg border border-brass-400/20 bg-brass-400/[0.06] px-3.5 py-2.5 text-[0.78rem] leading-relaxed text-brass-200', className)}>
      <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass-400" aria-hidden="true" />
      <p>
        {children ?? (
          <>
            <strong className="font-medium">Simulated demonstration.</strong> Change detection here is a rule-based comparison of seeded script
            revisions running in your browser. No AI or comparison service is connected.
          </>
        )}
      </p>
    </div>
  )
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function ViewHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl text-ivory-50 sm:text-[2.1rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-ivory-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
