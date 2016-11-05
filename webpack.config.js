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

