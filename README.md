# `@nandenjin/emcc-loader`

![LICENSE](https://img.shields.io/github/license/nandenjin/emcc-loader?style=flat-square)
![Version](https://img.shields.io/github/package-json/v/nandenjin/emcc-loader?style=flat-square)
![CI Status](https://img.shields.io/github/workflow/status/nandenjin/emcc-loader/CI?style=flat-square)
[![Dependencies](https://img.shields.io/david/nandenjin/emcc-loader?style=flat-square)](https://david-dm.org/nandenjin/emcc-loader)
[![devDependencies](https://img.shields.io/david/dev/nandenjin/emcc-loader?style=flat-square)](https://david-dm.org/nandenjin/emcc-loader?type=dev)

Webpack loader that compiles some c/c++ files into a wasm using Emscripten.

🙋‍♂️ This is a fork of [`mezum/emcc-loader`](https://www.npmjs.com/package/emcc-loader), and is to implement and contribute for the original package with new features and fixes.

## Install

**⚠️ This is a forked package. For original `emcc-loader`, see [official package page on NPM](https://www.npmjs.com/package/emcc-loader).**

`@nandenjin/emcc-loader` is hosted on GitHub Packages Registry. Add following to `.npmrc` to use it for all `@nandenjin/` packages. [Learn more](https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#installing-a-package)

```
registry=https://npm.pkg.github.com/nandenjin
```

Then, install as usual.

```
npm install --save-dev @nandenjin/emcc-loader
```

## Usage
First of all, create .clist file written relative paths from the clist to c/c++ file like this:

```
# comment
foobar.c

# indent is also ok.
    foo/bar.cpp
    baz.cc
    qux.cxx

# --pre-js
^pre.js

# --post-js
$post.js
```

Ofcourse, write c/c++ files!

```
#include <stdio.h>
#include <emscripten/emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
void sayHello() {
	printf("hello!\n");
}

#ifdef __cplusplus
}
#endif
```

Next, edit your webpack.config.js:

```
loaders: [
    {
        test: /\.clist$/,
        use: [
            {
                loader: 'emcc-loader',
                options: {
                    buildDir: `${__dirname}/build`,
                    commonFlags: [ '-O2' ],
                    cFlags: [ '-std=c11' ],
                    cxxFlags: [ '-std=c++14' ],
                    ldFlags: [
                        '-s', "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']",
                        '-s', 'DEMANGLE_SUPPORT=1',
                    ]
                }
            }
        ]
    }
]
```

Now, you can import a wasm file like this:

```
import wasm from './module.clist';

wasm.initialize().then(module => {
	module._sayHello();
});
```

## Options
emcc-loader is configuable on webpack.config.js.

- buildDir : string
-- [Required] absolute path to temporary directory used by emcc.
- cwd : string
-- [default=undefined] working directory for compilers. If specified, all paths passed to compilers will be relative against cwd.
- cc : string
-- [default=emcc] c compiler path or command.
- cxx : string
-- [default=em++] c++ compiler path or command.
- ld : string
-- [default=emcc] linker path or command.
- commonFlags : string[]
-- [default=[]] array of flags passed to all emcc/em++ commands.
- cFlags : string[]
-- [default=[]] array of flags passed to emcc compiling C.
- cxxFlags : string[]
-- [default=[]] array of flags passed to em++ compiling C++.
- ldFlags : string[]
-- [default=[]] array of flags passed to emcc linking all object files.

## Dependencies
- Emscripten

## License
MIT License

## Inspiration
Inspired by [cpp-wasm-loader](https://github.com/kobzol/cpp-wasm-loader).
