const path = require('path');
const webpack = require('webpack');
const colors = require('colors/safe');
const glob = require("glob");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const fs = require('fs');

require('es6-promise')
    .polyfill();

entries = [];
entiesCount = 1;

function fillEntries(entry) {
    entry = "./" + entry;
    console.log(colors.green("    " + entiesCount + ": " + entry));
    entries.push(entry);
    entiesCount += 1;
}

rmDir = function (dirPath) {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
};

console.log(colors.yellow('Find entries'));
glob.sync(path.join(__dirname, 'frontend/js/app.js')).forEach(fillEntries);
glob.sync("/frontend/**/app.js", {
    cwd: path.resolve(__dirname)
})
    .forEach(fillEntries);

console.log('------------------------------------')
console.log(glob.sync("/frontend/**/app.js", {cwd: path.resolve(__dirname)}))

console.log()

console.log(path.resolve(__dirname))
console.log('------------------------------------')

const PROD = JSON.parse(process.env.NODE_ENV || '0');

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': PROD == "1" ? '"production"' : '"development"'
        }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
        '_': 'lodash',
        'moment': 'moment',
        // 'Promise': 'es6-promise',
//        '$': 'jquery',
//        'jQuery': 'jquery',
//        'jquery': 'jquery'
    }),
    function () {
        this.plugin('watch-run', function (watching, callback) {
            console.log(colors.yellow('Begin compile at ' + new Date()));
            callback();
        })
    },
    new MiniCssExtractPlugin({
        filename: '[name].css',
        allChunks: true
    }),
];

let watch = true;

if (PROD) {
    watch = false;
}
console.log(colors.yellow('Run building'));

targets = [];

entries.forEach(function (entry) {
    console.log('\nEntry:', entry, '\n')
    var context = path.resolve(path.dirname(entry));
    var buildFolder = path.join(context, 'build')

    rmDir(buildFolder)

    var targetPlugins = plugins.concat([
        new webpack.DllReferencePlugin({
            manifest: require("./frontend/vendor/build/vendor-manifest.json")
        }),
    ])

    targets.push({
        mode: PROD === '1' ? 'production' : 'development',
        cache: true,
        context: path.resolve(__dirname),
        entry: entry,
        output: {
            path: buildFolder,
            filename: "app.build.js",
        },
        optimization: {
            minimizer: [new TerserJSPlugin({sourceMap: true}), new OptimizeCSSAssetsPlugin({})],
        },
        plugins: targetPlugins,
        devtool: "cheap-module-source-map",
        module: {
            rules: [{
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
                    test: /\.(less)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "less-loader"
                    ]
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                }, {
                    test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|svg|woff2)(\?\S*)?$/,
                    use: ["file-loader?mimetype=image/svg+xml"]
                }]
        },
        watch: watch,
        resolve: {
            modules: ['node_modules', path.resolve(__dirname)],
            extensions: [
                '.jsx',
                '.js',
            ],
            unsafeCache: true,
        }
    })
});

module.exports = targets;
