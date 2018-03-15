import * as child_process from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { promisify } from 'util';
import { loader } from 'webpack';

const stat = promisify(fs.stat);

export const exists = fs.existsSync;
export const mkdirs = promisify(mkdirp);
export const readFile = promisify(fs.readFile);

/**
 * Gets dependencies file paths.
 */
export async function getDependencies(compiler : string, absPath : string, flags : string[]) {
	const { stdout } = await execute(compiler, [...flags, '-MM', absPath]).catch(err => {
		throw err.err;
	});
	const dependencies = stdout.toString().trim().replace(/\\(\n|\n?\r)/gm, '').split(/\s+/g);
	dependencies.shift();  // `${basename}.o:`
	return dependencies;
}

/**
 * Adds dependencies.
 */
export function addDependencies(context : loader.LoaderContext, paths : string[]) {
	for (const p of paths) {
		context.addDependency(p);
	}
}

/**
 * Gets latest modified time.
 */
export async function getLatestModifiedTime(paths : string[]) {
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
export async function getModifiedTime(file : string) {
	if (!exists(file)) {
		return Date.UTC(1970, 0);
	}
	return (await stat(file)).mtime;
}

/**
 * Executes specified file.
 */
export async function execute(file : string, args : string[], options? : child_process.ExecFileOptions) {
	type SuccessType = {
		stdout: string | Buffer;
		stderr: string | Buffer;
	};
	
	return new Promise<SuccessType>((resolve, reject) => {
		child_process.execFile(file, args, options || {}, (err, stdout, stderr) => {
			if (err) {
				reject({
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
		});
	});
}

/**
 * Gets a temporary file name for build.
 */
export function getTempName(absPath : string) : string {
	const basename = path.basename(absPath, path.extname(absPath));
	const hash = crypto.createHash('md5').update(absPath).digest('hex');
	return `${basename}-${hash.slice(0, -2)}`;
}
