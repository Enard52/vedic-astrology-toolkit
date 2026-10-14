import { BookOpen, Monitor, Moon, RotateCcw, SlidersHorizontal, Sparkles, Sun, Trash } from 'lucide-react'
import { RadioGroup } from 'radix-ui'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { deleteAllProfiles, useProfiles } from '@/state/profiles'
import {
  AYANAMSA_OPTIONS, NODE_OPTIONS, resetSettings, updateSettings, useSettings, YEAR_MODEL_OPTIONS,
  type ChartStyle, type PresetName,
} from '@/state/settings'
import { Button } from '@/ui/components/Button'
import { Card } from '@/ui/components/Card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/ui/components/Dialog'
import { Label } from '@/ui/components/Input'
import { SectionHeader } from '@/ui/components/SectionHeader'
import { SegmentedControl } from '@/ui/components/SegmentedControl'
import { Select } from '@/ui/components/Select'
import { Page } from '@/ui/layout/Page'

const PRESET_NOTES: Record<PresetName, string> = {
  popular: 'Lahiri ayanamsa, mean nodes and solar-year dashas: matches most Vedic software and printed panchangs.',
  book: 'Lahiri ayanamsa, mean nodes and 360-day dasha years, as in P. V. R. Narasimha Rao’s Vedic Astrology: An Integrated Approach.',
  custom: 'Your own combination of the options below.',
}

export default function SettingsPage() {
  const s = useSettings()
  const profiles = useProfiles()
  const ayanamsaNote = AYANAMSA_OPTIONS.find((o) => o.value === s.ayanamsa)?.note
  return (
    <Page width="narrow">
      <SectionHeader level={1} eyebrow="Settings" title="Preferences" description="Saved in this browser. Changes apply to every profile." />

      <div className="mt-8 space-y-6">
        <SettingsCard title="Calculation" description="How positions and dasha dates are computed. When unsure, keep Popular.">
          <Row label="Preset" note={PRESET_NOTES[s.preset]}>
            {(labelId) => (
              <SegmentedControl<PresetName>
                aria-labelledby={labelId}
                fullWidth
                value={s.preset}
                onValueChange={(preset) => updateSettings({ preset })}
                options={[
                  { value: 'popular', label: 'Popular', icon: <Sparkles aria-hidden /> },
                  { value: 'book', label: <>Book<span className="max-sm:hidden"> (Rao)</span></>, icon: <BookOpen aria-hidden /> },
                  { value: 'custom', label: 'Custom', icon: <SlidersHorizontal aria-hidden /> },
                ]}
              />
            )}
          </Row>
          <Row label="Ayanamsa" note={ayanamsaNote} htmlFor="ayanamsa">
            {() => (
              <Select id="ayanamsa" value={s.ayanamsa} onChange={(e) => updateSettings({ ayanamsa: e.target.value as typeof s.ayanamsa })}>
                {AYANAMSA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            )}
          </Row>
          <Row label="Rahu and Ketu" note={NODE_OPTIONS.find((o) => o.value === s.node)?.note}>
            {(labelId) => (
              <SegmentedControl aria-labelledby={labelId} fullWidth value={s.node} onValueChange={(node) => updateSettings({ node })} options={NODE_OPTIONS} />
            )}
          </Row>
          <Row label="Dasha year" note={YEAR_MODEL_OPTIONS.find((o) => o.value === s.yearModel)?.note} last>
            {(labelId) => (
              <SegmentedControl aria-labelledby={labelId} fullWidth value={s.yearModel} onValueChange={(yearModel) => updateSettings({ yearModel })} options={YEAR_MODEL_OPTIONS} />
            )}
          </Row>
        </SettingsCard>

        <SettingsCard title="Appearance">
          <Row label="Chart style" note="North Indian charts fix the houses and move the signs; South Indian charts fix the signs.">
            {(labelId) => <ChartStylePicker labelId={labelId} value={s.chartStyle} />}
          </Row>
          <Row label="Theme" note="System follows your device’s light or dark setting." last>
            {(labelId) => (
              <SegmentedControl
                aria-labelledby={labelId}
                fullWidth
                value={s.theme}
                onValueChange={(theme) => updateSettings({ theme })}
                options={[
                  { value: 'dark', label: 'Dark', icon: <Moon aria-hidden /> },
                  { value: 'light', label: 'Light', icon: <Sun aria-hidden /> },
                  { value: 'system', label: 'System', icon: <Monitor aria-hidden /> },
                ]}
              />
            )}
          </Row>
        </SettingsCard>

        <SettingsCard title="Your data" description="Profiles and settings are stored in this browser’s local storage and never uploaded. Clearing site data removes them.">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={resetSettings}>
              <RotateCcw aria-hidden /> Reset settings
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="danger" disabled={profiles.length === 0}>
                  <Trash aria-hidden /> Delete all profiles
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete all {profiles.length} profiles?</DialogTitle>
                <DialogDescription>Every saved birth chart is removed from this browser. This cannot be undone.</DialogDescription>
                <DialogFooter>
                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                  <DialogClose asChild><Button variant="danger" onClick={deleteAllProfiles}>Delete all</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SettingsCard>
      </div>
    </Page>
  )
}

function SettingsCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="sm:p-7">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  )
}

/** One setting: label, control and a one-line explanation. */
function Row({ label, note, htmlFor, last, children }: { label: string; note?: string; htmlFor?: string; last?: boolean; children: (labelId: string) => ReactNode }) {
  const labelId = useId()
  return (
    <div className={cn('space-y-2.5', !last && 'mb-6 border-b border-[var(--divider)] pb-6')}>
      <Label id={labelId} htmlFor={htmlFor}>{label}</Label>
      {children(labelId)}
      {note && <p className="text-[0.8rem] leading-snug text-[var(--text-muted)]">{note}</p>}
    </div>
  )
}

function ChartStylePicker({ labelId, value }: { labelId: string; value: ChartStyle }) {
  return (
    <RadioGroup.Root aria-labelledby={labelId} value={value} onValueChange={(v) => updateSettings({ chartStyle: v as ChartStyle })} className="grid grid-cols-2 gap-3">
      {(['north', 'south'] as const).map((style) => (
        <RadioGroup.Item
          key={style}
          value={style}
          className={cn(
            'group flex flex-col items-center gap-3 rounded-2xl border p-4 text-sm font-medium transition-colors',
            'border-[var(--surface-border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]',
            'data-[state=checked]:border-[var(--accent)] data-[state=checked]:bg-[var(--selected-bg)] data-[state=checked]:text-[var(--accent-text)]',
          )}
        >
          <ChartGlyph style={style} />
          {style === 'north' ? 'North Indian' : 'South Indian'}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

/** Miniature chart outlines for the style picker. */
function ChartGlyph({ style }: { style: ChartStyle }) {
  return (
    <svg viewBox="0 0 60 60" className="size-16 sm:size-20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="2" y="2" width="56" height="56" rx="3" />
      {style === 'north' ? (
        <path d="M2 2l56 56M58 2L2 58M30 2L58 30 30 58 2 30z" />
      ) : (
        <path d="M2 16h56M2 44h56M16 2v56M44 2v56M30 2v14M30 44v14M2 30h14M44 30h14" />
      )}
    </svg>
  )
}
