# emcc-loader
Webpack loader that compiles some c/c++ files into a wasm using Emscripten.

## Install

```
npm install --save-dev emcc-loader
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
