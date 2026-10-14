// Birth chart: North or South Indian chart with divisional charts, birth details with an
// export for astrologers, the birth panchanga, planet positions and the Vimsottari timeline.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Download, LayoutGrid, ListTree, MapPin, Pencil, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, type RouteComponentProps } from 'wouter'
import { birthFileName, toToolkitBirth } from '@/state/birthJson'
import { useProfile } from '@/state/profiles'
import { AYANAMSA_OPTIONS, calcSettings, updateSettings, useSettings, YEAR_MODEL_OPTIONS } from '@/state/settings'
import { Button } from '@/ui/components/Button'
import { ChartSwitcher, DashaTimeline, PanchangaCard, PlanetTable } from '@/ui/chart'
import { useChartData } from '@/ui/forecast/data'
import { longDate } from '@/ui/forecast/dates'
import { ForecastHeader } from '@/ui/forecast/ForecastHeader'
import { ForecastDisclaimer, ForecastError, ForecastSkeleton, ProfileMissing } from '@/ui/forecast/ForecastStates'
import { Panel } from '@/ui/forecast/Section'
import { useNowJd } from '@/ui/forecast/useForecastDate'
import { Page } from '@/ui/layout/Page'

function saveJson(name: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: 'application/json' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const coordinate = (value: number, pos: string, neg: string) => `${Math.abs(value).toFixed(4)}° ${value >= 0 ? pos : neg}`

export default function ChartPage({ params }: RouteComponentProps<{ id: string }>) {
  const profile = useProfile(params.id)
  const settings = useSettings()
  const { data, error, retry } = useChartData(params.id)
  const nowJd = useNowJd()
  if (!profile) return <ProfileMissing />
  const { birth } = profile
  const ayanamsa = AYANAMSA_OPTIONS.find((o) => o.value === settings.ayanamsa)?.label ?? settings.ayanamsa
  const yearModel = YEAR_MODEL_OPTIONS.find((o) => o.value === settings.yearModel)?.label ?? settings.yearModel
  return (
    <Page>
      <ForecastHeader
        profile={profile}
        eyebrow="Birth chart"
        title={longDate(birth.date)}
        description={<>{birth.time} · {birth.place || coordinate(birth.latitude, 'N', 'S')}</>}
        action={
          <Button asChild variant="secondary" size="sm" className="h-11 px-4">
            <Link href={`/p/${profile.id}/edit`}><Pencil aria-hidden /> Edit details</Link>
          </Button>
        }
      />
      {error ? <ForecastError error={error} onRetry={retry} /> : !data ? <ForecastSkeleton variant="chart" /> : (
        <div className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
            <Panel title="Chart" icon={<LayoutGrid />} className="lg:col-span-7">
              <ChartSwitcher
                chart={data.chart}
                chartStyle={settings.chartStyle}
                onChartStyleChange={(chartStyle) => updateSettings({ chartStyle })}
                caption={{ title: birth.name || 'Birth chart', subtitle: `${birth.date} · ${birth.time}\n${birth.place ?? ''}` }}
              />
            </Panel>
            <div className="space-y-4 lg:col-span-5 lg:space-y-6">
              <Panel title="Birth details" icon={<MapPin />}>
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
                  <Detail term="Date">{longDate(birth.date)}</Detail>
                  <Detail term="Time">{birth.time} <span className="text-[var(--text-muted)]">({birth.timeZone})</span></Detail>
                  <Detail term="Place">{birth.place || '—'}</Detail>
                  <Detail term="Coordinates">{coordinate(birth.latitude, 'N', 'S')}, {coordinate(birth.longitude, 'E', 'W')}</Detail>
                  <Detail term="Ayanamsa">{ayanamsa} <span className="text-[var(--text-muted)]">({data.chart.ayanamsaDegrees.toFixed(4)}°)</span></Detail>
                  <Detail term="Nodes · years">{settings.node === 'mean' ? 'Mean node' : 'True node'} · {yearModel}</Detail>
                </dl>
                <div className="mt-4 border-t border-[var(--divider)] pt-4">
                  <Button variant="secondary" className="w-full sm:w-auto" onClick={() => saveJson(birthFileName(birth), toToolkitBirth(birth, calcSettings(settings)))}>
                    <Download aria-hidden /> Export for astrologers (JSON)
                  </Button>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                    The birth file of the open-source Python toolkit, so an astrologer can recompute everything here.
                  </p>
                </div>
              </Panel>
              <PanchangaCard chart={data.chart} className="glass" />
            </div>
          </div>
          <Panel title="Planets" description="Sidereal positions at birth" icon={<Sparkles />}>
            <PlanetTable chart={data.chart} />
          </Panel>
          <Panel title="Vimsottari dasha" description="Planetary periods from birth; the running ones are marked" icon={<ListTree />}>
            <DashaTimeline periods={data.dashas} now={nowJd} timeZone={birth.timeZone} />
          </Panel>
        </div>
      )}
      <ForecastDisclaimer />
    </Page>
  )
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-[var(--text-muted)]">{term}</dt>
      <dd className="m-0 min-w-0 font-medium text-[var(--text)]">{children}</dd>
    </>
  )
}
