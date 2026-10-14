// The running Vimsottari chain (mahadasha, antardasha, pratyantardasha) with end dates,
// linking to the full timeline on the chart screen.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ArrowRight, ChevronRight, Hourglass } from 'lucide-react'
import { Fragment, useId } from 'react'
import { formatJd } from '@/engine/time'
import type { DashaPeriod } from '@/engine/types'
import { cn } from '@/lib/cn'
import { BODY_GLYPH, bodyColor, GLYPH_FONT } from '@/ui/chart/planets'
// Planet colour variables used by bodyColor().
import '@/ui/chart/chart.css'
import { forecastHref, useForecastLink } from './useForecastDate'

const LEVEL = ['Mahadasha', 'Antardasha', 'Pratyantardasha'] as const
const tint = (p: DashaPeriod, pct: number) => `color-mix(in oklab, ${bodyColor(p.lord)} ${pct}%, transparent)`

export function DashaChip({ chain, timeZone, profileId, className }: { chain: readonly DashaPeriod[]; timeZone: string; profileId: string; className?: string }) {
  const onClick = useForecastLink()
  const id = useId()
  if (!chain.length) return null
  return (
    <section aria-labelledby={id} className={cn('glass rounded-[var(--radius-card)] p-4 sm:p-5', className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3">
        <h2 id={id} className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span aria-hidden className="chip grid size-8 place-items-center rounded-xl"><Hourglass className="size-4" /></span>
          Running dasha
        </h2>
        <a
          href={forecastHref(profileId, 'chart')} onClick={onClick(profileId, 'chart')}
          className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-lg text-sm font-medium text-[var(--accent-text)] hover:underline hover:underline-offset-4 sm:min-h-9"
        >
          All periods <ArrowRight aria-hidden className="size-4" />
        </a>
      </div>
      <p className="mb-3 flex flex-wrap items-center gap-1 text-sm font-semibold sm:text-base" aria-label={`Running periods: ${chain.map((p) => p.lord).join(', ')}`}>
        {chain.map((p, i) => (
          <Fragment key={p.level}>
            {i > 0 && <ChevronRight aria-hidden className="size-4 text-[var(--text-muted)]" />}
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 sm:px-2.5" style={{ background: tint(p, 16), color: bodyColor(p.lord) }}>
              <span aria-hidden style={{ fontFamily: GLYPH_FONT }}>{BODY_GLYPH[p.lord]}</span>{p.lord}
            </span>
          </Fragment>
        ))}
      </p>
      <dl className="space-y-1.5 text-sm">
        {chain.map((p) => (
          <div key={p.level} className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--text-muted)]">{LEVEL[p.level]} <span className="text-[var(--text)]">{p.lord}</span></dt>
            <dd className="m-0 shrink-0 tabular-nums text-[var(--text-muted)]">until <span className="font-medium text-[var(--text)]">{formatJd(p.endJd, timeZone, 'date')}</span></dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
