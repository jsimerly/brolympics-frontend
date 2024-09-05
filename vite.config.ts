import { defineConfig, UserConfig } from 'vite'
import commonConfig from './config/vite.common'
import devConfig from './config/vite.dev'
import prodConfig from './config/vite.prod'

export default defineConfig(({ command }): UserConfig => {
  const config = command === 'serve' ? devConfig : prodConfig
  return {
    ...commonConfig,
    ...config,
  }
})