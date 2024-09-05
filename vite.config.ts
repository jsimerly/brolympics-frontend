import { defineConfig, loadEnv } from 'vite'
import commonConfig from './config/vite.common'
import devConfig from './config/vite.dev'
import prodConfig from './config/vite.prod'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const config = command === 'serve' ? devConfig : prodConfig
  return {
    ...commonConfig,
    ...config,
    define: {
      'process.env': env
    }
  }
})