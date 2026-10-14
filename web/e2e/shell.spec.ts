import { expect, test, type Page } from '@playwright/test'

const forecastNav = (page: Page) => page.locator('nav[aria-label="Forecasts"]:visible')

test('landing page leads to the birth-details form', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your Vedic sky')
  await expect(page.getByText('Your birth details never leave this device.')).toBeVisible()
  await page.getByRole('link', { name: 'Create your chart' }).first().click()
  await expect(page).toHaveURL(/#\/new$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('When and where were you born?')
})

test('creates a profile with the city search and opens today', async ({ page }) => {
  await page.goto('./#/new')
  await page.getByLabel('Name', { exact: true }).fill('Asha')
  await page.getByLabel('Date', { exact: true }).fill('1990-04-28')
  await page.getByLabel('Local time').fill('05:50')

  // The former name finds the renamed city; arrows and Enter pick it.
  const place = page.getByRole('combobox', { name: 'Town or city' })
  await place.fill('Bangalore')
  const option = page.getByRole('option').first()
  await expect(option).toContainText('Bengaluru')
  await expect(option).toContainText('also Bangalore')
  await place.press('ArrowDown')
  await place.press('ArrowUp')
  await place.press('Enter')

  await expect(page.getByTestId('chosen-place')).toHaveText('Bengaluru, Karnataka, India')
  await expect(page.getByTestId('birth-offset')).toContainText('UTC+05:30 at birth')

  await page.getByRole('button', { name: 'Save and see today' }).click()
  await expect(page).toHaveURL(/#\/p\/[0-9a-z]{10}\/today$/)
  await expect(forecastNav(page).getByRole('link', { name: 'Today' })).toHaveAttribute('aria-current', 'page')

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('jyotish-daily:profiles:v1') ?? '{}'))
  expect(stored.profiles).toHaveLength(1)
  expect(stored.profiles[0].birth).toEqual({
    name: 'Asha', date: '1990-04-28', time: '05:50', timeZone: 'Asia/Kolkata',
    latitude: 12.9719, longitude: 77.5937, place: 'Bengaluru, Karnataka, India',
  })

  await page.goto('./#/profiles')
  await expect(page.getByRole('heading', { name: 'Asha', level: 2 })).toBeVisible()
  await expect(page.getByText('28 Apr 1990, 05:50')).toBeVisible()
})

test('explains missing details and asks which repeated hour was meant', async ({ page }) => {
  await page.goto('./#/new')
  await page.getByRole('button', { name: 'Save and see today' }).click()
  await expect(page.getByText('Enter a name for this chart.')).toBeVisible()
  await expect(page.getByText('Choose the birthplace from the list', { exact: false })).toBeVisible()
  await expect(page.getByLabel('Name', { exact: true })).toBeFocused()

  await page.getByLabel('Name', { exact: true }).fill('Sam')
  await page.getByLabel('Date', { exact: true }).fill('2021-11-07')
  await page.getByLabel('Local time').fill('01:30')
  await page.getByRole('button', { name: /Advanced/ }).click()
  await page.getByLabel('Latitude').fill('40.7128')
  await page.getByLabel('Longitude').fill('-74.006')
  await page.getByLabel('Time zone').fill('America/New_York')

  await expect(page.getByText('This time happened twice.')).toBeVisible()
  await page.getByRole('radio', { name: /Second/ }).click()
  await expect(page.getByTestId('birth-offset')).toContainText('UTC-05:00 at birth')
  await page.getByRole('button', { name: 'Save and see today' }).click()
  await expect(page).toHaveURL(/\/today$/)
})

test('theme choice persists across reloads', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('imports a toolkit birth file, edits it and exports it', async ({ page }) => {
  await page.goto('./#/profiles')
  const spec = { label: 'Book Example 118', datetime: '1967-03-08T17:40:00', timezone: 'UTC+05:30', latitude: 26.3, longitude: 73.0667 }
  await page.locator('input[type=file]').setInputFiles({ name: 'example.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(spec)) })
  await expect(page.getByText('Imported Book Example 118.')).toBeVisible()

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export Book Example 118 as JSON' }).click()
  expect((await download).suggestedFilename()).toBe('book-example-118.birth.json')

  await page.getByRole('link', { name: 'Edit Book Example 118' }).click()
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Book Example 118')
  await expect(page.getByTestId('birth-offset')).toContainText('UTC+05:30 at birth')
  await page.getByLabel('Name', { exact: true }).fill('Example 118')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page).toHaveURL(/\/today$/)
  await page.goto('./#/profiles')
  await expect(page.getByRole('heading', { name: 'Example 118', level: 2 })).toBeVisible()
})

test('survives odd input: unmatched search, half-typed offsets and a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('./#/new')
  const place = page.getByRole('combobox', { name: 'Town or city' })
  await place.fill('zzzzqx')
  await expect(page.getByText('No match.', { exact: false })).toBeVisible()
  await place.press('Enter') // Must not submit the form.
  await expect(page.getByText('Some details need attention.')).toHaveCount(0)

  await page.getByRole('button', { name: 'Enter coordinates instead' }).click()
  await expect(page.getByLabel('Latitude')).toBeFocused()
  await page.getByLabel('Latitude').fill('40.7128 N')
  await page.getByLabel('Longitude').fill('74.006 W')
  for (const zone of ['+05:6', '+05:60', 'america/new_york']) await page.getByLabel('Time zone').fill(zone)
  await page.getByLabel('Date', { exact: true }).fill('2021-11-07')
  await page.getByLabel('Local time').fill('01:30')
  await page.getByLabel('Name', { exact: true }).fill('Sam')

  // Submitting without choosing the repeated hour lands on the first choice.
  await page.getByRole('button', { name: 'Save and see today' }).click()
  await expect(page.getByRole('radio', { name: /First 01:30/ })).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
  await page.getByRole('radio', { name: /Second 01:30/ }).click()
  await page.getByRole('button', { name: 'Save and see today' }).click()
  await expect(page).toHaveURL(/\/today$/)
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('jyotish-daily:profiles:v1') ?? '{}'))
  expect(stored.profiles[0].birth).toMatchObject({ timeZone: 'America/New_York', fold: 1, latitude: 40.7128, longitude: -74.006 })
})
