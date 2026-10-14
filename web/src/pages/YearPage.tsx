// Year: the year's rating, twelve months at a glance, the big transits (Jupiter, Saturn,
// Rahu and Ketu with houses from the Moon, plus Saturn's phases), dasha periods within the
// year, the Muntha of the Tajaka year and the reasons.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { BarChart3, Flag, Hourglass, Orbit } from 'lucide-react'
import type { RouteComponentProps } from 'wouter'
import { addDays, localToJd } from '@/engine/time'
import { cn } from '@/lib/cn'
import { useProfile } from '@/state/profiles'
import { shortPlaceName, useChartData, useForecast, useTimingsPlace } from '@/ui/forecast/data'
import { EventsTimeline } from '@/ui/forecast/EventsTimeline'
import { dateParts, periodEnd, relativeLabel } from '@/ui/forecast/dates'
import { PeriodHeader } from '@/ui/forecast/ForecastHeader'
import { ForecastDisclaimer, ForecastError, ForecastSkeleton, ProfileMissing } from '@/ui/forecast/ForecastStates'
import { RatingHero } from '@/ui/forecast/RatingHero'
import { ReasonList } from '@/ui/forecast/ReasonList'
import { Panel } from '@/ui/forecast/Section'
import { DashaBands, TransitBands, type YearRange } from '@/ui/forecast/TransitBands'
import { useForecastDate, useNowJd } from '@/ui/forecast/useForecastDate'
import { MunthaCard, YearMonths } from '@/ui/forecast/YearMonths'
import { Page } from '@/ui/layout/Page'

export default function YearPage({ params }: RouteComponentProps<{ id: string }>) {
  const profile = useProfile(params.id)
  const nav = useForecastDate('year', profile)
  const { data: forecast, extras, error, loading, retry } = useForecast(params.id, 'year', nav.anchor)
  const chartData = useChartData(params.id)
  const { place } = useTimingsPlace(profile)
  const nowJd = useNowJd()
  if (!profile) return <ProfileMissing />
  const zone = place.timeZone
  const relative = relativeLabel('year', nav.anchor, nav.today)
  const range: YearRange = {
    year: dateParts(nav.anchor).year,
    startJd: localToJd(nav.anchor, zone),
    endJd: localToJd(addDays(periodEnd('year', nav.anchor), 1), zone),
    timeZone: zone,
    nowJd,
  }
  return (
    <Page>
      <PeriodHeader profile={profile} horizon="year" nav={nav} loading={loading && forecast !== undefined} />
      {error ? <ForecastError error={error} onRetry={retry} /> : !forecast ? <ForecastSkeleton /> : (
        <div className={cn('space-y-4 transition-opacity duration-200 lg:space-y-6', loading && 'opacity-60')}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            <RatingHero forecast={forecast} label={relative ? `${relative}’s outlook` : 'The year’s outlook'} className="lg:col-span-7" />
            <Panel title="Month by month" icon={<BarChart3 />} className="lg:col-span-5">
              <YearMonths parts={forecast.parts ?? []} profileId={profile.id} today={nav.today} />
            </Panel>
          </div>
          {extras?.transits && (
            <Panel title="Big transits" description="Slow planets through the year, with houses counted from your birth Moon" icon={<Orbit />}>
              <TransitBands tracks={extras.transits} saturn={extras.saturn} range={range} />
            </Panel>
          )}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
            <Panel title="Dasha periods" description="Vimsottari periods running this year" icon={<Hourglass />} className="lg:col-span-7">
              {chartData.data ? <DashaBands dashas={chartData.data.dashas} range={range} /> : <p className="text-sm text-[var(--text-muted)]">{chartData.error ? chartData.error.message : 'Loading the dasha periods…'}</p>}
            </Panel>
            {extras?.muntha && <MunthaCard muntha={extras.muntha} timeZone={zone} className="lg:col-span-5" />}
          </div>
          <div className="grid grid-cols-1 items-start gap-4 pt-4 lg:grid-cols-12 lg:gap-6">
            <ReasonList reasons={forecast.reasons} title="What shapes the year" description="Tap a reason for the detail and its classical source." className="lg:col-span-7" />
            <Panel title="Key dates" description={`Local times in ${shortPlaceName(place)}`} icon={<Flag />} className="lg:col-span-5">
              <EventsTimeline events={forecast.events} timeZone={zone} grouped initial={8} empty="No sign changes of the slow planets this year." />
            </Panel>
          </div>
        </div>
      )}
      <ForecastDisclaimer />
    </Page>
  )
}
