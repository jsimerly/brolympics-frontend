# Brolympics Frontend — CLAUDE.md

React 18 + Vite + Tailwind for brolympic.com. Mobile-first is absolute: base
styles are the phone experience; `md:`/`lg:` are additive only and never at
mobile's expense.

## Deploy — read before pushing

- **Pushing `main` auto-deploys** (Cloud Build trigger `push-to-frontend-main`).
  Deploy ONLY when the user says deploy. Day-to-day work lives on the
  `ui-polish` branch (branch pushes don't deploy); merge to main at deploy time.
- Backend deploys FIRST when the UI reads new serializer fields.
- Verify builds with the real exit code (`npm run build`; piping to tail hides
  failures — this has shipped a broken commit before). No Co-Authored-By.

## Design language (post-2026 rebuild — keep everything consistent with this)

- Cards: `bg-white border border-gray-200 rounded-lg`, section headers as
  small uppercase labels (`text-xs font-semibold tracking-wide uppercase
  text-light`) or `header-3` for page-level sections.
- Buttons: pill (`rounded-full`), solid `bg-primary` for the main action,
  outline for secondary, red outline for destructive, text links for tertiary.
  Disabled via `disabled:opacity-50` + busy labels ("Saving...").
- Inputs: `input-primary` (full-width) and `input-box` (compact setting-row
  boxes) — neutral gray at rest, blue only on focus. Number spinners hidden.
- Meaning colors only: primary blue accent, tertiary green = live/success,
  secondary yellow = warnings/gold, red = danger. Olympic RingStrip for brand.
- Names truncate; numbers never do. Scores trim float noise
  (`parseFloat(x.toPrecision(10))`) and honor the event's score format.
- Premium settings wear `DiamondOutlinedIcon` inline (the gem) and render
  through the `Premium` wrapper / `PREMIUM_LOCKED` flag in ManageEvent — the
  Pro gate is a flag flip, never a redesign.
- Terminology: "Games" (never contests/competitions), "Run-off games"
  (never placement/classification in copy), Semi-RR / Full-RR / Swiss.

## Testing

- `npm test` (vitest — check the EXIT CODE), `npm run test:watch`, and
  `npm run test:catalog` regenerates `TESTING.md` (commit it with new tests).
  CI (.github/workflows/tests.yml) runs vitest + a production build on every
  push — the only pre-deploy safety net.
- Write describe/it names as full sentences — they ARE the catalog.
- `src/test/setup.js` mocks firebaseConfig globally (it initializes Firebase
  at import time and would throw under vitest). In component tests mock
  `context/AuthContext` and the `api/client` module — never firebase/auth or
  axios directly — and stub `window.location.reload` (jsdom throws on it).
- Pure logic lives in shared modules so it stays tested: `Util/format.js`
  (trimFloat, isScoreInput, ordinal), `Util/dates.js` (daysUntil,
  formatDateRange), `Util/stageBuilder.js` (buildStages/formFromStages —
  CreateEvent and ManageEvent must BOTH use it; the round-trip is pinned),
  `events/eventDisplay.js` (groupLog, stageSentence, placeLabel...). Never
  re-inline copies into components — that divergence has shipped bugs.
- Test mode pins `VITE_FRONTEND_URL=https://brolympic.test` (vite.config.ts),
  so URL tests catch any hardcoded domain.

## Patterns

- `useCachedFetch(key, fn)` — stale-while-revalidate module cache; revisits
  paint instantly. Mutations refresh via `window.location.reload()` (accepted
  app-wide quirk; reload resets the cache so staleness is a non-issue).
- `usePersistentState` — sessionStorage stash for wizard forms
  (`wizard:bro:${uuid}:*` keys, cleared only on Done).
- `Img` — placeholder-degrading image with `kind` (team/player/event/
  brolympics/league). Skeletons (`Util/Skeleton.jsx`) for every first load.
- `afterAuthPath(location)` — every auth path must honor `state.from` so
  invite deep links survive login.
- Dormant players (`player.is_active === false`) are skipped by every
  scheduling/entry surface (heats picker, ind score entry) but keep history.
- Windows note: complex multi-file edits go through python patch scripts in
  the session scratchpad (shell heredoc quoting breaks otherwise).

## Structure map

- `src/api/client/` — the only API layer (one module per resource, re-exported
  from index). `src/components/brolympics/` — bro pages (home pre/active/post,
  events, team, standings, manage). `src/components/create_league_page/` —
  wizard shared by league + bro flows (creation happens ONLY at the Review
  step). `src/components/navbar/` — top bar + drawer + account.
  `presets.js` — the ~115-event catalog (array order = popularity).
