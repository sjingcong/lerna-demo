import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const extensions = ['.ts', '.js'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'LX',
      sourcemap: true,
      globals: {},
    },
  ],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({
      babelHelpers: 'bundled',
      extensions,
      exclude: /node_modules/,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              ie: '11',
            },
            useBuiltIns: 'usage',
            corejs: 3,
            modules: false,
            bugfixes: true,
          },
        ],
      ],
    }),
    // terser({    //   format: {    //     comments: false,    //   },    //   compress: {    //     drop_console: true,    //   },    // }),
  ],
  external: [],
};