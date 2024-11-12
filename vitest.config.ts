import viteConfig from './vite.config.ts'
import { defineConfig } from 'vitest/config'
import { mergeConfig } from 'vite'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
    },
  })
)
