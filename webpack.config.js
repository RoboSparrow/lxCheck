
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
                { from: 'node_modules/purecss/build/pure-min.css', to: 'purecss', flatten: true},
                { from: 'node_modules/purecss/build/grids-responsive-min.css', to: 'purecss', flatten: true}
            ])
        ],
        watch: true,
        devtool: 'source-map'
};
