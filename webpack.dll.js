var path = require("path");
var webpack = require("webpack");
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        vendor: [path.join(__dirname, "core", "static", "core", "vendor", "vendor.js")]
    },
    output: {
        path: path.join(__dirname, "core", "static", "core", "vendor", "build", 'vendor'),
        filename: "dll.[name].js",
        library: "[name]"
    },
    optimization: {
        minimizer: [new TerserJSPlugin({sourceMap: true,}), new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            '_': 'lodash',
            'moment': 'moment',
            'Promise': 'es6-promise',
            '$': 'jquery',
            'jQuery': 'jquery'
        }),
        new webpack.DllPlugin({
            path: path.join(__dirname, "core", "static", "core", "vendor", "build", "[name]-manifest.json"),
            name: "[name]"
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }, {
                test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|svg|woff2)(\?\S*)?$/,
                use: ["file-loader?mimetype=image/svg+xml"]
            }
        ]
    },
    resolve: {
        modules: ["node_modules"]
    }
};
