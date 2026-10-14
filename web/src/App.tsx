import { CircleHelp } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import { Route, Router, Switch, useLocation, type RouteComponentProps } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import LandingPage from '@/pages/LandingPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import { applyTheme, getSettings, useSettings, watchSystemTheme } from '@/state/settings'
import { Skeleton } from '@/ui/components/Spinner'
import { TooltipProvider } from '@/ui/components/Tooltip'
import { AppLayout } from '@/ui/layout/AppLayout'
import { Page } from '@/ui/layout/Page'

// Apply the saved theme before the first render to avoid a flash.
applyTheme(getSettings().theme)

const NewProfilePage = lazy(() => import('@/pages/NewProfilePage'))
const ProfilesPage = lazy(() => import('@/pages/ProfilesPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))

type PageModule = { default?: ComponentType<RouteComponentProps> }

// Pages built by other workstreams. A file that does not exist yet renders a
// placeholder, so the build stays green while they are written.
const LATER_PAGES = import.meta.glob<PageModule>('./pages/{TodayPage,WeekPage,MonthPage,YearPage,ChartPage}.tsx')

function laterPage(file: string, title: string) {
  return lazy(async () => {
    const load = LATER_PAGES[`./pages/${file}.tsx`]
    const Component = load ? (await load()).default : undefined
    return { default: Component ?? (() => <PlaceholderPage title={title} />) }
  })
}

const TodayPage = laterPage('TodayPage', 'Today')
const WeekPage = laterPage('WeekPage', 'This week')
const MonthPage = laterPage('MonthPage', 'This month')
const YearPage = laterPage('YearPage', 'This year')
const ChartPage = laterPage('ChartPage', 'Birth chart')
// Component showcase, compiled into development builds only.
const DevChartPage = import.meta.env.DEV ? lazy(() => import('@/pages/DevChartPage')) : null

function NotFound() {
  return <PlaceholderPage title="Page not found" description="That address does not match any page here." icon={CircleHelp} />
}

function PageFallback() {
  return (
    <Page>
      <div className="space-y-4" role="status" aria-label="Loading">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-3/4 max-w-lg" />
        <Skeleton className="h-48 w-full rounded-[var(--radius-card)]" />
      </div>
    </Page>
  )
}

function Routes() {
  const [location] = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6, transition: { duration: 0.12, ease: 'easeIn' } }}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Suspense fallback={<PageFallback />}>
          <Switch location={location}>
            <Route path="/" component={LandingPage} />
            <Route path="/new" component={NewProfilePage} />
            <Route path="/profiles" component={ProfilesPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/p/:id/edit" component={NewProfilePage} />
            <Route path="/p/:id/today" component={TodayPage} />
            <Route path="/p/:id/week" component={WeekPage} />
            <Route path="/p/:id/month" component={MonthPage} />
            <Route path="/p/:id/year" component={YearPage} />
            <Route path="/p/:id/chart" component={ChartPage} />
            {DevChartPage && <Route path="/dev/chart" component={DevChartPage} />}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const { theme } = useSettings()
  useEffect(() => {
    applyTheme(theme)
    return watchSystemTheme(theme)
  }, [theme])

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Router hook={useHashLocation}>
          <AppLayout>
            <Routes />
          </AppLayout>
        </Router>
      </TooltipProvider>
    </MotionConfig>
  )
}
