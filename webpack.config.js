const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
        library: 'app' // Used for accessing from global window object
    },
    mode: 'development',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // All files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/index.html' },
                { from: './assets/**/*' }
            ]
        })
    ],
    devServer: {
        host: '0.0.0.0',
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        devMiddleware: {
            writeToDisk: true
        },
        open: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    filename: '[name].bundle.js',
                },
            },
        },
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
}