const Path = require('path');
const Webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';
const Host = require('../ip.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const hash = '[hash:7]';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Pkg = require('../package.json');
const entry = ['./app/js/entry.js'];
const devEntry = ['webpack/hot/dev-server', 'webpack-hot-middleware/client?reload=true', './app/js/entry.js'];
const title = Pkg.title;

module.exports = {
    mode: isProd ? 'production' : 'development',
    entry: isProd ? entry : devEntry,
    resolve: {
        modules: ['node_modules', Path.join(__dirname, '..', '../node_modules')],
        extensions: ['*', '.vue', '.js', '.json', '.scss'],
        alias: {
            vue$: 'vue/dist/vue.runtime.esm.js',
            _components_: './../components',
            _utils_: './../utils',
            _images_: '../../images'
        }
    },
    watch: isProd ? false : true,
    watchOptions: {
        aggregateTimeout: 500,
        poll: 1000
    },
    performance: {
        hints: isProd ? 'warning' : false,
        assetFilter: function(assetFilename) {
            return !/\.map$/.test(assetFilename);
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [Path.join(__dirname, '..', 'app/js')],
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [Path.join(__dirname, '..', 'app/js')],
                exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [Path.join(__dirname, '..', 'app/js')]
            },
            {
                test: /\.(css|scss|sass)$/,
                use: isProd
                    ? [
                          'vue-style-loader',
                          {
                              loader: MiniCssExtractPlugin.loader
                          },
                          'css-loader',
                          'postcss-loader',
                          'sass-loader'
                      ]
                    : [
                          'vue-style-loader',
                          {
                              loader: 'css-loader',
                              options: {
                                  importLoaders: 2,
                                  sourceMap: true
                              }
                          },
                          'postcss-loader',
                          'sass-loader'
                      ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: `images/[name].${hash}.[ext]`,
                            limit: 8192
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|ttf|woff2)(\?|$)/,
                loader: 'file-loader',
                options: {
                    name: `font/[name].${hash}.[ext]`,
                    limit: 80000
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: isProd ? `css/[name].[contenthash:7].min.css` : `css/[name].css`,
            chunkFilename: isProd ? `css/[name].[contenthash:7].min.css` : `css/[name].css`
        }),
        new Webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(zh-cn)$/),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            },
            HOST: {
                IP: JSON.stringify(Host.ip)
            },
            GlobalUrl: JSON.stringify('http://dianjing.a0d11.com/')
        }),
        new HtmlWebpackPlugin({
            template: 'app/dev.html',
            inject: true,
            title: title,
            chunksSortMode: 'none'
        })
    ]
};
