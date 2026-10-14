import { ArrowRight, Download, MapPin, Pencil, Trash, Upload, UserPlus, Users } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'wouter'
import { birthFileName, parseToolkitBirth, toToolkitBirth } from '@/state/birthJson'
import { createProfile, deleteProfile, profileName, useProfiles, type Profile } from '@/state/profiles'
import { calcSettings, useSettings } from '@/state/settings'
import { Button } from '@/ui/components/Button'
import { Callout } from '@/ui/components/Callout'
import { Card } from '@/ui/components/Card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/ui/components/Dialog'
import { EmptyState } from '@/ui/components/EmptyState'
import { SectionHeader } from '@/ui/components/SectionHeader'
import { Tooltip } from '@/ui/components/Tooltip'
import { Avatar } from '@/ui/layout/ProfileSwitcher'
import { Page } from '@/ui/layout/Page'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "28 Apr 1990, 05:50" from the stored civil date and time. */
function formatBirth(p: Profile): string {
  const [y, m, d] = p.birth.date.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}, ${p.birth.time}`
}

function saveFile(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

type Message = { tone: 'info' | 'error'; text: string }

export default function ProfilesPage() {
  const profiles = useProfiles()
  const settings = useSettings()
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<Message | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Profile | null>(null)

  async function importFile(file: File) {
    try {
      let json: unknown
      try {
        json = JSON.parse(await file.text())
      } catch {
        throw new Error('the file is not valid JSON')
      }
      const profile = createProfile(parseToolkitBirth(json))
      setMessage({ tone: 'info', text: `Imported ${profileName(profile)}.` })
    } catch (e) {
      setMessage({ tone: 'error', text: `Could not import ${file.name}: ${e instanceof Error ? e.message : 'unreadable file'}.` })
    }
  }

  function exportProfile(p: Profile) {
    saveFile(birthFileName(p.birth), `${JSON.stringify(toToolkitBirth(p.birth, calcSettings(settings)), null, 2)}\n`)
  }

  const importButton = (
    <Button variant="secondary" onClick={() => fileInput.current?.click()}>
      <Upload aria-hidden /> Import
    </Button>
  )

  return (
    <Page>
      <SectionHeader
        level={1}
        eyebrow="Profiles"
        title="Saved charts"
        description="Profiles live only in this browser. Export one to keep a copy or open it in the Python toolkit."
        action={
          profiles.length > 0 && (
            <>
              {importButton}
              <Button asChild>
                <Link href="/new"><UserPlus aria-hidden /> New profile</Link>
              </Button>
            </>
          )
        }
      />
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void importFile(file)
          e.target.value = ''
        }}
      />

      <div aria-live="polite">
        {message && <Callout tone={message.tone === 'error' ? 'error' : 'info'} className="mt-6">{message.text}</Callout>}
      </div>

      {profiles.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Users}
          title="No profiles yet"
          description="Add your birth details to see your chart and daily guidance, or import a birth file from the Python toolkit."
          action={
            <>
              <Button asChild><Link href="/new"><UserPlus aria-hidden /> Add a profile</Link></Button>
              {importButton}
            </>
          }
        />
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <li key={p.id}>
              <Card className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar profile={p} className="size-11 text-sm" />
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-semibold tracking-tight">{profileName(p)}</h2>
                    <p className="text-sm text-[var(--text-muted)]">{formatBirth(p)}</p>
                  </div>
                </div>
                <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0">{p.birth.place || `${p.birth.latitude.toFixed(4)}, ${p.birth.longitude.toFixed(4)}`} · {p.birth.timeZone}</span>
                </p>
                <div className="mt-auto flex items-center gap-1 border-t border-[var(--divider)] pt-4">
                  <Button asChild size="sm" className="mr-auto h-11 sm:h-9">
                    <Link href={`/p/${p.id}/today`}>Open <ArrowRight aria-hidden /></Link>
                  </Button>
                  <Tooltip content="Edit">
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${profileName(p)}`}>
                      <Link href={`/p/${p.id}/edit`}><Pencil /></Link>
                    </Button>
                  </Tooltip>
                  <Tooltip content="Export birth JSON">
                    <Button variant="ghost" size="icon" aria-label={`Export ${profileName(p)} as JSON`} onClick={() => exportProfile(p)}>
                      <Download />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete">
                    <Button variant="ghost" size="icon" aria-label={`Delete ${profileName(p)}`} className="hover:text-[var(--bad-fg)]" onClick={() => setPendingDelete(p)}>
                      <Trash />
                    </Button>
                  </Tooltip>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-[0.8rem] leading-relaxed text-[var(--text-muted)]">
        Exports use the toolkit’s birth format (label, datetime, timezone, latitude, longitude and settings), so astrologers can run
        any toolkit command on them.
      </p>

      <Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogTitle>Delete {pendingDelete ? profileName(pendingDelete) : ''}?</DialogTitle>
          <DialogDescription>
            This removes the birth details from this browser. There is no other copy, so export it first if you may want it again.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Keep it</Button>
            </DialogClose>
            <Button
              variant="danger"
              onClick={() => {
                if (pendingDelete) deleteProfile(pendingDelete.id)
                setPendingDelete(null)
              }}
            >
              <Trash aria-hidden /> Delete profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  )
}
