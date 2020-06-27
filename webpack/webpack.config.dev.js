const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
    devtool: "inline-source-map",
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, "../dist"),
        port: 3000
    },
});