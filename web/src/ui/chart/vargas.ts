// Names and one-line themes of the 20 divisional charts (vargas) the engine computes.
// Names and themes follow Parasara's shodasa-varga list (BPHS ch. 6-7) and, for the
// non-shodasa D5, D6, D8 and D11, P. V. R. Narasimha Rao's book ch. 6 (the toolkit's
// reference). Wording is original and deliberately brief.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { VARGAS } from '@/engine/core'

export interface VargaInfo {
  /** Division number, e.g. 9 for the navamsa. */
  n: number
  /** Sanskrit name, e.g. "Navamsa". */
  name: string
  /** Main life areas the chart is read for. */
  theme: string
}

const INFO: Record<number, [string, string]> = {
  1: ['Rasi', 'The birth chart: body, temperament and life as a whole'],
  2: ['Hora', 'Wealth and resources'],
  3: ['Drekkana', 'Siblings, courage and initiative'],
  4: ['Chaturthamsa', 'Home, property and fortune'],
  5: ['Panchamsa', 'Fame, authority and power'],
  6: ['Shashthamsa', 'Health and obstacles'],
  7: ['Saptamsa', 'Children and creativity'],
  8: ['Ashtamsa', 'Sudden events and longevity'],
  9: ['Navamsa', 'Marriage, dharma and inner strength'],
  10: ['Dasamsa', 'Career and public achievement'],
  11: ['Rudramsa', 'Trials, losses and endings'],
  12: ['Dwadasamsa', 'Parents and ancestry'],
  16: ['Shodasamsa', 'Vehicles, comforts and happiness'],
  20: ['Vimsamsa', 'Spiritual practice and devotion'],
  24: ['Chaturvimsamsa', 'Learning and education'],
  27: ['Nakshatramsa', 'Strengths and weaknesses'],
  30: ['Trimsamsa', 'Misfortunes and hidden troubles'],
  40: ['Khavedamsa', 'Maternal legacy; auspicious and inauspicious effects'],
  45: ['Akshavedamsa', 'Paternal legacy and character'],
  60: ['Shashtyamsa', 'Past karma; the finest detail of the whole chart'],
}

export const VARGA_INFO: readonly VargaInfo[] = VARGAS.map((n) => ({ n, name: INFO[n][0], theme: INFO[n][1] }))

export function vargaInfo(n: number): VargaInfo {
  const info = INFO[n]
  if (!info) throw new Error(`Unknown varga D-${n}`)
  return { n, name: info[0], theme: info[1] }
}

/** "Navamsa · D9" */
export const vargaLabel = (n: number): string => `${vargaInfo(n).name} · D${n}`
