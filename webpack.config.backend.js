const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const SshWebpackPlugin = require('ssh-webpack-plugin');

module.exports = {
    entry: './backend.ts',
    output: {
        filename: 'backend.js',
        path: path.resolve(__dirname, 'backend')
    },
    externals: {
        //electron: 'electron'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    //devtool: 'cheap-source-map',
    devtool: 'cheap-module-eval-source-map',
    target: 'node',
    plugins: [

        /*
                new SshWebpackPlugin({
                    host: 'koserver',
                    port: '22',
                    username: 'pi',
                    privateKey: require('fs').readFileSync('/Users/konni/.ssh/id_rsa'),
                    before: 'mkdir beforeTest',
                    after: 'mkdir afterTest',
                    from: './backend',
                    to: '/home/pi/vocularyTrainer',
                })
                */

    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['text-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'file-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                // We need to transpile Polymer itself and other ES6 code
                // exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [[
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: [
                                        // Best practice: https://github.com/babel/babel/issues/7789
                                        '>=1%',
                                        'not ie 11',
                                        'not op_mini all'
                                    ]
                                },
                                debug: true
                            }
                        ]],
                        plugins: [['@babel/plugin-syntax-object-rest-spread', { useBuiltIns: true }]]
                    }
                }
            }
        ],
    },
};