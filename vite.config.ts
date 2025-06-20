import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import babel from '@rollup/plugin-babel'
// @ts-ignore
import dts from 'unplugin-dts/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
// const __dirname = new URL('../', import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'Yuwan',
      fileName: (format, _entryName) => `index.${format}.js`,
      cssFileName: 'index',
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', /@babel\/runtime/],
      output: {
        globals: {
          React: 'React',
          'react-dom': 'ReactDOM',
        },
      }
    },
  },
  plugins: [
    dts({
      bundleTypes: true,
      tsconfigPath: './tsconfig.app.json'
    }),
    react(),
    babel({
      exclude: /node_modules/,
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            corejs: {
              version: "3.42.0",
              proposals: true
            },
            targets: {
              chrome: '45',
            },
          },
        ],
      ],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            corejs: 3,
            proposals: true,
            version: '^7.27.4',
          }
        ]
      ]
    }),
  ],
})
