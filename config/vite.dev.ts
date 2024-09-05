import { UserConfig } from 'vite'

const devConfig: Partial<UserConfig> = {
  mode: "development",
  server: {
    port: 3000,
    open: true,
  },
}

export default devConfig
