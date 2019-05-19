const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const { produce } = require('immer');

let devMode = false;
if (
    process.env.NODE_ENV == null ||
    process.env.NODE_ENV.substr(0, 3).toLowerCase() === 'dev'
) {
    devMode = true;
    console.log('Webpack is running in development mode');
}

const default_config = (isNode) => {
    const config = {
        target: 'web',
        mode: devMode ? 'development' : 'production',
        devtool: devMode ? 'inline-source-map' : 'source-map',
        resolve: {
            alias: {
                react: require.resolve('react'),
                'react-dom': require.resolve('@hot-loader/react-dom')
            },
            extensions: ['.ts', '.tsx', '.js', '.json'],
            plugins: [
                //This is important for monorepo resolve modules
                new TsconfigPathsPlugin({
                    configFile: path.resolve('./tsconfig.json'),
                    logLevel: 'info',
                    extensions: ['.ts', '.js', '.tsx']
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true,
                            babelrc: false,
                            presets: [
                                [
                                    require.resolve('@babel/preset-env'),
                                    {
                                        targets: isNode
                                            ? { node: 'current' }
                                            : { browsers: 'last 2 versions' },
                                        modules: false
                                    } // or whatever your project requires
                                ],
                                require.resolve('@babel/preset-typescript'),
                                require.resolve('@babel/preset-react')
                            ],
                            plugins: [
                                // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                                // ['@babel/plugin-proposal-decorators', { legacy: true }],
                                [
                                    require.resolve(
                                        '@babel/plugin-proposal-class-properties'
                                    ),
                                    { loose: true }
                                ],
                                [
                                    require.resolve(
                                        '@babel/plugin-transform-runtime'
                                    )
                                ],
                                require.resolve('react-hot-loader/babel')
                            ]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: isNode
                        ? [
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1
                                }
                            }
                        ]
                        : [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                                    plugins: [
                                        require('tailwindcss'),
                                        require('autoprefixer')
                                    ]
                                }
                            }
                        ]
                }
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': devMode
                    ? '"development"'
                    : '"production"',
            })
            // new BundleAnalyzerPlugin()
            // ...(devMode ? [new webpack.HotModuleReplacementPlugin()] : [])
        ],
        output: {
            path: path.resolve('./dist'),
            filename: '[name].bundle.js',
            publicPath: '/'
        }
    };

    if (!isNode) {
        config.devServer = {
            disableHostCheck: true,
            clientLogLevel: 'info',
            // Enable gzip compression of generated files.
            compress: true,
            // watchContentBase: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            historyApiFallback: {
                // Paths with dots should still use the history fallback.
                // See https://github.com/facebookincubator/create-react-app/issues/387.
                disableDotRule: true
            },
            host: 'localhost',
            hot: true,
            noInfo: true,
            overlay: false,
            port: 3001,
            quiet: true,
            https: true,
            writeToDisk: true,
            // By default files from `contentBase` will not trigger a page reload.
            // Reportedly, this avoids CPU overload on some systems.
            // https://github.com/facebookincubator/create-react-app/issues/293
            watchOptions: {
                ignored: /node_modules/
            }
        };

        // {
        //     host: "0.0.0.0",
        //     open: true,
        //     // disableHostCheck: true,
        //     contentBase: path.resolve("./dist"),
        //     port: 3001,
        //     hot: true,
        //     // compress: true,
        //     writeToDisk: true
        // }
    }

    return config;
};

module.exports = function config(callback, isNode = false) {
    return produce(default_config(isNode), (default_config_draft) => {
        callback({
            config: default_config_draft,
            mode: devMode ? 'development' : 'production'
        });
    });
};
