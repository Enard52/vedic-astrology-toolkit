// Validation for the birth-details form and imported birth files. Resolves the
// UTC offset at the birth instant with the toolkit's clock-change rules
// (engine/time.ts): a skipped wall time is an error and a repeated one needs
// an explicit fold choice. Needs no WebAssembly.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Temporal } from 'temporal-polyfill'
import { fixedOffsetMinutes, isValidTimeZone, localToUtc } from '@/engine/time'
import type { BirthInput } from '@/engine/types'

export interface BirthDraft {
  name: string
  date: string
  time: string
  timeZone: string
  latitude: number | null
  longitude: number | null
  fold?: 0 | 1
  place?: string
}

export type BirthField = 'name' | 'date' | 'time' | 'place' | 'latitude' | 'longitude' | 'timeZone' | 'fold'

export interface FoldOption {
  fold: 0 | 1
  offsetMinutes: number
  /** UTC instant of this reading (ISO). */
  utc: string
}

export interface BirthCheck {
  errors: Partial<Record<BirthField, string>>
  /** Offset east of UTC in force at birth, once date, time and zone resolve. */
  offsetMinutes: number | null
  /** UTC instant of birth (ISO), when resolved. */
  utc: string | null
  /** The two readings of a wall time that occurred twice (clocks going back). */
  foldOptions: [FoldOption, FoldOption] | null
  /** Gentle advisories that do not block saving. */
  notes: string[]
  /** The cleaned input when there are no errors. */
  birth: BirthInput | null
}

export const MIN_YEAR = 1800
export const MAX_YEAR = 2200
/** IANA rules are well documented from 1970 on; earlier history is patchier. */
const RELIABLE_ZONE_YEAR = 1970

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/

const pad = (n: number) => String(n).padStart(2, '0')

function isRealDate(date: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const probe = new Date(Date.UTC(2000, mo - 1, d))
  probe.setUTCFullYear(y)
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === mo - 1 && probe.getUTCDate() === d
}

/** "UTC+05:30", "UTC-04:00", or with seconds for local mean time ("UTC+05:10:22"). */
export function formatOffset(minutes: number, prefix = 'UTC'): string {
  const total = Math.round(Math.abs(minutes) * 60)
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60
  return `${prefix}${minutes < 0 ? '-' : '+'}${pad(h)}:${pad(m)}${s ? `:${pad(s)}` : ''}`
}

/** Local mean time offset for a longitude, 4 minutes of time per degree: 77.5937° -> "+05:10:22". */
export const lmtOffset = (longitude: number): string => formatOffset(longitude * 4, '')

/**
 * fixedOffsetMinutes for text being typed: it throws on an out-of-range offset
 * such as "+05:60", which here is simply not a fixed offset (yet).
 */
export function typedFixedOffset(zone: string): number | null {
  try {
    return fixedOffsetMinutes(zone)
  } catch {
    return null
  }
}

const toIso = (epochMs: number) => new Date(Math.round(epochMs)).toISOString()

/**
 * IANA's own spelling of a zone name typed in any case ("asia/kolkata" ->
 * "Asia/Kolkata"), so exported files load where zone lookup is case-sensitive
 * (Python's zoneinfo on Linux). Links such as Asia/Calcutta are kept as typed.
 */
function zoneSpelling(zone: string): string {
  if (typedFixedOffset(zone) !== null) return zone
  try {
    return Temporal.Now.instant().toZonedDateTimeISO(zone).timeZoneId
  } catch {
    return zone
  }
}

const COORDINATE_RE = /^([+-]?)(\d+(?:[.,]\d*)?|[.,]\d+)\s*°?\s*([NSEW]?)$/i

/**
 * A typed coordinate in decimal degrees: null when blank, NaN when unreadable.
 * Accepts a decimal comma and a hemisphere letter as printed in atlases
 * ("33.87 S", "74.006W"); S and W are negative, and a letter for the other
 * axis (N on a longitude) is rejected.
 */
export function parseCoordinate(text: string, axis: 'latitude' | 'longitude'): number | null {
  const s = text.trim()
  if (!s) return null
  const m = COORDINATE_RE.exec(s)
  if (!m) return NaN
  const [, sign, digits, hemi] = m
  const h = hemi.toUpperCase()
  if (h && (axis === 'latitude' ? !'NS'.includes(h) : !'EW'.includes(h))) return NaN
  if (h && sign) return NaN
  const value = Number(digits.replace(',', '.'))
  return sign === '-' || h === 'S' || h === 'W' ? -value : value
}

export function checkBirth(d: BirthDraft): BirthCheck {
  const errors: BirthCheck['errors'] = {}
  const notes: string[] = []
  let offsetMinutes: number | null = null
  let utc: string | null = null
  let foldOptions: BirthCheck['foldOptions'] = null

  const name = d.name.trim()
  if (!name) errors.name = 'Enter a name for this chart.'
  else if (name.length > 60) errors.name = 'Keep the name under 60 characters.'

  const year = Number(d.date.slice(0, 4))
  if (!d.date) errors.date = 'Enter the date of birth.'
  else if (!isRealDate(d.date)) errors.date = 'Enter a real calendar date.'
  else if (year < MIN_YEAR || year > MAX_YEAR) errors.date = `Use a year between ${MIN_YEAR} and ${MAX_YEAR}.`

  if (!d.time) errors.time = 'Enter the time of birth, as written on the record.'
  else if (!TIME_RE.test(d.time)) errors.time = 'Enter a time such as 14:35 or 14:35:20.'

  const zone = d.timeZone.trim()
  const hasPlace = d.latitude !== null || d.longitude !== null || zone !== ''
  if (!hasPlace) {
    errors.place = 'Choose the birthplace from the list, or enter coordinates under Advanced.'
  } else {
    if (d.latitude === null) errors.latitude = 'Enter the latitude.'
    else if (!Number.isFinite(d.latitude)) errors.latitude = 'Enter decimal degrees, such as 12.2979 or 33.87 S.'
    else if (Math.abs(d.latitude) >= 90) errors.latitude = 'Latitude must be between -90 and 90 (north is positive).'
    if (d.longitude === null) errors.longitude = 'Enter the longitude.'
    else if (!Number.isFinite(d.longitude)) errors.longitude = 'Enter decimal degrees, such as 76.6393 or 74.006 W.'
    else if (Math.abs(d.longitude) > 180) errors.longitude = 'Longitude must be between -180 and 180 (east is positive).'
    if (!zone) errors.timeZone = 'Enter a time zone.'
    else if (!isValidTimeZone(zone)) errors.timeZone = 'Unknown time zone. Use a name such as Asia/Kolkata or an offset such as +05:30.'
  }

  if (!errors.date && !errors.time && zone && !errors.timeZone) {
    try {
      const first = localToUtc({ date: d.date, time: d.time, timeZone: zone, fold: 0 })
      const second = localToUtc({ date: d.date, time: d.time, timeZone: zone, fold: 1 })
      if (first.offsetMinutes !== second.offsetMinutes) {
        foldOptions = [
          { fold: 0, offsetMinutes: first.offsetMinutes, utc: toIso(first.epochMs) },
          { fold: 1, offsetMinutes: second.offsetMinutes, utc: toIso(second.epochMs) },
        ]
        if (d.fold === undefined) errors.fold = 'This clock time happened twice that night because the clocks went back. Choose which one.'
      }
      if (!errors.fold) {
        const chosen = foldOptions && d.fold === 1 ? second : first
        offsetMinutes = chosen.offsetMinutes
        utc = toIso(chosen.epochMs)
      }
    } catch {
      // localToUtc only throws here for a wall time skipped by a clock change.
      errors.time = 'This clock time never happened here: the clocks jumped forward that night. Check the record, which may give standard time.'
    }
  }

  if (!errors.date && year < RELIABLE_ZONE_YEAR && zone && !errors.timeZone && fixedOffsetMinutes(zone) === null) {
    notes.push(`Time-zone history before ${RELIABLE_ZONE_YEAR} is less certain. Check that the offset shown matches the clock time used where the birth was recorded (war time and local time were common); if not, set the offset under Advanced.`)
  }
  if (d.latitude !== null && Math.abs(d.latitude) > 66 && Math.abs(d.latitude) < 90) {
    notes.push('Near the poles the Sun can stay up or down all day, so sunrise-based timings may be unavailable.')
  }

  const ok = Object.keys(errors).length === 0
  const birth: BirthInput | null = ok
    ? {
        name, date: d.date, time: d.time, timeZone: zoneSpelling(zone),
        ...(foldOptions && d.fold !== undefined ? { fold: d.fold } : {}),
        latitude: d.latitude!, longitude: d.longitude!,
        ...(d.place?.trim() ? { place: d.place.trim() } : {}),
      }
    : null
  return { errors, offsetMinutes, utc, foldOptions, notes, birth }
}
