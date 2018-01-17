const express = require('express');
const webpack = require('webpack');
const config = require('./webpack/webpack.config.js');
const webpackMiddleware = require("webpack-dev-middleware");
const compression = require('compression');
const cacheResponseDirective = require('express-cache-response-directive');

const app = express();
const compiler = webpack(config);
const port = process.env.PORT || 80;

app.use(compression());

app.use(cacheResponseDirective());

app.use(webpackMiddleware(compiler, {
    publicPath : config.output.publicPath,
    index: "index.html",
    stats: {
        colors: true
    }
}));

app.get('/*', (req, res) => {
    res.cacheControl({maxAge: 172800000});
    res.sendFile(__dirname + '/src/index.html');
});

app.listen(port, function () {
    console.log('Listening on ' + port);
});
