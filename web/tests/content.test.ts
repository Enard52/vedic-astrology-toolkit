import { describe, expect, it } from 'vitest'
import {
  binduNote, CAUTION_PHRASE, DAY_HEADLINE_VARIANTS, CHANDRASHTAMA_TEXT, CHANDRA_BALA_TEXT, dashaChangeText, dashaCombination, dashaTransitText, DASHA_THEMES,
  dayHeadline, GOCHARA_TEXT, HOUSE_THEMES, joinList, MOON_CHANGE_TEXT, MUNTHA_TEXT, NO_SADE_SATI_TEXT, ordinal, PANCHANGA_TEXT,
  PERIOD_TEXT, periodHeadline, PLANET_THEMES, SATURN_PHASE_TEXT, SATURN_PHASE_TITLE, SOURCES, STATION_TEXT, SUPPORT_PHRASE, TARA_TEXT,
  vedhaNote, vipareetaNote, yearHeadline,
} from '@/content'
import { TARA_NAMES } from '@/engine/moon'
import type { SaturnPhase } from '@/engine/saturn'
import { PLANETS, type Effect, type Rating } from '@/engine/types'

/** Words that would make the guidance fatalistic, alarming or overconfident. */
const BANNED = /\b(death|deaths|die|dies|dying|disaster\w*|guarantee\w*|cure\w*|will definitely|certainly will|doom\w*|curse\w*|fatal\w*|catastroph\w*|ruin\w*|tragedy|tragic|accident\w*|widow\w*|sinful|punish\w*)\b/i

const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z"(])/)
const words = (s: string) => s.split(/\s+/).filter(Boolean).length

const PHASES: SaturnPhase[] = ['sade_sati_rising', 'sade_sati_peak', 'sade_sati_setting', 'ashtama', 'ardhashtama']
const RATINGS: Rating[] = ['favourable', 'mixed', 'challenging']
const EFFECTS: Effect[] = [1, 0, -1]

/** Every user-facing string of the library, with template functions called on sample arguments. */
function allTexts(): string[] {
  const out: string[] = [
    ...PLANETS.flatMap((p) => GOCHARA_TEXT[p]),
    ...PLANETS.flatMap((p) => [PLANET_THEMES[p].short, PLANET_THEMES[p].theme, DASHA_THEMES[p]]),
    ...HOUSE_THEMES, ...MUNTHA_TEXT, ...Object.values(TARA_TEXT), CHANDRA_BALA_TEXT.good, CHANDRA_BALA_TEXT.bad, CHANDRASHTAMA_TEXT,
    MOON_CHANGE_TEXT, NO_SADE_SATI_TEXT, ...Object.values(SATURN_PHASE_TEXT), ...Object.values(SATURN_PHASE_TITLE),
    ...Object.values(SUPPORT_PHRASE), ...Object.values(CAUTION_PHRASE), ...Object.values(SOURCES),
    PANCHANGA_TEXT.amavasya, PANCHANGA_TEXT.rikta('Navami'), PANCHANGA_TEXT.vishti('until 11:20'),
    PERIOD_TEXT.bestDays('Tue 20 Oct'), PERIOD_TEXT.chandrashtamaDays('Sat 24 – Sun 25 Oct'), PERIOD_TEXT.toughDays('Fri 23 Oct'),
    PERIOD_TEXT.sadeSatiSpan('1 Jan 2020', '29 Mar 2025'), PERIOD_TEXT.nextSadeSati('Dec 2046'), PERIOD_TEXT.tajakaYear('8 Mar 2026', '9 Mar 2027'),
  ]
  for (const p of PLANETS) {
    out.push(vedhaNote(p, ['Mars', 'Saturn'], 9), vipareetaNote([p], 3), STATION_TEXT.retrograde(p, PLANET_THEMES[p].short), STATION_TEXT.direct(p, PLANET_THEMES[p].short))
    for (const e of EFFECTS) out.push(dashaTransitText(p, e))
    for (const q of PLANETS) out.push(dashaCombination(p, q, 'Sun'), dashaCombination(p, q), dashaChangeText([p, q]))
  }
  for (let b = 0; b <= 8; b++) out.push(binduNote(b, true), binduNote(b, false))
  return out
}

describe('interpretation library', () => {
  it('has a gochara text for each of the 9 planets in each of the 12 houses, all distinct', () => {
    expect(Object.keys(GOCHARA_TEXT).sort()).toEqual([...PLANETS].sort())
    const all = PLANETS.flatMap((p) => GOCHARA_TEXT[p])
    expect(all).toHaveLength(108)
    expect(new Set(all).size).toBe(108)
  })

  it('covers every planet, house, tara, Saturn phase and Muntha house', () => {
    expect(Object.keys(PLANET_THEMES).sort()).toEqual([...PLANETS].sort())
    expect(Object.keys(DASHA_THEMES).sort()).toEqual([...PLANETS].sort())
    expect(HOUSE_THEMES).toHaveLength(12)
    expect(MUNTHA_TEXT).toHaveLength(12)
    expect(Object.keys(TARA_TEXT).sort()).toEqual([...TARA_NAMES].sort())
    expect(Object.keys(SATURN_PHASE_TEXT).sort()).toEqual([...PHASES].sort())
    expect(Object.keys(SATURN_PHASE_TITLE).sort()).toEqual([...PHASES].sort())
  })

  it('has headline phrases for every factor that can lead a forecast', () => {
    const support = ['tara_bala', 'chandra_bala', 'dasha_transit', 'best_days', 'muntha', ...PLANETS.flatMap((p) => [`gochara_${p}`, `ingress_${p}`])]
    const caution = ['tara_bala', 'chandra_bala', 'chandrashtama', 'careful_days', 'dasha_transit', 'tithi', 'vishti', 'rahu_kalam', 'sade_sati', 'ashtama_shani', 'muntha',
      ...PLANETS.flatMap((p) => [`gochara_${p}`, `ingress_${p}`])]
    for (const f of support) expect(SUPPORT_PHRASE[f], f).toBeTruthy()
    for (const f of caution) expect(CAUTION_PHRASE[f], f).toBeTruthy()
  })

  it('has no empty strings, at most three sentences per text and no run-on sentences', () => {
    for (const t of allTexts()) {
      expect(t.trim(), JSON.stringify(t)).not.toBe('')
      expect(t).not.toMatch(/undefined|null|NaN|\$\{|\s{2}/)
      expect(sentences(t).length, t).toBeLessThanOrEqual(3)
      for (const s of sentences(t)) expect(words(s), s).toBeLessThanOrEqual(32)
    }
    for (const p of PLANETS) for (const t of GOCHARA_TEXT[p]) expect(sentences(t), t).toHaveLength(1)
  })

  it('keeps a safe, non-fatalistic tone', () => {
    for (const t of allTexts()) expect(t, t).not.toMatch(BANNED)
  })

  it('writes complete, short headlines for every rating and phrase combination', () => {
    const supports = [undefined, ...Object.values(SUPPORT_PHRASE)]
    const cautions = [undefined, ...Object.values(CAUTION_PHRASE)]
    const lines: string[] = []
    for (const r of RATINGS) {
      for (const s of supports) {
        for (const c of cautions) {
          lines.push(yearHeadline(r, s, c))
          for (let v = 0; v < DAY_HEADLINE_VARIANTS; v++) lines.push(dayHeadline(r, s, c, v))
        }
      }
      for (const best of [undefined, 'Tue 20 Oct', '19, 24 and 30 Oct']) {
        for (const careful of [undefined, 'Sat 24 – Sun 25 Oct']) lines.push(periodHeadline('week', r, best, careful), periodHeadline('month', r, best, careful))
      }
    }
    for (const h of lines) {
      expect(h, h).toMatch(/^[A-Z].*[^.]\.$/)
      expect(h.length, h).toBeLessThanOrEqual(130)
      expect(h, h).not.toMatch(/undefined|\s{2}|\s[,.;:]/)
      expect(h, h).not.toMatch(BANNED)
    }
  })

  it('formats ordinals and lists', () => {
    expect([1, 2, 3, 4, 8, 11, 12, 13, 21, 22, 23].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '8th', '11th', '12th', '13th', '21st', '22nd', '23rd'])
    expect([joinList([]), joinList(['a']), joinList(['a', 'b']), joinList(['a', 'b', 'c'])]).toEqual(['', 'a', 'a and b', 'a, b and c'])
  })
})
