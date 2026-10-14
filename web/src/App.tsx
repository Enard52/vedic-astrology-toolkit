import { CircleHelp } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
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

type ForecastPage = ComponentType<RouteComponentProps<{ id: string }>>

/**
 * A code-split page that can be loaded ahead of time. Once its module is in, a newly mounted page
 * renders it directly rather than through React.lazy, so opening it never suspends: React 19
 * reveals suspended content in steps of about 300 ms, which made each first tab switch lag.
 */
function preloadable(load: () => Promise<{ default: ForecastPage }>) {
  let loaded: ForecastPage | null = null
  const preload = () => load().then((m) => (loaded = m.default))
  const Lazy = lazy(() => preload().then((Component) => ({ default: Component })))
  function PreloadablePage(props: RouteComponentProps<{ id: string }>) {
    // Chosen once per mount, so a module arriving later never swaps (and remounts) the page.
    const [Component] = useState<ForecastPage>(() => loaded ?? Lazy)
    return <Component {...props} />
  }
  return Object.assign(PreloadablePage, { preload })
}

const TodayPage = preloadable(() => import('@/pages/TodayPage'))
const WeekPage = preloadable(() => import('@/pages/WeekPage'))
const MonthPage = preloadable(() => import('@/pages/MonthPage'))
const YearPage = preloadable(() => import('@/pages/YearPage'))
const ChartPage = preloadable(() => import('@/pages/ChartPage'))
const FORECAST_PAGES = [TodayPage, WeekPage, MonthPage, YearPage, ChartPage]
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
  useEffect(() => {
    // Fetch the forecast screens' code as soon as the browser is idle, so no tab switch waits for it.
    const preload = () => FORECAST_PAGES.forEach((page) => void page.preload().catch(() => {}))
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(preload, { timeout: 1000 })
      return () => cancelIdleCallback(id)
    }
    const timer = setTimeout(preload, 300)
    return () => clearTimeout(timer)
  }, [])

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
