var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require("webpack");

module.exports = {
    entry: ['./src/index.js'],

    output: {
        path: distPath = path.resolve('.', 'dist'),
        publicPath: "/assets/",
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.join(process.cwd(), 'src')
                ],
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                },
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {loader: 'css-loader', options: {importLoaders: 1}},
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                loader: "file-loader?name=img/img-[hash:6].[ext]"
            },
            {
                test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
                use: 'file-loader?limit=100000'
            }
        ]
    },

    devServer: {
        contentBase: './src',
        inline: true,
        historyApiFallback: true,
        disableHostCheck: true
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'static' }
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};