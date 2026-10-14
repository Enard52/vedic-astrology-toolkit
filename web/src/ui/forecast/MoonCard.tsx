// The transiting Moon around midday (where the day's Moon factors are read) judged from the
// birth Moon: sign, nakshatra, Tara bala, Chandra bala and Chandrashtama, plus the Moon's
// changes during the day.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { MoonStar } from 'lucide-react'
import type { ReactNode } from 'react'
import { ordinal } from '@/content/format'
import { NAKSHATRA_NAMES, SIGN_NAMES, SIGN_SANSKRIT } from '@/engine/core'
import type { MoonDay } from '@/engine/moon'
import { formatJd, jdToLocal, weekdayOf } from '@/engine/time'
import type { TimedEvent, TimeWindow } from '@/engine/types'
import { Badge } from '@/ui/components/Badge'
import { Callout } from '@/ui/components/Callout'
import { bodyColor } from '@/ui/chart/planets'
// Planet colour variables used by bodyColor().
import '@/ui/chart/chart.css'
import { WEEKDAYS } from './dates'
import { Panel } from './Section'

const TARA_TONE = { good: 'good', mixed: 'mixed', adverse: 'bad' } as const
const TARA_WORD = { good: 'Supportive', mixed: 'Mixed', adverse: 'Tender' } as const

export function MoonCard({ moon, chandrashtama, events, date, timeZone, className }: {
  moon: MoonDay
  chandrashtama?: TimeWindow
  /** The day's events; the Moon's sign and nakshatra changes are listed. */
  events: readonly TimedEvent[]
  /** The civil date of the day shown; changes after midnight carry their weekday. */
  date: string
  timeZone: string
  className?: string
}) {
  const { nakshatra: nak, tara, chandraBala: bala } = moon
  const moves = events.filter((e) => e.kind === 'moon_sign' || e.kind === 'moon_nakshatra' || (e.kind === 'chandrashtama' && e.body === 'Moon'))
  const when = (jd: number) => `${formatJd(jd, timeZone, 'weekday-date')}, ${formatJd(jd, timeZone, 'time')}`
  return (
    <Panel title="Moon today" description="Around midday, counted from your birth Moon" icon={<MoonStar />} className={className}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Fact term="Sign" note={SIGN_SANSKRIT[moon.sign]}>{SIGN_NAMES[moon.sign]}</Fact>
        <Fact term="Nakshatra" note={<>Pada {nak.pada} · lord <span style={{ color: bodyColor(nak.lord) }}>{nak.lord}</span></>}>{nak.name}</Fact>
        <Fact term="Tara bala" note={`${ordinal(tara.number)} of 9 from your birth star`}>
          <span className="flex flex-wrap items-center gap-1.5">{tara.name}<Badge tone={TARA_TONE[tara.classification]}>{TARA_WORD[tara.classification]}</Badge></span>
        </Fact>
        <Fact term="Chandra bala" note={`${ordinal(bala.house)} from your birth Moon`}>
          <span className="flex flex-wrap items-center gap-1.5">
            {moon.chandrashtama ? 'Chandrashtama' : bala.good ? 'Strong' : 'Weak'}
            <Badge tone={moon.chandrashtama ? 'bad' : bala.good ? 'good' : 'mixed'}>{ordinal(bala.house)}</Badge>
          </span>
        </Fact>
      </dl>
      {chandrashtama && (
        <Callout tone="warning" title="Chandrashtama" className="mt-4">
          From {when(chandrashtama.startJd)} until {when(chandrashtama.endJd)}. Traditionally a time to go gently and keep big decisions for later.
        </Callout>
      )}
      {moves.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-[var(--divider)] pt-3 text-sm">
          {moves.map((e) => {
            const on = jdToLocal(e.jd, timeZone, 'minute').date
            return (
              <li key={e.jd} className="flex items-baseline justify-between gap-3">
                <span className="text-[var(--text-muted)]">{moveLabel(e)}</span>
                <span className="shrink-0 font-medium tabular-nums">{on !== date && `${WEEKDAYS[weekdayOf(on)]} `}{formatJd(e.jd, timeZone, 'time')}</span>
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}

/** "Into Rohini nakshatra", "Into Taurus", from the event's fields (titles are free text). */
function moveLabel(e: TimedEvent): string {
  if (e.kind === 'moon_nakshatra' && e.nakshatra) return `Into ${NAKSHATRA_NAMES[e.nakshatra - 1]} nakshatra`
  if (e.sign !== undefined) return `Into ${SIGN_NAMES[e.sign]}${e.kind === 'chandrashtama' ? ' (Chandrashtama)' : ''}`
  return e.title
}

function Fact({ term, note, children }: { term: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{term}</dt>
      <dd className="m-0 mt-1 font-medium leading-snug text-[var(--text)]">{children}</dd>
      {note && <dd className="m-0 mt-0.5 text-xs text-[var(--text-muted)]">{note}</dd>}
    </div>
  )
}
