# WebpackLibrary

A Webpack Babel Library Template

Reference: http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6

This is a setup for a JavaScript library development, that doesn't depend on any external
frameworks or other libraries.

The build is made using all the good stuff, Webpack, Babel, ESLint, Mocha, Chai, Sinon, Karma...

## Install all the stuff

### Initialize the package.json file

```
$ npm init
```

### Install all the Webpack and Babel related packages

```
$ npm i babel-loader babel-core webpack --save-dev
$ npm i babel-preset-es2015 --save-dev
$ npm i webpack-dev-server --save-dev
$ npm i babel-register --save-dev
$ npm i babel-istanbul babel-istanbul-loader --save-dev
```

### Install all the test related Stuff

```
$ npm i mocha chai sinon --save-dev
$ npm i karma karma-chai karma-coverage karma-mocha karma-phantomjs-launcher karma-sourcemap-loader karma-spec-reporter karma-webpack --save-dev
$ npm i yargs --save-dev
```

### Install all the ESLint Stuff

```
$ npm i eslint eslint-plugin-import eslint-config-airbnb eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```

### .babelrc

```
$ touch .babelrc
```

.babelrc file
```
{
  "presets": ["es2015"]
}
```

### Webpack.config.js

```
$ touch webpack.config.js
```

webpack.config.js file
```
var webpack = require('webpack');
var path = require('path');
var prod = process.argv.indexOf('--prod') !== -1;
var plugins = [];
var libraryName = 'Library';
var filename = libraryName + '.js';

if (prod) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    filename = libraryName + '.min.js';
}

var config = {
    entry: [
        './src/Library.js'
    ],
    resolve: {
        root: [
            path.resolve(__dirname, './src')
        ],
        extensions: ['', 'js', 'json']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: filename,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ }
        ]
    },
    plugins: plugins
};

module.exports = config;
```

The big difference here is in the "output" part. The new parameters are:

```
library: libraryName,
libraryTarget: 'umd',
umdNamedDefine: true
```

Setting libraryTarget to umd means using universal module definition for the final 
result. And indeed, this piece of code recognizes the environment and provides a 
proper bootstrapping mechanism for our library.

### karma.config.js

```
$ touch karma.config.js
```

karma.config.js file

```
var argv = require('yargs').argv;
var path = require('path');

module.exports = function(config) {
    config.set({
        // only use PhantomJS for our 'test' browser
        browsers: ['PhantomJS'],

        // just run once by default unless --watch flag is passed
        singleRun: !argv.watch,

        // which karma frameworks do we want integrated
        frameworks: ['mocha', 'chai'],

        // displays tests in a nice readable format
        reporters: ['spec', 'coverage'],

        // include some polyfills for babel and phantomjs
        files: [
            './test/**/*.js' // specify files to watch for tests
        ],
        preprocessors: {
            // these files we want to be precompiled with webpack
            // also run tests throug sourcemap for easier debugging
            './test/**/*.js': ['webpack', 'sourcemap']
        },
        coverageReporter: {
            dir : './artifacts/test',
            reporters: [
                { type: 'json', subdir: 'coverage' },
                { type: 'lcov', subdir: 'coverage' }
            ]
        },
        // A lot of people will reuse the same webpack config that they use
        // in development for karma but remove any production plugins like UglifyJS etc.
        // I chose to just re-write the config so readers can see what it needs to have
        webpack: {
            devtool: 'inline-source-map',
            resolve: {
                // allow us to import components in tests like:
                // import Example from 'components/Example';
                root: path.resolve(__dirname, './src'),

                // allow us to avoid including extension name
                extensions: ['', '.js', '.jsx'],

                // required for enzyme to work properly
                alias: {
                    'sinon': 'sinon/pkg/sinon'
                }
            },
            module: {
                // don't run babel-loader through the sinon module
                noParse: [
                    /node_modules\/sinon\//
                ],
                // run babel loader for our tests
                loaders: [
                    { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
                    { test: /\.js?$/, exclude: /(test|node_modules)/, loader: 'babel-istanbul' }
                ],
            },
        },
        webpackMiddleware: {
            noInfo: true
        },
        // tell karma all the plugins we're going to be using to prevent warnings
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-webpack',
            'karma-phantomjs-launcher',
            'karma-spec-reporter',
            'karma-sourcemap-loader',
            'karma-coverage'
        ]
    });
};
```

### Eslint config

```
$ touch .eslintignore
$ touch .eslintrc
```

.eslintignore file

```
node_modules/
dist/
*.config.js
```

.eslintrc file

```
{
  "extends": "airbnb",
  "rules": {
    "indent": [2, 4]
  }
}
```

### Scripts in package.json

Include these scripts in package.json:

```
"scripts": {
    "build": "./node_modules/.bin/webpack --display-error-details && ./node_modules/.bin/webpack --prod",
    "dev": "./node_modules/.bin/webpack-dev-server --port 3000 --devtool eval --progress --colors --hot --content-base dist",
    "test": "node_modules/.bin/karma start karma.config.js",
    "test:watch": "ynpm run test -- --watch",
    "lint": "./node_modules/.bin/eslint . --ext .js"
}
```
