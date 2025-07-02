import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import babel from '@rollup/plugin-babel'

const __dirname = dirname(fileURLToPath(import.meta.url))
// const __dirname = new URL('../', import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    // @vitejs/plugin-react 插件会忽略 node_modules 目录
    react({
      babel: {
        include(filename: string | undefined, context: any) {
          console.log('filename', filename)
          return true
        },
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              useBuiltIns: false,
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
      }
    }),
  ],
})
