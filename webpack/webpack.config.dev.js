const path = require("path");
const {merge} = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "../dist")
        },
        port: 3000,
        devMiddleware: {
            stats: {
                assets: false,
                children: false,
                chunks: false,
                chunkModules: false,
                modules: false,
                reasons: false,
                useExports: false
            }
        }
    }
});