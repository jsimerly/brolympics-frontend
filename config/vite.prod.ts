import { UserConfig } from 'vite'

const prodConfig: Partial<UserConfig> = {
  mode: "production",
  build: {
    minify: "terser",
    outDir: "dist",
  },
}

export default prodConfig
