import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center">
      <LoaderCircle aria-hidden className={cn('size-5 animate-spin text-[var(--accent-text)]', className)} />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Placeholder block with a soft shimmer while content loads. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden className={cn('skeleton rounded-xl', className)} {...props} />
}
