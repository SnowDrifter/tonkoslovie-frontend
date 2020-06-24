const express = require("express");
const webpack = require("webpack");
const config = require("./webpack/webpack.config.js");
const webpackMiddleware = require("webpack-dev-middleware");
const compiler = webpack(config);
const compression = require("compression");
const cacheResponseDirective = require("express-cache-response-directive");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(compression());

app.use(cacheResponseDirective());

app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    index: "index.html",
    stats: {
        colors: true
    }
}));

app.use("/*", function (req, res) {
    const filename = path.join(compiler.outputPath, "index.html");

    compiler.outputFileSystem.readFile(filename, function (err, result) {
        res.set("Content-Type", "text/html");
        res.send(result);
        res.end();
    });
});

app.listen(PORT, function () {
    console.log("Listening on " + PORT);
});
