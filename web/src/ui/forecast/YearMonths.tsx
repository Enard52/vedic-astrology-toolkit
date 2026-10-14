// Twelve months as bars rising above or dipping below an even line by score, coloured by
// rating; each opens its month. Also the Muntha card of the Tajaka year.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Compass } from 'lucide-react'
import { ordinal } from '@/content/format'
import { MUNTHA_TEXT } from '@/content/muntha'
import { SIGN_NAMES, SIGN_SANSKRIT } from '@/engine/core'
import { formatJd } from '@/engine/time'
import type { Forecast } from '@/engine/types'
import { cn } from '@/lib/cn'
import { Badge } from '@/ui/components/Badge'
import type { MunthaInfo } from './data'
import { dateParts, MONTHS, MONTHS_LONG } from './dates'
import { RATING_ICON, RATING_TONE, RATING_WORD, scorePercent, TONE_VARS } from './meta'
import { Panel } from './Section'
import { forecastHref, useForecastLink } from './useForecastDate'

export function YearMonths({ parts, profileId, today, className }: { parts: readonly Forecast[]; profileId: string; today: string; className?: string }) {
  const onClick = useForecastLink()
  // Scale to the largest swing (at least 0.3) so small differences stay visible but honest.
  const scale = Math.max(0.3, ...parts.map((p) => Math.abs(p.score)))
  const current = today.slice(0, 7)
  return (
    <div className={className}>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-[calc(50%-1.25rem)] h-px bg-[var(--divider)]" />
        <ol className="grid h-44 grid-cols-12 gap-1 sm:gap-1.5" aria-label="Months of the year">
          {parts.map((p) => {
            const tone = TONE_VARS[RATING_TONE[p.rating]]
            const Icon = RATING_ICON[p.rating]
            const { month, year } = dateParts(p.start)
            const h = Math.max(0.06, Math.abs(p.score) / scale) * 50
            const isNow = p.start.slice(0, 7) === current
            return (
              <li key={p.start} className="min-w-0">
                <a
                  href={forecastHref(profileId, 'month', p.start)}
                  onClick={onClick(profileId, 'month', p.start)}
                  aria-label={`${MONTHS_LONG[month - 1]} ${year}${isNow ? ', this month' : ''}: ${RATING_WORD[p.rating]}, score ${scorePercent(p.score)}`}
                  aria-current={isNow ? 'date' : undefined}
                  className="group relative flex h-full flex-col rounded-lg transition-colors hover:bg-[var(--hover)]"
                >
                  <span className="relative block flex-1">
                    <span
                      className={cn('absolute inset-x-[18%] transition-[height] duration-500', p.score >= 0 ? 'bottom-1/2 rounded-t-md rounded-b-sm' : 'top-1/2 rounded-b-md rounded-t-sm')}
                      style={{ height: `${h}%`, background: `linear-gradient(${p.score >= 0 ? '0deg' : '180deg'}, color-mix(in oklab, ${tone.solid} 55%, transparent), ${tone.solid})` }}
                    />
                  </span>
                  <Icon aria-hidden className="mx-auto mt-1 size-3.5 shrink-0" style={{ color: tone.fg }} />
                  <span className={cn('mt-0.5 h-5 text-center text-[0.65rem] font-semibold uppercase', isNow ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]')}>
                    <span className="sm:hidden">{MONTHS[month - 1][0]}</span>
                    <span className="hidden sm:inline">{MONTHS[month - 1]}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
      <p className="mt-2 text-xs text-[var(--text-muted)]">Bars above the line lean supportive, below it challenging. Tap a month to open it.</p>
    </div>
  )
}

export function MunthaCard({ muntha, timeZone, className }: { muntha: MunthaInfo; timeZone: string; className?: string }) {
  return (
    <Panel title="Muntha" description={`Tajaka year from ${formatJd(muntha.returnJd, timeZone, 'date')}`} icon={<Compass />} className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-display text-2xl font-semibold">{SIGN_NAMES[muntha.sign]}</p>
        <p className="text-sm text-[var(--text-muted)]">{SIGN_SANSKRIT[muntha.sign]}</p>
        <Badge tone={muntha.favourable ? 'good' : 'mixed'} className="ml-auto">{muntha.favourable ? 'Supportive' : 'Needs care'}</Badge>
      </div>
      <p className="mt-1 text-sm text-[var(--text)]">{ordinal(muntha.house)} house of the annual chart · age {muntha.completedYears}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{MUNTHA_TEXT[muntha.house - 1]}</p>
      <p className="mt-3 border-t border-[var(--divider)] pt-3 text-xs leading-relaxed text-[var(--text-muted)]">
        The Muntha moves one sign a year from your birth ascendant and is read from the ascendant of the year’s solar-return chart.
      </p>
    </Panel>
  )
}
