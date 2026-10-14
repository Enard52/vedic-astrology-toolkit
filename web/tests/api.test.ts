// The worker-facing forecast, chart and timings calls: plain data in and out, the extras the
// screens need, settings that change results, and context reuse across views.
import { beforeAll, describe, expect, it } from 'vitest'
import { engineApi } from '@/engine/api'
import { houseFrom, signOf } from '@/engine/core'
import { planetLongitude } from '@/engine/ephem'
import { contextFor, forecastDay } from '@/engine/predict'
import { dayTimings } from '@/engine/muhurta'
import { addDays, localToJd } from '@/engine/time'
import { PRESETS, type BirthInput } from '@/engine/types'

const BENGALURU = { latitude: 12.9719, longitude: 77.5937, timeZone: 'Asia/Kolkata' }
/** The e2e profile: Bengaluru, 12 May 1990, 06:00 IST. */
const BIRTH: BirthInput = { name: 'Asha', date: '1990-05-12', time: '06:00', ...BENGALURU, place: 'Bengaluru, Karnataka, India' }

beforeAll(() => engineApi.init())

describe('engineApi.forecast', () => {
  it('returns a day with timings, the Moon at midday and the Chandrashtama stay', () => {
    const { forecast, extras } = engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'day', '2026-10-14')
    expect(forecast).toMatchObject({ horizon: 'day', start: '2026-10-14', end: '2026-10-14' })
    expect(forecast.timings?.choghadiya).toHaveLength(16)
    const sd = forecast.timings!.solarDay
    const moon = extras.moon!
    // The Moon card agrees with the day's own Tara bala reason.
    expect(forecast.reasons.find((r) => r.factor === 'tara_bala')!.title).toContain(moon.nakshatra.name)
    expect(moon.longitude).toBeCloseTo(planetLongitude((sd.sunriseJd + sd.sunsetJd) / 2, 'Moon', PRESETS.popular).longitude, 6)
    const chandrashtama = forecast.reasons.some((r) => r.factor === 'chandrashtama')
    expect(extras.chandrashtama !== undefined).toBe(chandrashtama)
    expect(structuredClone({ forecast, extras })).toEqual({ forecast, extras })
  })

  it('finds a Chandrashtama stay overlapping the day when there is one', () => {
    let found = 0
    for (let i = 0; i < 30 && !found; i++) {
      const date = addDays('2026-10-01', i)
      const { forecast, extras } = engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'day', date)
      if (!extras.chandrashtama) continue
      const sd = forecast.timings!.solarDay
      expect(extras.chandrashtama.startJd).toBeLessThan(sd.nextSunriseJd)
      expect(extras.chandrashtama.endJd).toBeGreaterThan(sd.sunriseJd)
      found++
    }
    expect(found).toBe(1)
  })

  it('returns weeks, months and years with their parts', () => {
    const week = engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'week', '2026-10-11')
    expect(week.forecast.parts).toHaveLength(7)
    expect(week.extras).toEqual({})
    const month = engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'month', '2026-02-01')
    expect(month.forecast.parts).toHaveLength(28)
    const year = engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'year', '2026-01-01')
    expect(year.forecast.parts?.map((p) => p.start)).toEqual(Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, '0')}-01`))
  })

  it('tracks the slow planets through the year without gaps, with Ketu opposite Rahu', () => {
    const { extras } = engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'year', '2026-01-01')
    const a = localToJd('2026-01-01', BENGALURU.timeZone)
    const b = localToJd('2027-01-01', BENGALURU.timeZone)
    const ctx = contextFor(BIRTH, PRESETS.popular, BENGALURU)
    expect(extras.transits!.map((t) => t.planet)).toEqual(['Jupiter', 'Saturn', 'Rahu', 'Ketu'])
    for (const { planet, stays } of extras.transits!) {
      expect(stays[0].startJd).toBeLessThanOrEqual(a)
      expect(stays.at(-1)!.endJd).toBeGreaterThanOrEqual(b)
      stays.slice(1).forEach((s, i) => expect(s.startJd).toBe(stays[i].endJd))
      for (const s of stays) {
        const mid = (Math.max(s.startJd, a) + Math.min(s.endJd, b)) / 2
        expect(signOf(planetLongitude(mid, planet, PRESETS.popular).longitude)).toBe(s.sign)
        expect(s.house).toBe(houseFrom(ctx.natal.moonSign, s.sign))
      }
    }
    const [rahu, ketu] = [extras.transits![2].stays, extras.transits![3].stays]
    expect(ketu.map((s) => [s.startJd, (s.sign + 6) % 12])).toEqual(rahu.map((s) => [s.startJd, s.sign]))
    expect(extras.muntha).toMatchObject({ completedYears: 36 })
    expect(extras.muntha!.returnJd).toBeGreaterThan(localToJd('2026-05-01', BENGALURU.timeZone))
    for (const p of extras.saturn!) expect(p.endJd > a && p.startJd < b).toBe(true)
  })

  it('follows the settings: the dasha year changes dates, the ayanamsa changes positions', () => {
    const popular = engineApi.chart(BIRTH, PRESETS.popular)
    const book = engineApi.chart(BIRTH, PRESETS.book)
    expect(popular.dashas).toHaveLength(9)
    expect(popular.chart.settings.yearModel).toBe('solar')
    // The same first period starts at the same fraction before birth, but every later boundary drifts.
    expect(book.dashas[3].startJd).toBeLessThan(popular.dashas[3].startJd - 30)
    const raman = engineApi.chart(BIRTH, { ...PRESETS.popular, ayanamsa: 'raman' })
    expect(raman.chart.positions.Sun.longitude).toBeGreaterThan(popular.chart.positions.Sun.longitude + 1)

    const solarDay = engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'day', '2026-10-14').forecast
    const savanaDay = engineApi.forecast(BIRTH, PRESETS.book, BENGALURU, 'day', '2026-10-14').forecast
    expect(savanaDay.dasha[0].startJd).not.toBe(solarDay.dasha[0].startJd)
  })

  it('reuses one context per birth, calculation settings and place, ignoring display fields', () => {
    const app = { ...PRESETS.popular, preset: 'popular', theme: 'dark' } as typeof PRESETS.popular
    const named = { ...BENGALURU, name: 'Bengaluru, Karnataka, India' }
    const first = engineApi.forecast(BIRTH, app, named, 'day', '2026-10-20').forecast
    expect(first).toBe(forecastDay(contextFor(BIRTH, PRESETS.popular, BENGALURU), '2026-10-20'))
  })

  it('rejects malformed requests with plain errors', () => {
    expect(() => engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'day', '14/10/2026')).toThrow(RangeError)
    expect(() => engineApi.forecast(BIRTH, PRESETS.popular, BENGALURU, 'decade' as 'day', '2026-10-14')).toThrow(/Unknown horizon/)
    expect(() => engineApi.forecast({ ...BIRTH, latitude: 95 }, PRESETS.popular, BENGALURU, 'day', '2026-10-14')).toThrow(/Latitude/)
  })
})

describe('engineApi.dayTimings', () => {
  it('matches the muhurta module and is null in polar night', () => {
    expect(engineApi.dayTimings('2026-10-14', BENGALURU.latitude, BENGALURU.longitude, BENGALURU.timeZone))
      .toEqual(dayTimings('2026-10-14', BENGALURU.latitude, BENGALURU.longitude, BENGALURU.timeZone))
    expect(engineApi.dayTimings('2026-12-21', 78.2232, 15.6267, 'Arctic/Longyearbyen')).toBeNull()
  })
})
