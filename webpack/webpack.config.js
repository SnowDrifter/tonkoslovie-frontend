const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: process.env.NODE_ENV,
    entry: ["./src/index.js"],
    output: {
        path: path.resolve(__dirname, "assets"),
        publicPath: "/assets/",
        filename: "bundle.[hash].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.join(process.cwd(), "src")
                ],
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    {loader: "css-loader", options: {importLoaders: 1}},
                    "less-loader"
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                loader: "file-loader?name=img/img-[hash:6].[ext]"
            },
            {
                test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
                use: "file-loader?limit=100000"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.ejs",
            filename: path.resolve(__dirname, "assets/index.html")
        }),
        new CopyWebpackPlugin([
            {from: "static"}
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "API_ENDPOINT": JSON.stringify(process.env.API_ENDPOINT),
                "MEDIA_ENDPOINT": JSON.stringify(process.env.MEDIA_ENDPOINT),
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            }),
            new CompressionPlugin({
                algorithm: "gzip",
                test: /\.js$|\.html$/,
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            })
        ]
    }
};