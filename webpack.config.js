
/**
 * http://jlongster.com/Backend-Apps-with-Webpack--Part-I
 */

var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
        entry: "./src/spec.js",
        output: {
            path: __dirname + '/dist',
            filename: "spec.js"
        },
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'jshint-loader'
                }
            ]
        },
        // copy vendors
        plugins: [
            new CopyWebpackPlugin([
                { from: 'node_modules/mocha/mocha.js', to: 'mocha'},
                { from: 'node_modules/mocha/mocha.css', to: 'mocha'},
                { from: 'node_modules/mocha/images/*', to: 'mocha/images', flatten: true},
                { from: 'node_modules/chai/chai.js', to: 'chai', flatten: true},
                //{ from: 'node_modules/js-sha256/build/sha256.min.js', to: 'js-sha256'},
                { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'bootstrap'},
                { from: 'node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'bootstrap'},
                { from: 'node_modules/bootstrap/dist/fonts/*', to: 'bootstrap/fonts'}
            ])
        ],
        watch: true,
        devtool: 'source-map'
};
