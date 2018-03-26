import buble from 'rollup-plugin-buble';
import flow from 'rollup-plugin-flow';
import babel from 'rollup-plugin-babel';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
    input: 'src/index.js',
    output: [
        { file: pkg.main, format: 'cjs', sourcemap: true },
        { file: pkg.module, format: 'es', sourcemap: true },
        { file: pkg['umd:main'], format: 'umd', name: pkg.name, sourcemap: true }
    ],
    plugins: [
        flow(),
        babel(),
        buble()
    ]
};
