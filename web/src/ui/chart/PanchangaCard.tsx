// The five limbs of the birth panchanga plus sunrise and sunset in the birth zone.
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ReactNode } from 'react'
import { CalendarDays, Hourglass, MoonStar, Orbit, Sparkles, Sunrise, Sunset } from 'lucide-react'
import { clsx } from 'clsx'
import { formatJd } from '@/engine/time'
import type { Chart } from '@/engine/types'
import { bodyColor } from './planets'
import './chart.css'

/** Vara names, Sunday first (the weekday of a Vedic day is counted from sunrise). */
const VARA = ['Ravivara', 'Somavara', 'Mangalavara', 'Budhavara', 'Guruvara', 'Shukravara', 'Shanivara'] as const
const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

export function PanchangaCard({ chart, className }: { chart: Chart; className?: string }) {
  const p = chart.panchanga
  const sd = chart.solarDay
  const zone = chart.input.timeZone
  const nak = p.nakshatra
  const time = (jd: number) => formatJd(jd, zone, 'time')
  // "Shukla" is the spelling most panchang publishers use for the bright half.
  const paksha = p.paksha === 'Sukla' ? 'Shukla' : 'Krishna'
  return (
    <section
      aria-label="Birth panchanga"
      className={clsx('rounded-card border border-(--surface-border) bg-(--bg-elevated) p-5 backdrop-blur sm:p-6', className)}
    >
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl text-(--text)">Panchanga</h3>
        {sd && <span className="text-xs text-(--text-muted)">{sd.isDay ? 'Day birth' : 'Night birth'}</span>}
      </header>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Item icon={<CalendarDays />} term="Vara (weekday)" note={sd ? `${VARA[sd.weekday]} · counted from sunrise` : undefined}>
          {sd ? WEEKDAY[sd.weekday] : 'Unavailable (no sunrise)'}
        </Item>
        <Item icon={<MoonStar />} term="Tithi" note={`${p.tithi} of 30 · ${paksha} paksha`}>
          {p.tithiInPaksha === 15 ? p.tithiName : `${paksha} ${p.tithiName}`}
        </Item>
        <Item icon={<Sparkles />} term="Nakshatra" note={<>Pada {nak.pada} · lord <span style={{ color: bodyColor(nak.lord) }}>{nak.lord}</span></>}>
          {nak.name}
        </Item>
        <Item icon={<Orbit />} term="Yoga" note={`${p.yogaIndex} of 27`}>{p.yoga}</Item>
        <Item icon={<Hourglass />} term="Karana" note="Half of a tithi">{p.karana}</Item>
        <Item icon={<Sunrise />} term="Sunrise · Sunset" note={sd ? `Local time, ${zone}` : 'The Sun does not rise or set that day'}>
          {sd ? (
            <span className="inline-flex items-center gap-2 tabular-nums">
              <span className="sr-only">Sunrise</span>{time(sd.sunriseJd)}
              <Sunset aria-hidden className="size-4 text-(--text-muted)" />
              <span className="sr-only">sunset</span>{time(sd.sunsetJd)}
            </span>
          ) : '—'}
        </Item>
      </dl>
    </section>
  )
}

function Item({ icon, term, note, children }: { icon: ReactNode; term: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span aria-hidden className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-(--surface-border) text-(--accent) [&>svg]:size-[18px]">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-(--text-muted)">{term}</dt>
        <dd className="m-0 mt-0.5 text-[0.95rem] font-medium leading-snug text-(--text)">{children}</dd>
        {note && <dd className="m-0 mt-0.5 text-xs text-(--text-muted)">{note}</dd>}
      </div>
    </div>
  )
}
