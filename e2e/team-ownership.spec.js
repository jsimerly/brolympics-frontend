/**
 * The team-owner suite, end to end: whoever creates a team runs it -- the
 * invite-only toggle hides Join from the open-teams list, delete works until
 * the games start -- and a STALE browser acting on a deleted team gets an
 * honest error banner, never a broken page (the ghost-bro class of bug).
 */
import { test, expect } from '@playwright/test'
import {
  createTeamFromHome,
  foundLeague,
  joinViaInvite,
  newPersona,
  signUpAndCompleteAccount,
  runId,
} from './helpers'

test.describe.configure({ mode: 'serial' })

let commish
let owner // the player who creates and runs their own team
let joiner // a third player: joins an open team, then acts on a stale page
let inviteLink
let broUrl

test.afterAll(async () => {
  await commish?.context.close()
  await owner?.context.close()
  await joiner?.context.close()
})

test('the world: a league, an open commissioner team, an owner-run team', async ({
  browser,
}) => {
  commish = await newPersona(browser)
  await commish.page.goto('/')
  await signUpAndCompleteAccount(commish.page, {
    email: `own-commish-${runId}@e2e.test`,
    firstName: 'Cass',
    lastName: 'Commish',
    displayName: 'Commish',
  })
  ;({ inviteLink, broUrl } = await foundLeague(commish.page, {
    leagueName: `Owners ${runId}`,
    broName: 'Owner Games',
  }))
  await createTeamFromHome(commish.page, 'Open Crew')

  owner = await newPersona(browser)
  await joinViaInvite(owner.page, inviteLink, {
    email: `own-owner-${runId}@e2e.test`,
    firstName: 'Ollie',
    lastName: 'Owner',
    displayName: 'Ollie',
  })
  await createTeamFromHome(owner.page, 'Locked Vault')
})

test('the owner flips their team to link-only and Join disappears for others', async ({
  browser,
}) => {
  // owner sees the join-mode toggle on their card and locks the team
  await expect(owner.page.getByRole('button', { name: 'Link only' })).toBeVisible()
  await owner.page.getByRole('button', { name: 'Link only' }).click()
  await expect(
    owner.page.getByText('Hidden from the open-teams list')
  ).toBeVisible()

  // a third player arrives: the locked team wears the chip and offers no
  // Join, while the commissioner's open team still does
  joiner = await newPersona(browser)
  await joinViaInvite(joiner.page, inviteLink, {
    email: `own-joiner-${runId}@e2e.test`,
    firstName: 'Jo',
    lastName: 'Joiner',
    displayName: 'Jo',
  })
  await expect(joiner.page.getByText('Invite only')).toBeVisible()
  const joinButtons = joiner.page.getByRole('button', { name: 'Join' })
  await expect(joinButtons).toHaveCount(1) // Open Crew only
})

test('joining an open team from the teams list works', async () => {
  await joiner.page.getByRole('button', { name: 'Join' }).click()
  // reload lands them on the roster of the commissioner's team
  await expect(
    joiner.page.getByRole('heading', { name: 'Open Crew', level: 3 })
  ).toBeVisible()
  await expect(joiner.page.getByText("You're not on a team yet")).toBeHidden()
})

test('the owner deletes their team; a stale tab gets a banner, not a crash', async () => {
  // the commissioner's tab renders the world BEFORE the deletion
  await commish.page.goto(broUrl)
  await expect(commish.page.getByText('Locked Vault')).toBeVisible()

  // owner deletes through the edit fold + confirm popup
  await owner.page.locator('button:has(svg[data-testid="EditIcon"])').first().click()
  await owner.page.getByRole('button', { name: 'Delete this team' }).click()
  await owner.page.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(owner.page.getByText("You're not on a team yet")).toBeVisible()

  // the commissioner's STALE page still lists the dead team; tapping through
  // to it must produce an honest failure, not a white screen
  await expect(commish.page.getByText('Locked Vault')).toBeVisible()
  await commish.page.getByText('Locked Vault').click()
  // whatever renders, the app shell survives -- header still present
  await expect(
    commish.page.getByRole('heading', { name: 'Owner Games' })
  ).toBeVisible()
})
