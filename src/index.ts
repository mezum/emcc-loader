import { loader } from 'webpack';

import { parseOption } from './option';
import { Compiler } from './compiler';

function emcc(this: loader.LoaderContext, content: string): void {
	this?.cacheable();
	const callback =
		this.async() ||
		(() => {
			// do nothing.
		});
	const options = parseOption(this);
	new Compiler()
		.process(this, content, options)
		.then(ctx => callback(null, ctx))
		.catch(err => callback(err));
}

export default emcc;
