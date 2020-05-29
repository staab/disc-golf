import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import {terser} from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/sw.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'sw',
    file: 'public/sw.js'
  },
  plugins: [
  	replace({
    	process: JSON.stringify({
      	env: {
          PRODUCTION: production,
      	},
    	}),
  	}),
    resolve({browser: true}),
    commonjs(),
    production && terser()
  ],
}
