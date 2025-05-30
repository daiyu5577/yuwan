import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// const __dirname = new URL('../', import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'Yuwan',
      fileName: (format, _entryName) => `index.${format}.js`,
      cssFileName: 'index',
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        format: 'umd',
        globals: {
          React: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})