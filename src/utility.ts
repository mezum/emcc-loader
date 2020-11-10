import * as childProcess from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import mkdirp from 'mkdirp';
import * as path from 'path';
import { promisify } from 'util';
import { loader } from 'webpack';

const stat = promisify(fs.stat);
const isWindows = /^win/.test(process.platform);

export const exists = fs.existsSync;
export const mkdirs = mkdirp;
export const readFile = promisify(fs.readFile);

/**
 * Gets dependencies file paths.
 */
export async function getDependencies(
	compiler: string,
	absPath: string,
	flags: string[],
	cwd?: string
) {
	const { stdout } = await execute(
		compiler,
		[...flags, '-MM', cwd ? path.relative(cwd, absPath) : absPath],
		{ cwd, shell: true }
	).catch(err => {
		throw err.err;
	});
	const dependencies = stdout
		.toString()
		.trim()
		.replace(/\\(\n|\n?\r)/gm, '')
		.split(/\s+/g);
	dependencies.shift(); // `${basename}.o:`
	return dependencies;
}

/**
 * Adds dependencies.
 */
export function addDependencies(
	context: loader.LoaderContext,
	paths: string[]
) {
	for (const p of paths) {
		context.addDependency(p);
	}
}

/**
 * Gets latest modified time.
 */
export async function getLatestModifiedTime(paths: string[]) {
	if (paths.length <= 0) {
		throw new Error('paths must be non-empty.');
	}
	let latest = await getModifiedTime(paths[0]);
	for (const p of paths) {
		const time = await getModifiedTime(p);
		if (time > latest) {
			latest = time;
		}
	}
	return latest;
}

/**
 * Gets modified time.
 */
export async function getModifiedTime(file: string) {
	if (!exists(file)) {
		return Date.UTC(1970, 0);
	}
	return (await stat(file)).mtime;
}

/**
 * Executes specified file.
 */
export async function execute(
	file: string,
	args: string[],
	options?: childProcess.ExecFileOptions
) {
	type SuccessType = {
		err?: Error;
		stdout: string | Buffer;
		stderr: string | Buffer;
	};

	const childProcessExecutable = isWindows ? 'cmd' : file;
	const childProcessArguments = isWindows
		? ['/s', '/c', file, ...args]
		: args;

	return new Promise<SuccessType>((resolve, reject) => {
		childProcess.execFile(
			childProcessExecutable,
			childProcessArguments,
			options || {},
			(err, stdout, stderr) => {
				if (err) {
					resolve({
						err,
						stdout,
						stderr,
					});
				} else {
					resolve({
						stdout,
						stderr,
					});
				}
			}
		);
	});
}

/**
 * Gets a temporary file name for build.
 */
export function getTempName(absPath: string): string {
	const basename = path.basename(absPath, path.extname(absPath));
	const hash = crypto.createHash('md5').update(absPath).digest('hex');
	return `${basename}-${hash.slice(0, -2)}`;
}
