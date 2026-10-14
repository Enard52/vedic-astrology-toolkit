// Mild panchanga cautions for new beginnings. Original wording.
// SPDX-License-Identifier: AGPL-3.0-or-later

export const PANCHANGA_TEXT = {
  rikta: (tithiName: string): string =>
    `${tithiName} is a Rikta ("empty") tithi, traditionally avoided for starting important ventures; routine work and finishing tasks are fine.`,
  amavasya: 'New Moon (Amavasya) is traditionally a day for rest, reflection and remembrance rather than new beginnings.',
  vishti: (when: string): string =>
    `Vishti (Bhadra) karana runs ${when}; tradition advises against starting new ventures during it.`,
} as const
