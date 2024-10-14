import path from 'node:path'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'

export default {
  input: path.resolve(__dirname, './src/index.ts'),
  output: [
    {
      dir: path.resolve(__dirname, 'dist/esm'),
      format: 'esm',
    },
  ],
  preserveModules: true,
  plugins: [
    esbuild({
      target: 'es2018',
    }),
    nodeResolve(),
    json(),
  ],
  external: [],
}
