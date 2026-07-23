/**
 * Linking a previous account, end to end against the real stack: an old
 * login owns a league; a brand-new login proves it owns the old one (email
 * credentials through the secondary-session flow) and the whole history
 * moves over -- one human, one account.
 */
import { test, expect } from '@playwright/test'
import {
  foundLeague,
  newPersona,
  openAccount,
  signUpAndCompleteAccount,
  runId,
} from './helpers'

test.describe.configure({ mode: 'serial' })

let oldAccount
let newAccount
const OLD_EMAIL = `merge-old-${runId}@e2e.test`
const LEAGUE_NAME = `Legacy ${runId}`

test.afterAll(async () => {
  await oldAccount?.context.close()
  await newAccount?.context.close()
})

test('the past: an old login builds a league', async ({ browser }) => {
  oldAccount = await newPersona(browser)
  await oldAccount.page.goto('/')
  await signUpAndCompleteAccount(oldAccount.page, {
    email: OLD_EMAIL,
    firstName: 'Old',
    lastName: 'Me',
    displayName: 'Old Me',
  })
  await foundLeague(oldAccount.page, {
    leagueName: LEAGUE_NAME,
    broName: 'Summer of Old',
  })
})

test('a new login merges the old account and inherits its league', async ({
  browser,
}) => {
  newAccount = await newPersona(browser)
  await newAccount.page.goto('/')
  await signUpAndCompleteAccount(newAccount.page, {
    email: `merge-new-${runId}@e2e.test`,
    firstName: 'New',
    lastName: 'Me',
    displayName: 'New Me',
  })
  await expect(
    newAccount.page.getByText('You are not in any leagues yet.')
  ).toBeVisible()

  await openAccount(newAccount.page)
  // the email shows on the profile card AND the sign-in methods row
  await expect(
    newAccount.page.getByText(`merge-new-${runId}@e2e.test`).first()
  ).toBeVisible()

  // prove ownership of the old account with its email credentials
  await newAccount.page.getByRole('button', { name: 'Email', exact: true }).click()
  await newAccount.page
    .getByPlaceholder("Old account's email")
    .fill(OLD_EMAIL)
  await newAccount.page.getByPlaceholder('Its password').fill('e2e-Passw0rd!')
  await newAccount.page.getByRole('button', { name: 'Verify & merge' }).click()

  await expect(
    newAccount.page.getByText(/Accounts merged/)
  ).toBeVisible({ timeout: 15_000 })

  // the flow reloads itself; the old login's league is now mine
  await expect(
    newAccount.page.getByRole('heading', { name: LEAGUE_NAME })
  ).toBeVisible({ timeout: 15_000 })
})
