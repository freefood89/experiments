// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json';
// import multi from '@rollup/plugin-multi-entry';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

export default {
  input: 'src/index.js',
  output: {
    dir: 'public',
    format: 'umd'
  },
  format: 'esm',
  plugins: [
    webWorkerLoader(/* configuration */),
    json({
      // generate a named export for every property of the JSON object
      namedExports: true // Default: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    resolve({
      browser: true,
      extensions: [ '.mjs', '.js', '.jsx', '.json' ],
    }),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      presets: ['@babel/env', '@babel/preset-react']
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'createRef', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
  ],
};
