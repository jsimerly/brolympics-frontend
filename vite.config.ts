import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(env.VITE_FRONTEND_URL),
      'import.meta.env.VITE_FB_API_KEY': JSON.stringify(env.VITE_FB_API_KEY),
      'import.meta.env.VITE_FB_AUTH_DOMAIN': JSON.stringify(env.VITE_FB_AUTH_DOMAIN),
      'import.meta.env.VITE_PROJECT_ID': JSON.stringify(env.VITE_PROJECT_ID),
      'import.meta.env.VITE_STORAGE_BUCKET': JSON.stringify(env.VITE_STORAGE_BUCKET),
      'import.meta.env.VITE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_MESSAGING_SENDER_ID),
      'import.meta.env.VITE_MEASUREMENT_ID': JSON.stringify(env.VITE_MEASUREMENT_ID),
    },
    plugins: [react()],
  }
})