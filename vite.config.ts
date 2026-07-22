/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (mode === 'test') {
    // Deterministic env for the test runner: tests assert URLs are built
    // from env (never a hardcoded domain -- that bug shipped once).
    env.VITE_FRONTEND_URL = 'https://brolympic.test'
    env.VITE_API_URL = 'https://api.brolympic.test'
  }
  // `?? ''` keeps envless builds (CI) valid -- JSON.stringify(undefined) is
  // not a legal define value. Real values come from .env / Cloud Build.
  return {
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL ?? ''),
      'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(env.VITE_FRONTEND_URL ?? ''),
      'import.meta.env.VITE_FB_API_KEY': JSON.stringify(env.VITE_FB_API_KEY ?? ''),
      'import.meta.env.VITE_FB_AUTH_DOMAIN': JSON.stringify(env.VITE_FB_AUTH_DOMAIN ?? ''),
      'import.meta.env.VITE_PROJECT_ID': JSON.stringify(env.VITE_PROJECT_ID ?? ''),
      'import.meta.env.VITE_STORAGE_BUCKET': JSON.stringify(env.VITE_STORAGE_BUCKET ?? ''),
      'import.meta.env.VITE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_MESSAGING_SENDER_ID ?? ''),
      'import.meta.env.VITE_MEASUREMENT_ID': JSON.stringify(env.VITE_MEASUREMENT_ID ?? ''),
      // set only by .env.e2e (playwright lane) -- empty string in dev/prod
      'import.meta.env.VITE_FB_AUTH_EMULATOR': JSON.stringify(env.VITE_FB_AUTH_EMULATOR ?? ''),
    },
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
      css: false,
      // src only: e2e/*.spec.js belongs to Playwright, not vitest
      include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    },
  }
})
