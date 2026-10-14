import { CircleAlert, CircleCheck, CircleMinus, type LucideIcon } from 'lucide-react'
import type { Rating } from '@/engine/types'
import { cn } from '@/lib/cn'
import { Badge, type BadgeTone } from './Badge'

export const RATING_META: Record<Rating, { label: string; icon: LucideIcon; tone: BadgeTone }> = {
  favourable: { label: 'Favourable', icon: CircleCheck, tone: 'good' },
  mixed: { label: 'Mixed', icon: CircleMinus, tone: 'mixed' },
  challenging: { label: 'Challenging', icon: CircleAlert, tone: 'bad' },
}

/** A forecast rating shown with icon, word and colour, never colour alone. */
export function RatingPill({ rating, size = 'md', className }: { rating: Rating; size?: 'sm' | 'md'; className?: string }) {
  const { label, icon: Icon, tone } = RATING_META[rating]
  return (
    <Badge tone={tone} size={size} className={cn('font-semibold', className)}>
      <Icon aria-hidden strokeWidth={2.2} />
      {label}
    </Badge>
  )
}
