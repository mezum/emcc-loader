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
	buildDir : string;
	
	/**
	 * Runtime environment.
	 */
	environment : string;
	
	/**
	 * Option for --pre-js
	 */
	preJs? : string;
	
	/**
	 * Option for --post-js
	 */
	postJs? : string;
	
	/**
	 * A path to c compiler.
	 */
	cc : string;
	
	/**
	 * A path to c++ compiler
	 */
	cxx : string;
	
	/**
	 * A path to linker.
	 */
	ld : string;
	
	/**
	 * Flags for compilers/linkers.
	 */
	commonFlags : string[];
	
	/**
	 * Flags for cc.
	 */
	cFlags : string[];
	
	/**
	 * Flags for cxx.
	 */
	cxxFlags : string[];
	
	/**
	 * Flags for ld.
	 */
	ldFlags : string[];
};

/**
 * Gets a option from loader context.
 */
export function parseOption(context : loader.LoaderContext) : LoaderOption {
	const options = getOptions(context);
	if (!options.buildDir) {
		throw new Error('options.buildDir must be specified.');
	}
	if (!path.isAbsolute(options.buildDir)) {
		throw new Error('options.buildDir must be absolute.');
	}
	
	return {
		buildDir: options.buildDir,
		environment: options.environment || 'WEB',
		cc: options.cc || 'emcc',
		cxx: options.cxx || 'em++',
		ld: options.ld || 'emcc',
		commonFlags: options.commonFlags || [],
		cFlags: options.cFlags || [],
		cxxFlags: options.cxxFlags || [],
		ldFlags: options.ldFlags || [],
	};
}
