import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonConfig from './config/vite.common'
import devConfig from './config/vite.dev.ts'
import prodConfig from './config/vite.prod'

export default defineConfig(({ command }) => {
  const config = command === 'serve' ? devConfig : prodConfig
  return { ...commonConfig, ...config }
})