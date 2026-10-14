// Page header of the forecast screens: whose forecast, which period, and the date controls.
// Switching between Today, Week, Month, Year and Chart is the app's own navigation (the
// header tabs on wide screens, the bottom tab bar on phones), which keeps ?date= as it goes.
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ReactNode } from 'react'
import type { Horizon } from '@/engine/types'
import { profileName, type Profile } from '@/state/profiles'
import { Spinner } from '@/ui/components/Spinner'
import { Avatar } from '@/ui/layout/ProfileSwitcher'
import { DateNavigator } from './DateNavigator'
import { dateParts, periodTitle, relativeLabel } from './dates'
import type { ForecastDate } from './useForecastDate'

const KIND: Record<Horizon, string> = { day: 'Daily guidance', week: 'Weekly guidance', month: 'Monthly guidance', year: 'Yearly guidance' }

export interface ForecastHeaderProps {
  profile: Profile
  /** Short label after the name, e.g. "Today" or "Birth chart". */
  eyebrow: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Shows a small spinner while a newer result loads behind the current one. */
  loading?: boolean
  action?: ReactNode
}

export function ForecastHeader({ profile, eyebrow, title, description, loading, action }: ForecastHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 sm:mb-8">
      <div className="min-w-0">
        <p className="flex min-w-0 items-center gap-2 text-sm text-[var(--text-muted)]">
          <Avatar profile={profile} className="size-6 text-[0.55rem]" />
          <span className="truncate font-medium text-[var(--text)]">{profileName(profile)}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0 font-semibold text-[var(--accent-text)]">{eyebrow}</span>
          {loading && <Spinner className="size-4" label="Updating" />}
        </p>
        <h1 className="mt-2 text-balance font-display text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">{title}</h1>
        {description && <p className="mt-2 text-[0.95rem] text-[var(--text-muted)]">{description}</p>}
      </div>
      {action}
    </header>
  )
}

/** Header for a dated forecast screen, with the navigator for its period. */
export function PeriodHeader({ profile, horizon, nav, loading }: { profile: Profile; horizon: Horizon; nav: ForecastDate; loading?: boolean }) {
  return (
    <ForecastHeader
      profile={profile}
      eyebrow={relativeLabel(horizon, nav.anchor, nav.today) ?? KIND[horizon]}
      title={periodTitle(horizon, nav.anchor, dateParts(nav.today).year)}
      loading={loading}
      action={<DateNavigator horizon={horizon} nav={nav} className="w-full sm:w-auto" />}
    />
  )
}
