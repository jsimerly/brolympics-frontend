/**
 * Shared E2E plumbing. Personas are real browser contexts (mobile viewport)
 * signing up through the real UI against the Firebase Auth emulator -- no
 * mocked anything.
 */
import { expect, devices } from '@playwright/test'

export const BASE_URL = 'http://127.0.0.1:5175'

// unique per run so a reused emulator/backend never collides with past runs
export const runId = Date.now().toString(36)

/** A fresh person with their own browser profile (cookies, IndexedDB, auth). */
export async function newPersona(browser) {
  const context = await browser.newContext({
    ...devices['Pixel 7'],
    baseURL: BASE_URL,
  })
  const page = await context.newPage()
  return { context, page }
}

/**
 * Email signup through the real form, then the forced "Almost in." account
 * onboarding (first/last/display name + Save). Ends right after Save's
 * reload kicks off -- callers assert where they land, because it differs:
 * plain signups land on Leagues, invite-bound signups bounce to the invite.
 */
export async function signUpAndCompleteAccount(
  page,
  { email, firstName, lastName, displayName }
) {
  await expect(
    page.getByRole('link', { name: 'Create Account' })
  ).toBeVisible()
  await page.getByRole('link', { name: 'Create Account' }).click()

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('e2e-Passw0rd!')
  await page.getByLabel('Confirm Password').fill('e2e-Passw0rd!')
  await page.getByRole('button', { name: 'Create Account' }).click()

  // the drawer takes over until the account has a name
  await expect(page.getByText('Almost in.')).toBeVisible()
  await page.locator('input[name="first_name"]').fill(firstName)
  await page.locator('input[name="last_name"]').fill(lastName)
  await page.locator('input[name="display_name"]').fill(displayName)
  await page.getByRole('button', { name: 'Save' }).click()
}
