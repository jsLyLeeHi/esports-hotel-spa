const Webpack = require('webpack');
const Merge = require('webpack-merge');
const BaseWebpackConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const Path = require('path');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = Merge(BaseWebpackConfig, {
    devtool: '#source-map',
    output: {
        path: Path.join(__dirname, '..', 'dist'),
        filename: `js/[name].js`,
        publicPath: '/'
    },
    plugins: [
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
});
