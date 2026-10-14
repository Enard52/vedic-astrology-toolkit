// The seven days of a week as rating-coloured pills (tap opens that day), and the week's
// best and gentlest days.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Leaf, Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { weekdayOf } from '@/engine/time'
import type { Forecast } from '@/engine/types'
import { cn } from '@/lib/cn'
import { dateParts, longDate, shortDate, WEEKDAYS } from './dates'
import { RATING_ICON, RATING_TONE, RATING_WORD, scorePercent, TONE_VARS } from './meta'
import { forecastHref, useForecastLink } from './useForecastDate'

export interface DayPartsProps {
  parts: readonly Forecast[]
  profileId: string
  today: string
  /** The date in the URL, highlighted when it is in this period. */
  selected?: string
}

export function WeekStrip({ parts, profileId, today, selected, className }: DayPartsProps & { className?: string }) {
  const onClick = useForecastLink()
  return (
    <ol className={cn('grid grid-cols-7 gap-1.5 sm:gap-2', className)} aria-label="Days of the week">
      {parts.map((p) => {
        const tone = TONE_VARS[RATING_TONE[p.rating]]
        const Icon = RATING_ICON[p.rating]
        const pct = scorePercent(p.score)
        const isToday = p.start === today
        return (
          <li key={p.start}>
            <a
              href={forecastHref(profileId, 'today', p.start)}
              onClick={onClick(profileId, 'today', p.start)}
              aria-label={`${longDate(p.start)}${isToday ? ', today' : ''}: ${RATING_WORD[p.rating]}, score ${pct}. Open the day`}
              aria-current={isToday ? 'date' : undefined}
              className={cn(
                'group relative flex flex-col items-center rounded-2xl px-1 pb-2.5 pt-2 ring-1 ring-inset transition-[transform,box-shadow] hover:-translate-y-0.5 active:scale-[0.97]',
                p.start === selected && 'shadow-[0_0_0_2px_var(--accent)]',
              )}
              style={{ background: tone.bg, '--tw-ring-color': tone.border } as CSSProperties}
            >
              {/* Today keeps its weekday (the word "Today" does not fit a 320 px phone) and gets a dot. */}
              {isToday && <span aria-hidden className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--bg)]" />}
              <span className={cn('text-[0.65rem] font-semibold uppercase tracking-[0.08em]', isToday ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]')}>
                {WEEKDAYS[weekdayOf(p.start)]}
              </span>
              <span className="font-display text-xl font-semibold tabular-nums leading-tight sm:text-2xl">{dateParts(p.start).day}</span>
              <Icon aria-hidden className="mt-0.5 size-4" style={{ color: tone.fg }} strokeWidth={2.2} />
              <span aria-hidden className="mt-2 h-1 w-[70%] overflow-hidden rounded-full bg-[var(--surface-3)]">
                <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: tone.solid }} />
              </span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}

/** Neutral look for a group with nothing in it: an empty "Go gently" box should not look like a warning. */
const QUIET = { fg: 'var(--text-muted)', bg: 'var(--surface-2)', border: 'var(--surface-border)' }

/** The two strongest days of a rating, in date order. */
function strongest(parts: readonly Forecast[], rating: Forecast['rating'], sign: 1 | -1): Forecast[] {
  return parts.filter((p) => p.rating === rating).sort((a, b) => sign * (b.score - a.score)).slice(0, 2).sort((a, b) => (a.start < b.start ? -1 : 1))
}

/** Best days (highest favourable scores) and days to take gently (challenging), as links. */
export function DayHighlights({ parts, profileId, className }: DayPartsProps & { className?: string }) {
  const onClick = useForecastLink()
  const groups = [
    { key: 'best', title: 'Best days', icon: Sparkles, tone: TONE_VARS.good, items: strongest(parts, 'favourable', 1), empty: 'No standout days; steady is fine too.' },
    { key: 'gentle', title: 'Go gently', icon: Leaf, tone: TONE_VARS.bad, items: strongest(parts, 'challenging', -1), empty: 'No difficult days in this stretch.' },
  ]
  return (
    <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {groups.map(({ key, title, icon: Icon, tone: groupTone, items, empty }) => {
        const tone = items.length ? groupTone : QUIET
        return (
          <section key={key} aria-label={title} className="rounded-2xl p-3.5 ring-1 ring-inset" style={{ background: tone.bg, '--tw-ring-color': tone.border } as CSSProperties}>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: tone.fg }}>
              <Icon aria-hidden className="size-4" />{title}
            </h3>
            {items.length ? (
              <ul className="mt-2 space-y-1">
                {items.map((p) => (
                  <li key={p.start}>
                    <a
                      href={forecastHref(profileId, 'today', p.start)} onClick={onClick(profileId, 'today', p.start)}
                      className="-mx-1.5 block rounded-lg px-1.5 py-1 transition-colors hover:bg-[var(--hover)]"
                    >
                      <span className="block text-sm font-semibold text-[var(--text)]">{shortDate(p.start)}</span>
                      <span className="block text-xs leading-snug text-[var(--text-muted)]">{p.headline}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-2 text-sm text-[var(--text-muted)]">{empty}</p>}
          </section>
        )
      })}
    </div>
  )
}
