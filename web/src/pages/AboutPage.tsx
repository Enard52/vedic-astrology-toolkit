import { BookOpen, CodeXml, Compass, ExternalLink, Gauge, Scale, ShieldCheck, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { DISCLAIMER } from '@/engine/types'
import { Button } from '@/ui/components/Button'
import { Callout } from '@/ui/components/Callout'
import { Card } from '@/ui/components/Card'
import { SectionHeader } from '@/ui/components/SectionHeader'
import { SOURCE_URL } from '@/ui/layout/Footer'
import { Page } from '@/ui/layout/Page'

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-[var(--accent-text)] underline decoration-[var(--accent-soft)] underline-offset-4 hover:decoration-current">
      {children}
    </a>
  )
}

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <Card className="sm:p-8">
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold tracking-tight sm:text-2xl">
        <span className="chip grid size-10 shrink-0 place-items-center rounded-xl">
          <Icon aria-hidden className="size-5" strokeWidth={1.8} />
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-[var(--text-muted)] [&_strong]:font-semibold [&_strong]:text-[var(--text)]">{children}</div>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <Page width="narrow">
      <SectionHeader
        level={1}
        eyebrow="About"
        title="Jyotish Daily"
        description="A free, private companion for Vedic astrology: your birth chart and guidance for the day, week, month and year, worked out from classical rules entirely in your browser."
      />

      <div className="mt-8 space-y-5">
        <Section icon={Compass} title="What it is">
          <p>
            Jyotish Daily casts your sidereal birth chart and follows the sky forward from it: the Moon’s daily star, the slow
            planets’ transits, and your Vimsottari dasha periods. Each forecast shows the factors behind it and where each rule
            comes from, so you can weigh them yourself.
          </p>
          <p>
            There is no account and no server. Your birth details are stored in this browser, and every calculation runs on your
            device.
          </p>
        </Section>

        <Section icon={BookOpen} title="Methods and sources">
          <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-text)]">
            <li>
              <strong>Astronomy:</strong> Swiss Ephemeris 2.10.03 (Moshier mode) compiled to WebAssembly. Sidereal positions use
              the Lahiri ayanamsa and mean nodes unless you change them in Settings. Sunrise uses the Sun’s upper limb with standard
              refraction.
            </li>
            <li>
              <strong>Chart rules:</strong> divisional charts, panchanga, Vimsottari dasha and ashtakavarga follow P. V. R. Narasimha
              Rao’s <cite>Vedic Astrology: An Integrated Approach</cite>, as implemented and tested in the open-source Python Vedic
              Astrology Toolkit.
            </li>
            <li>
              <strong>Daily and transit guidance:</strong> classical gochara (transit) results counted from your natal Moon, Tara
              bala and Chandra bala, and the standard muhurta divisions of the day (Rahu Kalam, Yamaganda, Gulika, Abhijit) used by
              mainstream panchangs. Every reason in a forecast names its source.
            </li>
            <li>
              <strong>Dasha years:</strong> solar years of 365.2425 days by default, as most software uses; the book’s 360-day
              years are one tap away in Settings.
            </li>
            <li>
              <strong>Places and time zones:</strong> <ExtLink href="https://www.geonames.org/">GeoNames</ExtLink> for towns and
              coordinates, and your browser’s copy of the IANA time-zone database for the clock offset at the moment of birth.
            </li>
          </ul>
        </Section>

        <Section icon={Gauge} title="Accuracy">
          <p>
            The app runs the same Swiss Ephemeris code as the Python toolkit, and its planet longitudes agree with the toolkit to
            nine decimal places of a degree across 64 reference charts. The toolkit itself matches NASA JPL’s DE440s ephemeris
            within 1.2 arc-seconds for the Moon and 0.3 arc-seconds for the other bodies, and reproduces the book’s worked examples.
          </p>
          <p>
            <strong>Your birth time matters far more than any of this.</strong> The rising sign moves about one degree every four
            minutes, so a time rounded to the nearest half hour can change houses and divisional charts.
          </p>
        </Section>

        <Section icon={TriangleAlert} title="Limits">
          <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-text)]">
            <li>Ratings combine a handful of classical factors with fixed weights. They are a reading aid, not a measured probability.</li>
            <li>Time-zone history before 1970 is incomplete in places. Check the offset shown when you enter an older birth.</li>
            <li>Near the poles the Sun may not rise or set, and sunrise-based timings are then unavailable.</li>
            <li>Births between 1800 and 2200 are supported.</li>
          </ul>
          <Callout tone="warning" className="mt-4">{DISCLAIMER}</Callout>
        </Section>

        <Section icon={Scale} title="Licences and credits">
          <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-text)]">
            <li>
              This app is free software under the{' '}
              <ExtLink href="https://www.gnu.org/licenses/agpl-3.0.html">GNU Affero General Public License v3.0 or later</ExtLink>.
            </li>
            <li>Swiss Ephemeris is © Astrodienst AG, Zurich, and is used under the GNU AGPL.</li>
            <li>
              Place data © <ExtLink href="https://www.geonames.org/">GeoNames</ExtLink>, licensed under{' '}
              <ExtLink href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</ExtLink> (trimmed and re-encoded for size).
            </li>
            <li>Inter and Fraunces typefaces under the SIL Open Font License; icons from Lucide (ISC licence).</li>
            <li>
              The book and other cited sources remain their authors’ copyrighted works. This is an unofficial project, not
              affiliated with or endorsed by P. V. R. Narasimha Rao or Jagannatha Hora.
            </li>
          </ul>
        </Section>

        <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
              <ShieldCheck aria-hidden className="size-5 text-[var(--good-fg)]" /> Read the code
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Every calculation is open to inspection, and contributions are welcome.</p>
          </div>
          <Button asChild variant="secondary">
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">
              <CodeXml aria-hidden /> Source code <ExternalLink aria-hidden />
            </a>
          </Button>
        </Card>
      </div>
    </Page>
  )
}
