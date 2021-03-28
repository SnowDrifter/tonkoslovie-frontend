const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const {merge} = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.config.js");

module.exports = merge(common, {
    mode: "production",
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
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            })
        ]
    }
});