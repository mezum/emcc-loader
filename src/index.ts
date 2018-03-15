import * as path from 'path';
import * as loaderUtils from 'loader-utils';
import { loader } from 'webpack';

import { parseOption } from './option';
import { Compiler } from './compiler';

export default function (this : loader.LoaderContext, content : string) {
	this.cacheable && this.cacheable();
	const callback = this.async() || (() => {});
	const options = parseOption(this);
	new Compiler().process(this, content, options).then(content => {
		callback(null, content);
	})
	.catch(err => {
		callback(err);
	});
	return null;
}
