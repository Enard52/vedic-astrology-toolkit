// Small helpers for showing day timings.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { formatJd } from '@/engine/time'
import type { DayTimings, TimeWindow } from '@/engine/types'

/**
 * The item running at `jd` (start inclusive, end exclusive). Same rule as engine/muhurta.ts
 * activeAt, kept here so the page chunks do not pull in the ephemeris glue that module imports.
 */
export function runningAt<T extends { startJd: number; endJd: number }>(items: readonly T[], jd: number): T | undefined {
  return items.find((x) => x.startJd <= jd && jd < x.endJd)
}

/** "12:04 – 13:33" */
export const timeRange = (startJd: number, endJd: number, zone: string): string => `${formatJd(startJd, zone, 'time')} – ${formatJd(endJd, zone, 'time')}`

/** Spoken form of a time range for labels: "12:04 to 13:33". */
export const spokenRange = (startJd: number, endJd: number, zone: string): string => `${formatJd(startJd, zone, 'time')} to ${formatJd(endJd, zone, 'time')}`

/** The windows tradition asks you to avoid for new beginnings, in time order. */
export function avoidWindows(t: DayTimings): TimeWindow[] {
  return [t.rahuKalam, t.yamaganda, t.gulikaKalam, ...t.durmuhurta].sort((a, b) => a.startJd - b.startJd)
}

/** Every marked window of the day (avoid windows and Abhijit), in time order. */
export function markedWindows(t: DayTimings): TimeWindow[] {
  return [...avoidWindows(t), ...(t.abhijit ? [t.abhijit] : [])].sort((a, b) => a.startJd - b.startJd)
}
