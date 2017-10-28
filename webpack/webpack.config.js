const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require("webpack");
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    entry: ['./src/index.js'],

    output: {
        path: path.resolve('./src'),
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
            {from: 'static'}
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
                "MEDIA_ENDPOINT": JSON.stringify(process.env.MEDIA_ENDPOINT),
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
};

if (IS_PRODUCTION) {
    module.exports.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            beautify: false,
            sourceMap: false,
            mangle: true,
            compress: {
                sequences: true,
                booleans: true,
                loops: true,
                unused: true,
                warnings: false,
                drop_console: true,
                screw_ie8: true
            },
            comments: false
        }),
        new CompressionPlugin({
            algorithm: 'gzip',
            regExp: /\.js$|\.html$/
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    );
}