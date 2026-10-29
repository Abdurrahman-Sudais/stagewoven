import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary:
    'bg-brass-400 text-ink-950 hover:bg-brass-300 shadow-[0_8px_24px_-10px_rgb(230_162_63/0.6)] hover:shadow-[0_10px_28px_-10px_rgb(230_162_63/0.75)]',
  secondary:
    'border border-ivory-50/15 bg-ivory-50/[0.03] text-ivory-50 hover:border-ivory-50/30 hover:bg-ivory-50/[0.07]',
  ghost: 'text-ivory-200 hover:bg-ivory-50/[0.06] hover:text-ivory-50',
  danger: 'border border-curtain-400/40 bg-curtain-500/10 text-curtain-300 hover:bg-curtain-500/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-[0.8rem]',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.95rem]',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />
}

type ButtonLinkProps = {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function ButtonLink({ to, variant = 'primary', size = 'md', className, children }: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  )
}
