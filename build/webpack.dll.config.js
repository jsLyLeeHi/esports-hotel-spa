const Path = require('path');
const Webpack = require('webpack');
const hash = '[hash:7]';
const AssetsPlugin = require('assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Moment = require('moment');
module.exports = {
    mode: 'production',
    context: Path.resolve(__dirname, '../permanent'),
    devtool: 'eval',
    entry: {
        permanent: ['vue', 'vue-router', 'vuex', 'axios']
    },
    output: {
        path: Path.join(__dirname, '..', 'permanent'),
        filename: `[name].${hash}.min.js`,
        library: '[name]_library'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                test: /\.js(\?.*)?$/i,
                uglifyOptions: {
                    compress: false
                }
            })
        ]
    },
    plugins: [
        new CompressionPlugin(),
        new Webpack.DllPlugin({
            path: Path.join(__dirname, '..', 'permanent', '[name]-manifest.json'),
            name: '[name]_library'
        }),
        new AssetsPlugin({
            filename: 'bundle-config.json',
            path: './permanent'
        }),
        new Webpack.BannerPlugin(`打包时间: ${Moment().format('YYYY-MM-DD,hh:mm:ss')}`),
        new BundleAnalyzerPlugin()
    ]
};
