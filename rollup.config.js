import replace from '@rollup/plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy'
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-import-css';

const isProduction = process.env.BUILD === 'production';

const BUILD_OPTIONS = [
	{ mode: 2, output: "application_poweruser.js"},
	{ mode: 0, output: "application.js"},
	{ mode: 1, output: "application_supporter.js"},
];

const BUILDS = [];

for (const buildOption of BUILD_OPTIONS) {
	BUILDS.push(
		{
			input: './src/client/js/application.js',
			output: {
				file: `./build/client/js/${buildOption.output}`,
				format: 'esm'
			},
			plugins: [
				replace({
					preventAssignment: true,
					__patreon_mode__: buildOption.mode,
					__isProduction__: isProduction,
				}),
				css(),
				json({
					compact: true,
				}),
				nodeResolve({
					dedupe: ['gl-matrix', 'vanilla-picker', 'harmony-ui', 'harmony-browser-utils'],
				}),
				isProduction ? terser() : null,
				copy({
					targets: [
						{src: 'src/client/index.html', dest: 'build/client/'},
						{src: 'src/client/ads.txt', dest: 'build/client/'},
						{src: 'src/client/img/', dest: 'build/client/'},
					]
				}),
			]
		}
	)
}

export default BUILDS;
