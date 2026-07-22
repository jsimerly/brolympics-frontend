/**
 * The E2E lane: real Chromium against the real stack -- Vite (:5175, e2e
 * mode), Django (:8001, throwaway sqlite), and the Firebase AUTH EMULATOR
 * (:9099, demo project). No API mocks anywhere: this lane exists because
 * component tests can't see cross-screen staleness (the ghost-bro lesson).
 *
 * Playwright boots and owns all three servers; `npm run e2e` is the whole
 * ceremony. Mobile viewport by default -- the app is mobile-first.
 */
import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const API_DIR = path.resolve(HERE, '..', 'api')
const API_PYTHON = path.join(API_DIR, '.venv', 'Scripts', 'python.exe')
const API_RUNNER = path.join(API_DIR, 'scripts', 'run_e2e_server.py')

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // one worker: the specs share a single backend world and tell one
  // continuous story (signup -> league -> bro -> game day)
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5175',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Pixel 7'],
  },
  webServer: [
    {
      // auth emulator: leftover state between local runs is harmless
      // (specs use unique emails), so reuse keeps the loop fast.
      // firebase-tools runs via pinned npx, NOT devDependencies: its native
      // optional subtree (re2) makes Windows-written lockfiles that Linux
      // `npm ci` rejects (broke CI + the Docker deploy build, 2026-07-22).
      command:
        'npx -y firebase-tools@15 emulators:start --only auth --project demo-brolympics --config firebase.json',
      cwd: path.join(HERE, 'e2e'),
      port: 9099,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      // fresh world every run: the runner deletes e2e.sqlite3 before serving
      command: `"${API_PYTHON}" "${API_RUNNER}"`,
      port: 8001,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // explicit IPv4: on Windows the port probe passes via ::1 while the
      // baseURL dials 127.0.0.1 -- bind exactly what the tests dial
      command: 'npm run dev -- --mode e2e --host 127.0.0.1 --port 5175 --strictPort',
      cwd: HERE,
      port: 5175,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
