const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const webpack = require("webpack");
const properties = require("./properties.js").load(process.env.NODE_ENV);

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/",
        filename: "bundle.[contenthash].js"
    },
    resolve: {
        roots: [
            path.resolve("./src"),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader","less-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                loader: "file-loader",
                options: {
                    name: "img/img-[hash:6].[ext]"
                }
            },
            {
                test: /\.(eot|otf|webp|ttf|woff|woff2)$/,
                use: "file-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.ejs"
        }),
        new CopyWebpackPlugin([
            {
                from: "static",
                to: "static"
            }
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "API_ENDPOINT": JSON.stringify(properties.apiHost),
                "MEDIA_ENDPOINT": JSON.stringify(properties.mediaHost),
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new CleanWebpackPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
};