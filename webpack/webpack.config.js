const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const properties = require("./properties.js").load(process.env.NODE_ENV);

module.exports = {
    mode: properties.isDev ? "development" : "production",
    entry: ["./src/index.js"],
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/",
        filename: "bundle.[hash].js",
    },
    resolve: {
        roots:  [
            path.resolve("./src"),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
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
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    output: {
                        comments: false
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