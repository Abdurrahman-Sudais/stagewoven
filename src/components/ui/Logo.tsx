import { cn } from '../../lib/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('h-7 w-7', className)}>
      <rect width="32" height="32" rx="8" className="fill-ink-800" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" className="stroke-ivory-50/10" />
      <g fill="none" strokeWidth="1.8" strokeLinecap="round" className="stroke-brass-400">
        <path d="M7 11c3-3 6 3 9 0s6-3 9 0" />
        <path d="M7 16c3-3 6 3 9 0s6-3 9 0" opacity="0.75" />
        <path d="M7 21c3-3 6 3 9 0s6-3 9 0" opacity="0.5" />
      </g>
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-serif text-[1.35rem] leading-none tracking-tight text-ivory-50">Stagewoven</span>
    </span>
  )
}
