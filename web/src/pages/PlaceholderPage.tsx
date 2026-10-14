import { Hourglass, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'wouter'
import { Button } from '@/ui/components/Button'
import { EmptyState } from '@/ui/components/EmptyState'
import { Page } from '@/ui/layout/Page'

export interface PlaceholderPageProps {
  title: string
  description?: ReactNode
  icon?: LucideIcon
}

/** Stand-in for a page that is not built yet (or a route that does not exist). */
export default function PlaceholderPage({ title, description = 'This view is being prepared. Check back soon.', icon = Hourglass }: PlaceholderPageProps) {
  return (
    <Page width="narrow">
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={
          <Button asChild variant="secondary">
            <Link href="/">Back to home</Link>
          </Button>
        }
      />
    </Page>
  )
}
