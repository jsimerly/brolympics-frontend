/**
 * Global test setup.
 *
 * The one load-bearing piece: firebaseConfig initializes Firebase at module
 * top level from VITE_FB_* env vars, and src/api/axios.js imports it -- so
 * virtually every data-bearing module transitively initializes Firebase.
 * Under vitest those env vars are undefined and getAuth() throws at IMPORT
 * time (auth/invalid-api-key). Mock the module once here so no test ever
 * touches real Firebase.
 *
 * For component tests, mock `context/AuthContext` (not firebase/auth) --
 * components consume auth through the context, never firebase directly.
 */
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('/src/firebase/firebaseConfig', () => ({
  default: {},
  app: {},
  auth: { currentUser: null },
}))
