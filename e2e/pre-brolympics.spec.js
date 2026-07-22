/**
 * The pre-Brolympics golden path, end to end: a commissioner builds the whole
 * world through the wizard, a player arrives through the invite link, both
 * get teams, and the launch checklist goes from warning to started.
 *
 * One continuous story in serial mode -- each test hands state (the invite
 * link, the bro URL, the commissioner's logged-in context) to the next.
 */
import { test, expect } from '@playwright/test'
import { newPersona, signUpAndCompleteAccount, runId } from './helpers'

test.describe.configure({ mode: 'serial' })

let commish // the commissioner's persona, reused across tests
let player // the invited player's persona
let inviteLink // http://127.0.0.1:5175/invite/brolympics/<uuid>
let broUrl // /b/<uuid>/home

test.afterAll(async () => {
  await commish?.context.close()
  await player?.context.close()
})

test('commissioner signs up and builds the league through the wizard', async ({
  browser,
}) => {
  commish = await newPersona(browser)
  const { page } = commish

  // an anonymous visitor gets the auth wall
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()

  await signUpAndCompleteAccount(page, {
    email: `commish-${runId}@e2e.test`,
    firstName: 'Cass',
    lastName: 'Commish',
    displayName: 'The Commish',
  })

  // fresh account, empty world
  await expect(page.getByText('You are not in any leagues yet.')).toBeVisible()
  await page.getByRole('button', { name: 'Create League' }).click()

  // step 1: league
  await page.getByPlaceholder('Ex: BSU Boys').fill(`E2E League ${runId}`)
  await page.getByRole('button', { name: 'Create League' }).click()

  // step 2: brolympics (traditional teams-of-2 default)
  await page.getByPlaceholder('Summer 2026').fill('Summer Games')
  await page.getByRole('button', { name: 'Next: Add Events' }).click()

  // step 3: two events from the preset catalog -- an h2h and an ind (no ffa:
  // heats would rightly block the start gate, that's its own spec someday)
  await page.getByRole('button', { name: 'Add an event' }).click()
  // add each preset through its info sheet -- clicking the card itself is
  // geometry-dependent (a nested info icon sits mid-card and steals taps)
  await page.getByRole('button', { name: 'About Cornhole', exact: true }).click()
  await page.getByRole('button', { name: 'Add to lineup' }).click()
  await page.getByPlaceholder(/Search events/).fill('Bowling')
  await page.getByRole('button', { name: 'About Bowling', exact: true }).click()
  await page.getByRole('button', { name: 'Add to lineup' }).click()
  await expect(page.getByText("This year's lineup (2)")).toBeVisible()
  await page.getByRole('button', { name: /Next: Review/ }).click()

  // step 4: nothing exists until this button
  await page.getByRole('button', { name: 'Create League & Brolympics' }).click()

  // step 5: the invite link is the only door in -- grab it for the player.
  // The wizard is a translateX carousel, so step 5 is "visible" to Playwright
  // the whole time: the REAL create-finished signal is a uuid in the link
  // (until then it reads .../invite/brolympics/undefined).
  const linkText = page
    .locator('span', { hasText: '/invite/brolympics/' })
    .first()
  await expect(linkText).toContainText(
    /\/invite\/brolympics\/[0-9a-f-]{36}/,
    { timeout: 15_000 }
  )
  inviteLink = (await linkText.textContent()).trim()
  broUrl = `/b/${inviteLink.split('/invite/brolympics/')[1]}/home`

  await page.getByRole('button', { name: 'Done — Go to Brolympics' }).click()

  // the admin pre-game home: launch checklist warns about the empty world
  await expect(page.getByText('Launch Checklist')).toBeVisible()
  await expect(page.getByText('2 events on the slate')).toBeVisible()
  await expect(
    page.getByText('Fewer than 2 teams — invite the crew')
  ).toBeVisible()

  // the commissioner needs a team too
  await page.getByRole('button', { name: 'Create', exact: true }).click()
  await page.locator('#new-team-name').fill('Team Commish')
  await page.getByRole('button', { name: 'Create & join' }).click()

  // reloaded: my-team card (level 3; the teams list repeats the name as h4)
  await expect(
    page.getByRole('heading', { name: 'Team Commish', level: 3 })
  ).toBeVisible()
  await expect(page.getByText('Room on the roster')).toBeVisible()
})

test('a player signs up through the invite link and fields a team', async ({
  browser,
}) => {
  player = await newPersona(browser)
  const { page } = player

  // the link is the key: anonymous visitors get parked at auth with a banner
  await page.goto(inviteLink)
  await expect(page.getByText("You're invited!")).toBeVisible()

  await signUpAndCompleteAccount(page, {
    email: `player-${runId}@e2e.test`,
    firstName: 'Pat',
    lastName: 'Player',
    displayName: 'Pat',
  })

  // the stashed invite survives signup + onboarding + reload
  await expect(page.getByText("You're invited", { exact: false })).toBeVisible()
  await expect(page.getByText('Summer Games')).toBeVisible()
  await page.getByRole('button', { name: 'Join Brolympics' }).click()

  // in the bro, teamless: the commissioner's open team is joinable, but Pat
  // starts a rival squad instead
  await expect(page).toHaveURL(new RegExp(broUrl.replace('/home', '')))
  await expect(page.getByText("You're not on a team yet")).toBeVisible()
  await expect(page.getByText('Team Commish')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Join' })).toBeVisible()

  await page.getByRole('button', { name: 'Create', exact: true }).click()
  await page.locator('#new-team-name').fill('Team Player')
  await page.getByRole('button', { name: 'Create & join' }).click()
  await expect(
    page.getByRole('heading', { name: 'Team Player', level: 3 })
  ).toBeVisible()

  // no admin tools for regular players
  await expect(page.getByText('Launch Checklist')).toBeHidden()
})

test('the launch checklist goes green and the games start', async () => {
  const { page } = commish

  await page.goto(broUrl)
  // the checklist row (the status card repeats "2 teams in" -- strict mode)
  await expect(
    page.getByText(/2 teams in — 2 still have open spots/)
  ).toBeVisible()

  const startButton = page.getByRole('button', { name: 'Start Brolympics' })
  await expect(startButton).toBeEnabled()
  await startButton.click()

  // the confirm gate, then pre-game chrome gives way to game day
  await expect(page.getByText('Start the Brolympics?')).toBeVisible()
  await page.getByRole('button', { name: 'Start', exact: true }).click()

  await expect(page.getByText('Launch Checklist')).toBeHidden()
  await expect(
    page.getByRole('heading', { name: 'Summer Games' })
  ).toBeVisible()
})
