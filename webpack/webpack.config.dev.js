const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, "../dist"),
        port: 3000,
        stats: {
            children: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            reasons: false,
            useExports: false,
        }
    }
});