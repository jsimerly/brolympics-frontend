import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  
  return {
    plugins: [react()],
    define: {
      'process.env': Object.keys(env).reduce((prev, key) => {
        prev[key] = JSON.stringify(env[key]);
        return prev;
      }, {}),
    },
  }
})