const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const paths = require('../paths');
const configFactory = require('./webpack.base.config');

const clientConfig = configFactory(({ config }) => {
    config.entry = {
        vendor: [
            // Required to support async/await
            require.resolve('@babel/polyfill')
        ],
        main: [
            // 'webpack-dev-server/client?http://localhost:3001/',
            // 'webpack/hot/only-dev-server',
            'react-hot-loader/patch',
            paths.appClientIndexJs
        ]
        // main: [require.resolve('./webpackHotDevClient'), './src/client/index.tsx'],
    };

    config.plugins = [
        ...config.plugins,
        new webpack.DefinePlugin({
            'process.env.IS_CLIENT': JSON.stringify('true')
        })
    ];

    config.output = {
        path: path.resolve(paths.appRootDir, './dist'),
        filename: '[name].bundle.js',
        publicPath: 'https://localhost:3001/'
    };

    return config;
});

const serverConfig = configFactory(({ config }) => {
    config.entry = [
        require.resolve('./hot/only-dev-server'),
        paths.appServerIndexJs
    ];
    // config.watch = true;
    config.target = 'node';
    config.externals = [
        nodeExternals({
            whitelist: [
                require.resolve('./hot/only-dev-server'),
                /\.(eot|woff|woff2|ttf|otf)$/,
                /\.(svg|png|jpg|jpeg|gif|ico)$/,
                /\.(mp4|mp3|ogg|swf|webp)$/,
                /\.(css|scss|sass|sss|less)$/
            ]
        })
    ];
    config.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        // Prevent creating multiple chunks for the server
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ];

    config.output = {
        path: path.join(paths.appRootDir, 'dist'),
        filename: 'server.js',
        publicPath: 'https://localhost:3001/',
        libraryTarget: 'commonjs2'
        // hotUpdateChunkFilename: 'hot/hot-update.js',
        // hotUpdateMainFilename: 'hot/hot-update.json'
    };

    return config;
}, true);

module.exports = [serverConfig, clientConfig];
