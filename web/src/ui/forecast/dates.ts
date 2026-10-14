// Civil-date helpers for the forecast screens: period ranges, stepping and labels.
// Dates are "YYYY-MM-DD" strings in the timings place's zone. Weeks start on Sunday,
// as in Indian panchang calendars and the engine's weekday numbering (0 = Sunday).
// SPDX-License-Identifier: AGPL-3.0-or-later
import { addDays, addMonths, daysInMonth, weekdayOf } from '@/engine/time'
import type { Horizon } from '@/engine/types'

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** A real calendar date in "YYYY-MM-DD" form (rejects 2026-02-30). */
export function isIsoDate(value: string | null | undefined): value is string {
  const m = value ? ISO_DATE.exec(value) : null
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  return y >= 1 && mo >= 1 && mo <= 12 && d >= 1 && d <= daysInMonth(y, mo)
}

export function dateParts(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}

const pad = (n: number) => String(n).padStart(2, '0')
export const isoDate = (year: number, month: number, day: number): string => `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`

/** First civil date of the period containing `date`. */
export function periodStart(horizon: Horizon, date: string): string {
  const { year, month } = dateParts(date)
  switch (horizon) {
    case 'day': return date
    case 'week': return addDays(date, -weekdayOf(date))
    case 'month': return isoDate(year, month, 1)
    case 'year': return isoDate(year, 1, 1)
  }
}

/** Last civil date (inclusive) of the period that starts on `start`. */
export function periodEnd(horizon: Horizon, start: string): string {
  switch (horizon) {
    case 'day': return start
    case 'week': return addDays(start, 6)
    case 'month': return addDays(addMonths(start, 1), -1)
    case 'year': return addDays(addMonths(start, 12), -1)
  }
}

/** `date` moved by `steps` periods; months clamp the day (31 Jan + 1 month = 28 Feb). */
export function shiftDate(horizon: Horizon, date: string, steps: number): string {
  switch (horizon) {
    case 'day': return addDays(date, steps)
    case 'week': return addDays(date, 7 * steps)
    case 'month': return addMonths(date, steps)
    case 'year': return addMonths(date, 12 * steps)
  }
}

/** Every civil date from `start` to `end`, both inclusive. */
export function datesBetween(start: string, end: string): string[] {
  const out: string[] = []
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(d)
  return out
}

/** Weeks (Sunday first) covering the month of `date`; days of other months are null. */
export function monthWeeks(date: string): (string | null)[][] {
  const first = periodStart('month', date)
  const days = datesBetween(first, periodEnd('month', first))
  const cells: (string | null)[] = [...Array<null>(weekdayOf(first)).fill(null), ...days]
  while (cells.length % 7) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7))
}

/** "Wednesday, 14 October" (the year is added when it differs from `currentYear`). */
export function longDate(date: string, currentYear?: number): string {
  const { year, month, day } = dateParts(date)
  return `${WEEKDAYS_LONG[weekdayOf(date)]}, ${day} ${MONTHS_LONG[month - 1]}${currentYear === year ? '' : ` ${year}`}`
}

/** "Wed 14 Oct" */
export function shortDate(date: string): string {
  const { month, day } = dateParts(date)
  return `${WEEKDAYS[weekdayOf(date)]} ${day} ${MONTHS[month - 1]}`
}

/** "14 Oct" */
function dayMonth(date: string): string {
  const { month, day } = dateParts(date)
  return `${day} ${MONTHS[month - 1]}`
}

/** "11 – 17 Oct", "28 Sep – 4 Oct", "28 Dec 2026 – 3 Jan 2027". */
export function rangeLabel(start: string, end: string): string {
  const a = dateParts(start), b = dateParts(end)
  if (a.year !== b.year) return `${dayMonth(start)} ${a.year} – ${dayMonth(end)} ${b.year}`
  if (a.month !== b.month) return `${dayMonth(start)} – ${dayMonth(end)}`
  return `${a.day} – ${b.day} ${MONTHS[b.month - 1]}`
}

/** Heading for a period: "Wednesday, 14 October", "11 – 17 October 2026", "October 2026", "2026". */
export function periodTitle(horizon: Horizon, start: string, currentYear?: number): string {
  const { year, month } = dateParts(start)
  switch (horizon) {
    case 'day': return longDate(start, currentYear)
    case 'week': {
      const end = periodEnd('week', start)
      const label = rangeLabel(start, end)
      return dateParts(end).year === year && year !== currentYear ? `${label} ${year}` : label
    }
    case 'month': return `${MONTHS_LONG[month - 1]} ${year}`
    case 'year': return String(year)
  }
}

/** Compact label for the date navigator: "Wed 14 Oct", "11 – 17 Oct", "Oct 2026", "2026". */
export function periodShortLabel(horizon: Horizon, start: string): string {
  const { year, month } = dateParts(start)
  switch (horizon) {
    case 'day': return shortDate(start)
    case 'week': return rangeLabel(start, periodEnd('week', start))
    case 'month': return `${MONTHS[month - 1]} ${year}`
    case 'year': return String(year)
  }
}

const RELATIVE: Record<Horizon, [string, string, string]> = {
  day: ['Yesterday', 'Today', 'Tomorrow'],
  week: ['Last week', 'This week', 'Next week'],
  month: ['Last month', 'This month', 'Next month'],
  year: ['Last year', 'This year', 'Next year'],
}

/** "Today", "Next week", ... when the period is next to the current one, else null. */
export function relativeLabel(horizon: Horizon, start: string, today: string): string | null {
  const current = periodStart(horizon, today)
  for (const step of [-1, 0, 1] as const) {
    if (periodStart(horizon, shiftDate(horizon, current, step)) === start) return RELATIVE[horizon][step + 1]
  }
  return null
}
