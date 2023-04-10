import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import path from 'path'

const inputDir = path.resolve(__dirname, 'src')
const outputDir = path.resolve(__dirname, 'libs')

export default [
  {
    input: path.join(inputDir, 'index.ts'),
    output: [
      { format: 'es', file: path.join(outputDir, 'esm/bundle.js'), sourcemap: true },
      { format: 'cjs', file: path.join(outputDir, 'cjs/bundle.js'), sourcemap: true }
    ],
    plugins: [
      // preferably set the external as first plugin.
      external(),
      typescript(),
      resolve(),
      commonjs(),
      terser({ output: { comments: false } })
    ]
  },
  {
    input: path.join(inputDir, 'index.ts'),
    output: [{ format: 'es', file: path.join(outputDir, 'esm/bundle.d.ts') }],
    plugins: [dts()]
  }
]
