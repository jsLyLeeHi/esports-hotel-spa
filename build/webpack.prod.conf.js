const Webpack = require('webpack');
const Merge = require('webpack-merge');
const BaseWebpackConfig = require('./webpack.base.conf');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Moment = require('moment');
const Pkg = require('../package.json');
const BundleConfig = require('../permanent/bundle-config.json');
const url = Pkg.url;

var webpackConfig = Merge(BaseWebpackConfig, {
    devtool: 'eval',
    output: {
        path: Path.join(__dirname, '..', `dist-${Moment().format('YYYY-MM-DD_h.mm.ss')}`),
        filename: `js/[name].[chunkhash:7].min.js`,
        publicPath: `${url}${Pkg.name}/dist-${Moment().format('YYYY-MM-DD_h.mm.ss')}/`,
        chunkFilename: `js/[name].[chunkhash:7].min.js`
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                test: /\.js(\?.*)?$/i,
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                        pure_funcs: ['console.log']
                    }
                }
            }),
            new OptimizeCSSPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: false,
                    discardComments: {
                        removeAll: true
                    }
                },
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }]
                },
                canPrint: false
            })
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            url: `<script src='${url}${Pkg.name}/permanent/${BundleConfig.permanent.js}'></script>`,
            template: 'app/index.html',
            inject: true,
            prod: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            },
            title: Pkg.title,
            chunksSortMode: 'none'
        }),
        new Webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../permanent/permanent-manifest.json')
        }),
        new Webpack.BannerPlugin(`打包时间: ${Moment().format('YYYY-MM-DD,hh:mm:ss')}`),
        new Webpack.HashedModuleIdsPlugin(),
        new Webpack.optimize.SplitChunksPlugin({
            chunks: 'async',
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            automaticNameDelimiter: '-',
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                },
                commons: {
                    chunks: 'all',
                    test: /common\/|components\/|utils\//,
                    name: 'commons',
                    priority: 10,
                    enforce: true
                }
            }
        }),
        new Webpack.optimize.RuntimeChunkPlugin({
            name: 'manifest'
        }),
        new CompressionPlugin(),
        new BundleAnalyzerPlugin()
    ]
});

module.exports = webpackConfig;
