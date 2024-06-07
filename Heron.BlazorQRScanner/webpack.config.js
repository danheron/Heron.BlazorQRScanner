const path = require('path');

module.exports = env => ({
    mode: env.mode,
    entry: path.resolve(__dirname, './Scripts/Scanner.ts'),
    experiments: {
        outputModule: true
    },
    devtool: env.mode === 'production' ? 'hidden-nosources-source-map' : 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'Heron.BlazorQRScanner.js',
        path: path.resolve(__dirname, './wwwroot'),
        module: true,
        libraryTarget: 'module'
    }
});