/**
 * The image pipeline, end to end: pick a file, crop it in the full-screen
 * sheet, save -- and after a reload the logo comes back from STORAGE under a
 * unique name (the Summer 2023 same-flag incident made this pipeline the
 * most battle-scarred code in the app).
 */
import { test, expect } from '@playwright/test'
import {
  createTeamFromHome,
  foundLeague,
  newPersona,
  signUpAndCompleteAccount,
  runId,
} from './helpers'

test.describe.configure({ mode: 'serial' })

let commish

test.afterAll(async () => {
  await commish?.context.close()
})

test('a team logo survives the pick -> crop -> save -> reload journey', async ({
  browser,
}) => {
  commish = await newPersona(browser)
  const { page } = commish
  await page.goto('/')
  await signUpAndCompleteAccount(page, {
    email: `logo-${runId}@e2e.test`,
    firstName: 'Lo',
    lastName: 'Go',
    displayName: 'Lo',
  })
  await foundLeague(page, {
    leagueName: `Logos ${runId}`,
    broName: 'Logo Games',
  })
  await createTeamFromHome(page, 'Logo Crew')

  // pick a file straight into the my-team card's hidden input
  await page.setInputFiles('#file_team', 'e2e/fixtures/logo.png')

  // the full-screen crop sheet takes over; give react-easy-crop a beat to
  // measure the image so the crop area exists before saving
  await expect(page.getByText('Crop image')).toBeVisible()
  await expect(page.locator('.reactEasyCrop_Image')).toBeVisible()
  await page.waitForTimeout(500)
  // force: react-easy-crop's absolute container confuses Playwright's
  // hit-testing even though the button is visually clear (screenshot-verified)
  await page.getByRole('button', { name: 'Save' }).click({ force: true })

  // sheet closes and the save lands
  await expect(page.getByText('Crop image')).toBeHidden()

  // the assertion that matters (the same-flag incident class): after a full
  // reload the logo comes back from STORAGE as a real uploaded object with
  // a unique name -- never a default, never a shared constant filename
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Logo Crew', level: 3 })
  ).toBeVisible()
  const storedLogo = page.locator('img[alt="Logo Crew"]').first()
  // a fresh uuid-named object every upload -- the constant-filename class
  // (team_image.jpg + overwriting storage) can never recur
  await expect(storedLogo).toHaveAttribute('src', /[0-9a-f]{32}\.(jpe?g|png)/)
  await expect(storedLogo).not.toHaveAttribute('src', /default/)
  await expect(storedLogo).not.toHaveAttribute('src', /team_image/)
})
