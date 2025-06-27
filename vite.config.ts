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
      external: ['react', 'react-dom'],
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
    // 方式一
    // @vitejs/plugin-react 插件会忽略 node_modules 目录
    react({
      // babel: {
      //   include(filename: string | undefined, context: any) {
      //     console.log('filename', filename)
      //     return true
      //   },
      //   presets: [
      //     [
      //       '@babel/preset-env',
      //       {
      //         modules: false,
      //         useBuiltIns: false,
      //         corejs: {
      //           version: "3.42.0",
      //           proposals: true
      //         },
      //         targets: {
      //           chrome: '45',
      //         },
      //       },
      //     ],
      //   ],
      //   plugins: [
      //     [
      //       "@babel/plugin-transform-runtime",
      //       {
      //         corejs: 3,
      //         proposals: true,
      //         version: '^7.27.4',
      //       }
      //     ]
      //   ]
      // }
    }),
    babel({
      exclude: /node_modules/,
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      // @babel/plugin-transform-runtime 会从 @babel/runtime-corejs3 引入对应 target 目标浏览器的 polyfill
      // @babel/runtime-corejs3 库会从 core-js-pure 库引入对应的 polyfill，但该库内的引用通过 require('../../stable/array/at') 方式引入，babel 无法处理 require 路径
      // 所以需要忽略处理 @babel/runtime 内的引用，最后该库内的引用会变成 import 的方式，由 rollup 处理打包为一个文件
      // rollup 使用了 @rollup/plugin-commonjs 插件，可将require处理为import的路径方式进行解析
      // filter(id) {
      //   return /@babel\/runtime/.test(id as string)
      // },
      presets: [
        [
          '@babel/preset-env',
          {
            // 不转换 ES 模块语法，让打包工具处理
            modules: false,
            // 不使用 preset-env 的 polyfill 功能，因为用 plugin-transform-runtime 提供沙箱 polyfill
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
          // 使用 @babel/runtime-corejs3 提供沙箱 polyfill
          {
            corejs: {
              version: 3,
              proposals: true
            },
            // 启用辅助函数替换
            helpers: true,
            // 启用 regeneratorRuntime 替换
            regenerator: true,
            // 使用 ES 模块版本的辅助函数
            useESModules: true,
            moduleName: '@babel/runtime-corejs3',
            version: '^7.27.4',
          }
        ]
      ]
    }),
  ],
})
