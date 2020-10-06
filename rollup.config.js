import typescript from 'rollup-plugin-typescript2';

export default {
	input: 'src/index.ts',
	output: {
		file: 'lib/index.js',
		format: 'cjs',
		sourcemap: true,
		exports: "default"
	},
	plugins: [
		typescript()
	],
	external: [
		'child_process',
		'crypto',
		'fs',
		'mkdirp',
		'loader-utils',
		'path',
		'util'
	]
};
