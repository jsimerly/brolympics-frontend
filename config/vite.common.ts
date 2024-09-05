import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

const commonConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}

export default commonConfig
