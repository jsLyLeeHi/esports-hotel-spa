const BrowserSync = require('browser-sync');
const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.dev.conf');
const bundler = Webpack(WebpackConfig);
const bs = BrowserSync.create();
const ProxyMiddleware = require('http-proxy-middleware');
const Host = require('../ip.json');
const proxy = ProxyMiddleware('/index/**', {
    target: 'http://dianjing.a0d11.com/',
    changeOrigin: true,
    logLevel: 'debug'
});

// const proxyHotel = ProxyMiddleware('/', {
//     target: 'http://dianjing.a0d11.com/',
//     changeOrigin: true,
//     logLevel: 'debug'
// });

bs.init({
    logPrefix: 'dora',
    ui: {
        port: 5081,
        weinre: {
            port: 9090
        }
    },
    ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
    },
    port: 5080,
    open: 'external',
    host: Host.ip,
    server: {
        baseDir: ['dist'],
        middleware: [
            proxy,
            // proxyHotel,
            WebpackDevMiddleware(bundler, {
                publicPath: WebpackConfig.output.publicPath,
                stats: { colors: true }
            }),
            WebpackHotMiddleware(bundler)
        ]
    }
});
