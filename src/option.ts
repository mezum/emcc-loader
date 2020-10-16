import * as path from 'path';
import { loader } from 'webpack';
import { getOptions } from 'loader-utils';

/**
 * Options from webpack.config.js
 */
export type LoaderOption = {
	/**
	 * A path to temporary directory for bitcode, archive file and wasm/asm.js.
	 */
	buildDir: string;

	/**
	 * A path to working directory for compiler.
	 */
	cwd?: string;

	/**
	 * Option for --pre-js
	 */
	preJs?: string;

	/**
	 * Option for --post-js
	 */
	postJs?: string;

	/**
	 * A path to c compiler.
	 */
	cc: string;

	/**
	 * A path to c++ compiler
	 */
	cxx: string;

	/**
	 * A path to linker.
	 */
	ld: string;

	/**
	 * Flags for compilers/linkers.
	 */
	commonFlags: string[];

	/**
	 * Flags for cc.
	 */
	cFlags: string[];

	/**
	 * Flags for cxx.
	 */
	cxxFlags: string[];

	/**
	 * Flags for ld.
	 */
	ldFlags: string[];
};

/**
 * Gets a option from loader context.
 */
export function parseOption(context: loader.LoaderContext): LoaderOption {
	const options = getOptions(context);
	if (!options.buildDir) {
		throw new Error('options.buildDir must be specified.');
	}
	if (!path.isAbsolute(<string>options.buildDir)) {
		throw new Error('options.buildDir must be absolute.');
	}

	return {
		buildDir: <string>options.buildDir,
		cc: <string>options.cc || 'emcc',
		cxx: <string>options.cxx || 'em++',
		ld: <string>options.ld || 'emcc',
		cwd: <string | undefined>options.cwd,
		/* eslint-disable @typescript-eslint/no-explicit-any */
		commonFlags: <string[]>(<any>options.commonFlags) || [],
		cFlags: <string[]>(<any>options.cFlags) || [],
		cxxFlags: <string[]>(<any>options.cxxFlags) || [],
		ldFlags: <string[]>(<any>options.ldFlags) || [],
		/* eslint-enable @typescript-eslint/no-explicit-any */
	};
}
