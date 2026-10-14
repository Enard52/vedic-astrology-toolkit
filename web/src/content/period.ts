// Sentences for the week, month and year summaries. Original wording; arguments are already
// formatted dates or date lists.
// SPDX-License-Identifier: AGPL-3.0-or-later

export const PERIOD_TEXT = {
  bestDays: (dates: string): string =>
    `On ${dates} the Moon and the transits line up most kindly, so plan important tasks for then when you can.`,
  chandrashtamaDays: (dates: string): string =>
    `The Moon crosses the 8th sign from your birth Moon on ${dates} (Chandrashtama); keep those days light and postpone big decisions.`,
  toughDays: (dates: string): string =>
    `Expect more friction on ${dates}; keep plans flexible and avoid unnecessary risks.`,
  sadeSatiSpan: (from: string, to: string): string => `This Sade Sati runs from ${from} to ${to}.`,
  nextSadeSati: (when: string): string => `The next one begins around ${when}.`,
  tajakaYear: (from: string, to: string): string => `This Tajaka (solar) year runs from ${from} to ${to}.`,
} as const
