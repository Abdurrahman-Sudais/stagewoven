import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', className)}>{children}</div>
}

export function Section({
  id,
  className,
  children,
  labelledBy,
}: {
  id?: string
  className?: string
  children: ReactNode
  labelledBy?: string
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('relative py-20 sm:py-28', className)}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  id,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  id?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className={cn('eyebrow reveal mb-4 flex items-center gap-2', align === 'center' && 'justify-center')}><span className="h-px w-6 bg-brass-400/70" aria-hidden="true" />{eyebrow}</p>}
      <h2 id={id} className="reveal font-serif text-[2.1rem] leading-[1.08] font-light tracking-tight text-ivory-50 [--d:60ms] sm:text-5xl">
        {title}
      </h2>
      {intro && <p className="reveal mt-5 text-base leading-relaxed text-ivory-300 [--d:120ms] sm:text-lg">{intro}</p>}
    </div>
  )
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro: ReactNode; children?: ReactNode }) {
  return (
    <header className="stage-light relative overflow-hidden border-b hairline pt-36 pb-16 sm:pt-44 sm:pb-24">
      <Container>
        <p className="eyebrow mb-5 animate-fade-up">{eyebrow}</p>
        <h1 className="max-w-4xl animate-fade-up font-serif text-[2.6rem] leading-[1.04] font-light tracking-tight text-ivory-50 [animation-delay:60ms] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-ivory-300 [animation-delay:120ms]">{intro}</p>
        {children && <div className="mt-9 animate-fade-up [animation-delay:180ms]">{children}</div>}
      </Container>
    </header>
  )
}
