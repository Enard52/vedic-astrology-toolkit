// Loading skeletons, the error card, the missing-profile state and the disclaimer line
// shared by the forecast screens.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Info, RotateCw, UserX } from 'lucide-react'
import { Link } from 'wouter'
import { DISCLAIMER } from '@/engine/types'
import { cn } from '@/lib/cn'
import { pageTitle, useDocumentTitle } from '@/lib/documentTitle'
import { Button } from '@/ui/components/Button'
import { Callout } from '@/ui/components/Callout'
import { EmptyState } from '@/ui/components/EmptyState'
import { Skeleton } from '@/ui/components/Spinner'
import { Page } from '@/ui/layout/Page'

export function ProfileMissing() {
  useDocumentTitle(pageTitle('Profile not found'))
  return (
    <Page width="narrow">
      <EmptyState
        icon={UserX}
        title="Profile not found"
        description="This link points to a profile that is not saved in this browser. Profiles stay on the device where they were made."
        action={
          <>
            <Button asChild><Link href="/profiles">Your profiles</Link></Button>
            <Button asChild variant="secondary"><Link href="/new">Add a profile</Link></Button>
          </>
        }
      />
    </Page>
  )
}

/** A failed calculation: the message, a retry (which also restarts a stopped engine) and a reload. */
export function ForecastError({ error, onRetry, className }: { error: Error; onRetry?: () => void; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <Callout tone="error" title="This forecast could not be prepared">
        {error.message || 'Something went wrong while calculating.'} Your saved details are safe.
      </Callout>
      <div className="flex flex-wrap gap-2">
        {onRetry && (
          <Button onClick={onRetry}>
            <RotateCw aria-hidden /> Try again
          </Button>
        )}
        <Button variant="secondary" onClick={() => window.location.reload()}>Reload the page</Button>
      </div>
    </div>
  )
}

/** One quiet line under every forecast, pointing to the methods page. */
export function ForecastDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn('mt-10 flex max-w-3xl items-start gap-2 text-pretty text-xs leading-relaxed text-[var(--text-muted)]', className)}>
      <Info aria-hidden className="mt-px size-3.5 shrink-0" />
      <span>
        {DISCLAIMER}{' '}
        <Link href="/about" className="font-medium text-[var(--accent-text)] underline-offset-4 hover:underline">How this is worked out</Link>
      </span>
    </p>
  )
}

function HeroSkeleton() {
  return (
    <div className="glass rounded-[var(--radius-card)] p-5 sm:p-7">
      <div className="flex items-center gap-4 sm:gap-6">
        <Skeleton className="size-[4.5rem] shrink-0 rounded-full min-[360px]:size-24 sm:size-32" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-48 max-w-full" />
          <Skeleton className="hidden h-5 w-full max-w-sm sm:block" />
        </div>
      </div>
      <Skeleton className="mt-6 h-px w-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  )
}

const card = (h: string) => <div className="glass rounded-[var(--radius-card)] p-5"><Skeleton className="h-5 w-32" /><Skeleton className={cn('mt-4 w-full', h)} /></div>

/** Placeholder in the shape of a forecast screen while the first result loads. */
export function ForecastSkeleton({ variant = 'period' }: { variant?: 'day' | 'period' | 'chart' }) {
  return (
    <div role="status" aria-label="Loading the forecast" className="space-y-4">
      {variant === 'chart' ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {card('aspect-square')}
          {card('h-72')}
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7"><HeroSkeleton /></div>
            <div className="lg:col-span-5">{card(variant === 'day' ? 'h-40' : 'h-24')}</div>
          </div>
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">{card('h-64')}</div>
            <div className="lg:col-span-5">{card('h-40')}</div>
          </div>
        </>
      )}
    </div>
  )
}
