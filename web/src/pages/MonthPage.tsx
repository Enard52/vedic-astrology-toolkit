// Month: the month's rating, a heatmap calendar of its days (tap or Enter opens a day), key
// dates (sign changes, retrogrades, Chandrashtama, dasha changes) and the reasons.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CalendarRange, Flag } from 'lucide-react'
import type { RouteComponentProps } from 'wouter'
import type { EventKind } from '@/engine/types'
import { cn } from '@/lib/cn'
import { useProfile } from '@/state/profiles'
import { shortPlaceName, useForecast, useTimingsPlace } from '@/ui/forecast/data'
import { relativeLabel } from '@/ui/forecast/dates'
import { EventsTimeline } from '@/ui/forecast/EventsTimeline'
import { PeriodHeader } from '@/ui/forecast/ForecastHeader'
import { ForecastDisclaimer, ForecastError, ForecastSkeleton, ProfileMissing } from '@/ui/forecast/ForecastStates'
import { MonthCalendar } from '@/ui/forecast/MonthCalendar'
import { RatingHero } from '@/ui/forecast/RatingHero'
import { ReasonList } from '@/ui/forecast/ReasonList'
import { Panel } from '@/ui/forecast/Section'
import { useForecastDate } from '@/ui/forecast/useForecastDate'
import { DayHighlights } from '@/ui/forecast/WeekStrip'
import { Page } from '@/ui/layout/Page'

/** The Moon's daily sign and star changes are left to the day view. */
const KEY_KINDS: ReadonlySet<EventKind> = new Set(['ingress', 'retrograde', 'direct', 'sankranti', 'chandrashtama', 'dasha', 'eclipse', 'sade_sati'])

export default function MonthPage({ params }: RouteComponentProps<{ id: string }>) {
  const profile = useProfile(params.id)
  const nav = useForecastDate('month', profile)
  const { data: forecast, error, loading, retry } = useForecast(params.id, 'month', nav.anchor)
  const { place } = useTimingsPlace(profile)
  if (!profile) return <ProfileMissing />
  const relative = relativeLabel('month', nav.anchor, nav.today)
  const parts = forecast?.parts ?? []
  return (
    <Page>
      <PeriodHeader profile={profile} horizon="month" nav={nav} loading={loading && forecast !== undefined} />
      {error ? <ForecastError error={error} onRetry={retry} /> : !forecast ? <ForecastSkeleton /> : (
        <div className={cn('space-y-4 transition-opacity duration-200 lg:space-y-6', loading && 'opacity-60')}>
          {/* Phones read hero, calendar, highlights; wide screens put the calendar beside the other two. */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
            <RatingHero forecast={forecast} label={relative ? `${relative}’s outlook` : 'The month’s outlook'} className="lg:col-span-7" />
            <Panel title="Calendar" description="Each day’s rating; open one for its timings" icon={<CalendarRange />} className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
              <MonthCalendar key={nav.anchor} parts={parts} month={nav.anchor} profileId={profile.id} today={nav.today} selected={nav.date} />
            </Panel>
            <DayHighlights forecast={forecast} profileId={profile.id} today={nav.today} timeZone={place.timeZone} className="lg:col-span-7" />
          </div>
          <div className="grid grid-cols-1 items-start gap-4 pt-4 lg:grid-cols-12 lg:gap-6">
            <ReasonList reasons={forecast.reasons} title="What shapes the month" description="Tap a reason for the detail and its classical source." className="lg:col-span-7" />
            <Panel title="Key dates" description={`Local times in ${shortPlaceName(place)}`} icon={<Flag />} className="lg:col-span-5">
              <EventsTimeline events={forecast.events.filter((e) => KEY_KINDS.has(e.kind))} timeZone={place.timeZone} grouped initial={10} empty="No major sign changes or stations this month." />
            </Panel>
          </div>
        </div>
      )}
      <ForecastDisclaimer />
    </Page>
  )
}
