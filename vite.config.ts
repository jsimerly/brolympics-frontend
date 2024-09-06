import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

console.log("Vite config environment variables:");
console.log("VITE_API_URL:", process.env.VITE_API_URL);
console.log("VITE_FRONTEND_URL:", process.env.VITE_FRONTEND_URL);
console.log("VITE_FB_API_KEY:", process.env.VITE_FB_API_KEY);
console.log("VITE_FB_AUTH_DOMAIN:", process.env.VITE_FB_AUTH_DOMAIN);
console.log("VITE_PROJECT_ID:", process.env.VITE_PROJECT_ID);
console.log("VITE_STORAGE_BUCKET:", process.env.VITE_STORAGE_BUCKET);
console.log("VITE_MESSAGING_SENDER_ID:", process.env.VITE_MESSAGING_SENDER_ID);
console.log("VITE_MEASUREMENT_ID:", process.env.VITE_MEASUREMENT_ID);

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