// Year timelines: the slow grahas' signs (with houses from the natal Moon), Saturn's named
// phases and the dasha periods, drawn as bands across January to December, each followed by
// the same facts in words.
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { CSSProperties, ReactNode } from 'react'
import { ordinal } from '@/content/format'
import { SATURN_PHASE_TITLE } from '@/content/saturn'
import { SIGN_NAMES, SIGN_SHORT } from '@/engine/core'
import type { SaturnPeriod } from '@/engine/saturn'
import { formatJd, localToJd } from '@/engine/time'
import type { DashaPeriod, Planet } from '@/engine/types'
import { cn } from '@/lib/cn'
import { BODY_ABBR, BODY_GLYPH, bodyColor, GLYPH_FONT } from '@/ui/chart/planets'
// Planet colour variables used by bodyColor().
import '@/ui/chart/chart.css'
import type { TransitTrack } from './data'
import { MONTHS } from './dates'
import { TONE_VARS } from './meta'

export interface YearRange {
  year: number
  startJd: number
  endJd: number
  timeZone: string
  /** Current instant, marked when inside the year. */
  nowJd: number
}

interface BandSegment {
  key: string
  startJd: number
  endJd: number
  /** Shown when the segment is wide. */
  label: string
  /** Shown when it is narrow. */
  short?: string
  style: Pick<CSSProperties, 'background' | 'color' | 'boxShadow'>
}

/** The month starts as fractions of the year, for gridlines and the axis. */
function monthMarks({ year, startJd, endJd, timeZone }: YearRange) {
  return MONTHS.map((m, i) => ({ m, x: (localToJd(`${year}-${String(i + 1).padStart(2, '0')}-01`, timeZone) - startJd) / (endJd - startJd) }))
}

function MonthAxis({ range, className }: { range: YearRange; className?: string }) {
  return (
    <div aria-hidden className={cn('relative h-4 text-[0.62rem] font-medium uppercase tracking-wide text-[var(--text-muted)]', className)}>
      {monthMarks(range).map(({ m, x }) => (
        <span key={m} className="absolute" style={{ left: `${x * 100}%`, width: `${100 / 12}%` }}>
          <span className="pl-1 sm:hidden">{m[0]}</span>
          <span className="hidden pl-1 sm:inline">{m}</span>
        </span>
      ))}
    </div>
  )
}

function Band({ range, segments, className }: { range: YearRange; segments: readonly BandSegment[]; className?: string }) {
  const span = range.endJd - range.startJd
  const x = (jd: number) => Math.min(1, Math.max(0, (jd - range.startJd) / span))
  const now = range.nowJd >= range.startJd && range.nowJd < range.endJd ? x(range.nowJd) : null
  const shown = segments.map((s) => ({ s, left: x(s.startJd), width: x(s.endJd) - x(s.startJd) })).filter((p) => p.width > 0)
  const box = (left: number, width: number) => ({ left: `calc(${left * 100}% + 1px)`, width: `calc(${width * 100}% - 2px)` })
  return (
    <div aria-hidden className={cn('relative h-10 overflow-hidden rounded-xl bg-[var(--surface-2)] ring-1 ring-inset ring-[var(--surface-border)]', className)}>
      {monthMarks(range).slice(1).map(({ m, x: mx }) => <span key={m} className="absolute inset-y-0 w-px bg-[var(--divider)]" style={{ left: `${mx * 100}%` }} />)}
      {/* Three layers: the fills, the "now" line over them, and the labels (with a halo) over the line. */}
      {shown.map(({ s, left, width }) => (
        <span key={s.key} className="absolute inset-y-1 rounded-lg" style={{ ...box(left, width), background: s.style.background, boxShadow: s.style.boxShadow }} />
      ))}
      {now !== null && <span className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[var(--text)]" style={{ left: `${now * 100}%` }} />}
      {shown.map(({ s, left, width }) => (
        <span
          key={s.key}
          className="absolute inset-y-1 flex items-center overflow-hidden px-2 text-[0.72rem] font-semibold [text-shadow:0_0_3px_var(--bg),0_0_2px_var(--bg)]"
          style={{ ...box(left, width), color: s.style.color }}
        >
          <span className="truncate">{width >= 0.22 ? s.label : width >= 0.08 ? s.short ?? s.label : ''}</span>
        </span>
      ))}
    </div>
  )
}

const tint = (color: string, pct: number) => `color-mix(in oklab, ${color} ${pct}%, transparent)`

function Row({ label, children, facts }: { label: ReactNode; children: ReactNode; facts: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-start gap-x-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
      <div className="pt-2.5 text-sm font-semibold">{label}</div>
      <div className="min-w-0">
        {children}
        {/* Without a band (no Saturn phase this year) the words line up with the label. */}
        <p className={cn('text-xs leading-relaxed text-[var(--text-muted)]', children ? 'mt-1.5' : 'pt-2.5')}>{facts}</p>
      </div>
    </div>
  )
}

const dateIn = (jd: number, range: YearRange) => formatJd(jd, range.timeZone, 'date').replace(` ${range.year}`, '')

function stayFacts(stays: TransitTrack['stays'], range: YearRange): string {
  return stays.map((s, i) => {
    const where = `${SIGN_NAMES[s.sign]} (${ordinal(s.house)} from Moon)`
    if (stays.length === 1) return `${where} all year`
    if (i === 0) return `${where} until ${dateIn(s.endJd, range)}`
    return `${where} from ${dateIn(s.startJd, range)}`
  }).join(' · ')
}

function PlanetLabel({ planet }: { planet: Planet }) {
  return (
    <span className="flex items-center gap-1.5" style={{ color: bodyColor(planet) }}>
      <span aria-hidden style={{ fontFamily: GLYPH_FONT }}>{BODY_GLYPH[planet]}</span>{planet}
    </span>
  )
}

export function TransitBands({ tracks, saturn, range }: { tracks: readonly TransitTrack[]; saturn?: readonly SaturnPeriod[]; range: YearRange }) {
  const phases = (saturn ?? []).filter((p) => p.endJd > range.startJd && p.startJd < range.endJd)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
        <span />
        <MonthAxis range={range} />
      </div>
      {tracks.map((t) => (
        <Row key={t.planet} label={<PlanetLabel planet={t.planet} />} facts={stayFacts(t.stays, range)}>
          <Band
            range={range}
            segments={t.stays.map((s, i) => ({
              key: `${s.startJd}`,
              startJd: s.startJd, endJd: s.endJd,
              label: `${SIGN_NAMES[s.sign]} · ${ordinal(s.house)}`, short: `${SIGN_SHORT[s.sign]} ${s.house}`,
              style: { background: tint(bodyColor(t.planet), i % 2 ? 40 : 26), color: 'var(--text)', boxShadow: `inset 0 0 0 1px ${tint(bodyColor(t.planet), 55)}` },
            }))}
          />
        </Row>
      ))}
      <Row
        label={<span className="text-[var(--text-muted)]">Saturn phase</span>}
        facts={phases.length
          ? phases.map((p) => `${SATURN_PHASE_TITLE[p.phase]}: ${formatJd(p.startJd, range.timeZone, 'date')} – ${formatJd(p.endJd, range.timeZone, 'date')}`).join(' · ')
          : 'No Sade Sati, Ashtama or Ardhashtama Shani this year.'}
      >
        {phases.length > 0 && (
          <Band
            range={range}
            segments={phases.map((p) => {
              const tone = TONE_VARS[p.phase === 'sade_sati_peak' || p.phase === 'ashtama' ? 'bad' : 'mixed']
              return {
                key: `${p.startJd}`, startJd: p.startJd, endJd: p.endJd, label: SATURN_PHASE_TITLE[p.phase], short: p.phase.startsWith('sade') ? 'Sade Sati' : 'Shani',
                style: { background: tone.bg, color: tone.fg, boxShadow: `inset 0 0 0 1px ${tone.border}` },
              }
            })}
          />
        )}
      </Row>
    </div>
  )
}

/** Antardashas and pratyantardashas running during the year. */
export function DashaBands({ dashas, range }: { dashas: readonly DashaPeriod[]; range: YearRange }) {
  const overlap = (p: DashaPeriod) => p.endJd > range.startJd && p.startJd < range.endJd
  const mds = dashas.filter(overlap)
  const ads = mds.flatMap((md) => (md.children ?? []).filter(overlap))
  const pds = ads.flatMap((ad) => (ad.children ?? []).filter(overlap))
  const seg = (p: DashaPeriod, i: number): BandSegment => ({
    key: `${p.level}-${p.startJd}`, startJd: p.startJd, endJd: p.endJd, label: p.lord, short: BODY_ABBR[p.lord],
    style: { background: tint(bodyColor(p.lord), i % 2 ? 40 : 26), color: 'var(--text)', boxShadow: `inset 0 0 0 1px ${tint(bodyColor(p.lord), 50)}` },
  })
  const changes = (list: DashaPeriod[]) => list.filter((p) => p.startJd >= range.startJd).map((p) => `${p.lord} from ${dateIn(p.startJd, range)}`)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
        <span />
        <MonthAxis range={range} />
      </div>
      <Row label="Maha" facts={mds.map((p) => `${p.lord} mahadasha until ${formatJd(p.endJd, range.timeZone, 'date')}`).join(' · ')}>
        <Band range={range} segments={mds.map(seg)} />
      </Row>
      <Row label="Antar" facts={changes(ads).length ? `Changes: ${changes(ads).join(' · ')}` : `${ads[0]?.lord ?? ''} all year`}>
        <Band range={range} segments={ads.map(seg)} />
      </Row>
      <Row label="Pratyantar" facts={`${pds.length} sub-periods this year`}>
        <Band range={range} segments={pds.map(seg)} />
      </Row>
    </div>
  )
}
