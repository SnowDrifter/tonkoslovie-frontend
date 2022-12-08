const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const ESLintPlugin = require("eslint-webpack-plugin");
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
                use: ["babel-loader"]
            },
            {
                test: /\.(less|css)$/i,
                use: ["style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    "less-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.ejs"
        }),
        new FaviconsWebpackPlugin({
            mode: "webapp",
            devMode: "light",
            logo: "./static/icon/favicon.png",
            favicons: {
                icons: {
                    appleStartup: false
                }
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: "static", to: "static"}
            ],
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "API_ENDPOINT": JSON.stringify(properties.apiHost),
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new ESLintPlugin(),
        new CleanWebpackPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
};
