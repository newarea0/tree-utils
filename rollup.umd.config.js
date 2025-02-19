import path from 'node:path'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

const isProduction = process.env.NODE_ENV === 'production'
const pluginsWithEnv = isProduction
  ? []
  : [serve({
      open: true,
      openPage: '/base/',
      port: 10001,
      contentBase: ['dist', 'examples'],
    }), livereload('dist/umd')]

export default {
  input: path.resolve(__dirname, './src/index.ts'),
  output: [
    {
      file: path.resolve(__dirname, 'dist/umd/index.js'),
      format: 'umd',
      name: 'treeUtils',
    },
  ],
  plugins: [
    esbuild({
      target: 'es2015',
    }),
    babel({
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    nodeResolve(),
    json(),
    commonjs(),
    ...pluginsWithEnv,
  ],
}
