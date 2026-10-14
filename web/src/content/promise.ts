// Chart-specific dasha and transit wording from the natal promise (engine/promise.ts): which houses
// a dasha lord rules and occupies from the lagna, how strong it is, and what that tends to mean for
// its period. Original wording; tendencies, never certainties.
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { FunctionalRole } from '@/engine/functional'
import type { LordPromise } from '@/engine/promise'
import type { Effect, Planet } from '@/engine/types'
import { capitalize, joinList, ordinal, type ByHouse } from './format'
import { YOGA_CONTENT } from './yogas'

/** Life areas of the houses counted from the lagna, short enough to list ("home life and career"). */
export const HOUSE_AREAS: ByHouse<string> = [
  'personal goals', 'family finances', 'your own initiative', 'home life', 'creative pursuits', 'daily work',
  'partnerships', 'deep changes', 'good fortune', 'career', 'gains', 'rest',
]

export type DashaScope = 'period' | 'sub-period' | 'phase'

/** The scope of a dasha level: mahadasha, antardasha, pratyantardasha. */
export const scopeOfLevel = (level: number): DashaScope => (level <= 0 ? 'period' : level === 1 ? 'sub-period' : 'phase')

/** "Venus rules your 4th and 9th and sits in your 11th"; the nodes act for their sign lord. */
export function lordPlacement(p: LordPromise): string {
  const who = p.yogakaraka ? `${p.planet}, your yogakaraka,` : p.planet
  if (!p.rules.length) return `${who} sits in your ${ordinal(p.house)} and acts for its sign lord, ${p.dispositor}`
  return `${who} rules your ${joinList(p.rules.map(ordinal))} and sits in your ${ordinal(p.house)}`
}

/** "is exalted and strong in your chart", "has modest strength", or '' when nothing stands out. */
export function lordCondition(p: LordPromise): string {
  const notes: string[] = []
  if (p.dignity === 'exalted') notes.push('is exalted')
  else if (p.dignity === 'own' || p.dignity === 'moolatrikona') notes.push('is in its own sign')
  else if (p.dignity === 'debilitated') notes.push('is debilitated')
  if (p.strengthRatio !== null && p.strengthRatio >= 1.25) notes.push('is strong in your chart')
  else if (p.strengthRatio !== null && p.strengthRatio < 0.9) notes.push('has modest strength')
  if (p.combust) notes.push('sits close to the Sun')
  return joinList(notes)
}

/** The life areas a lord's period tends to touch: the houses it rules, or the one a node occupies. */
export const lordAreas = (p: LordPromise): string => joinList((p.rules.length ? p.rules : [p.house]).map((h) => HOUSE_AREAS[h - 1]))

const OUTLOOK: Readonly<Record<'1' | '0' | '-1', (scope: DashaScope, areas: string) => string>> = {
  '1': (scope, areas) => `this ${scope} tends to support ${areas}`,
  '0': (scope, areas) => `this ${scope} tends to bring both openings and effort around ${areas}`,
  '-1': (scope, areas) => `this ${scope} tends to ask for patience around ${areas}, where steady habits help most`,
}

const outlook = (p: LordPromise, scope: DashaScope, effect: Effect = p.effect) => OUTLOOK[String(effect) as '1' | '0' | '-1'](scope, lordAreas(p))

/** The classical name of a yoga ("Gaja-Kesari" from "Gaja-Kesari: Jupiter angular to the Moon"). */
const yogaName = (name: string) => (YOGA_CONTENT[name]?.title ?? name).split(':')[0].replace(/ \(\d+\)$/, '')

/**
 * Two or three sentences on a dasha lord in this chart: its lordship and place, its condition and
 * what the period tends to bring, and a Vipareeta or yoga note when there is one. `effect` is the
 * outlook to state (the whole running chain's, when the caller scores the chain; else the lord's).
 */
export function lordOutlook(p: LordPromise, scope: DashaScope, effect: Effect = p.effect): string {
  const condition = lordCondition(p)
  const out = [`${lordPlacement(p)}.`, condition ? `It ${condition}, so ${outlook(p, scope, effect)}.` : `${capitalize(outlook(p, scope, effect))}.`]
  if (p.vipareeta) out.push('As a lord of a hard house placed in another, it can turn obstacles to your advantage.')
  else if (p.supportiveYogas.length) out.push(`It also helps form ${yogaName(p.supportiveYogas[0])} in your chart.`)
  else if (p.challengingYogas.length) out.push(`It also takes part in ${yogaName(p.challengingYogas[0])}, so give its themes a little extra care.`)
  return out.join(' ')
}

/** One sentence: "Saturn rules your 10th and 11th, so this sub-period tends to support career and gains." */
export function lordBrief(p: LordPromise, scope: DashaScope): string {
  const lead = p.rules.length ? `${p.planet} rules your ${joinList(p.rules.map(ordinal))}` : `${p.planet} sits in your ${ordinal(p.house)}`
  return `${lead}, so ${outlook(p, scope)}.`
}

/** Title of the running sub-period's reason. */
export function dashaPromiseTitle(lord: Planet, effect: Effect): string {
  return `${lord} sub-period: ${effect > 0 ? 'well supported in your chart' : effect < 0 ? 'asks for patience in your chart' : 'mixed in your chart'}`
}

/**
 * The running chain as a whole, for the informational dasha reason: the main period's lord in
 * this chart, how the sub-lord sits from it, and the current phase.
 */
export function dashaChainText(md: LordPromise, ad: LordPromise, pd: LordPromise | undefined, fromMain: number | null): string {
  const out = [`The ${md.planet} period frames these years: ${lordPlacement(md)}.`]
  if (fromMain === null) out.push(`Its own sub-period concentrates those themes.`)
  else if ([1, 4, 5, 7, 9, 10].includes(fromMain)) out.push(`${ad.planet} sits in the ${ordinal(fromMain)} from ${md.planet}, a helpful angle for the two to work together.`)
  else if ([6, 8, 12].includes(fromMain)) out.push(`${ad.planet} sits in the ${ordinal(fromMain)} from ${md.planet}, so the two may pull in different directions at times.`)
  if (pd && pd.planet !== ad.planet) {
    const verb = pd.effect > 0 ? 'lends support to' : pd.effect < 0 ? 'asks for care with' : 'stirs up'
    out.push(`For now the ${pd.planet} phase ${verb} ${lordAreas(pd)}.`)
  }
  return out.join(' ')
}

/** A dasha level starting within the period, read for this chart. */
export function dashaChangePromiseText(chain: readonly Planet[], lord: LordPromise): string {
  return `A new dasha phase (${chain.join('–')}) begins. ${lordBrief(lord, scopeOfLevel(chain.length - 1))}`
}

/** A sentence added to a transit reason when the planet's functional role tilts its weight. */
export function functionalNote(role: FunctionalRole, yogakaraka: boolean, effect: Effect): string {
  const friendly = yogakaraka || role === 'benefic'
  if (effect > 0) return friendly ? 'As a helpful planet for your ascendant, its support counts for a little more.' : 'It is a harder planet for your ascendant, so the help may come with some effort.'
  return friendly ? 'As a helpful planet for your ascendant, it tends to soften the strain.' : 'It is also a harder planet for your ascendant, so give this one a little more care.'
}
