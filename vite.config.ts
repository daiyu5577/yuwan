import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import libConfig from './vite.config.lib'
import webConfig from './vite.config.web'

const __dirname = dirname(fileURLToPath(import.meta.url))
// const __dirname = new URL('../', import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (mode === 'lib') {
    return libConfig
  }
  return webConfig
})