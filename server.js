const express = require('express');
const webpack = require('webpack');
const config = require('./webpack/webpack.config.js');
const webpackMiddleware = require("webpack-dev-middleware");
const app = express();
const compiler = webpack(config);
const compression = require('compression');
const cache = require('cache-control');


const port = process.env.PORT || 3000;

app.use(compression());

app.use(webpackMiddleware(compiler, {
    publicPath : config.output.publicPath,
    index: "index.html",
    stats: {
        colors: true
    }
}));

app.use(cache({
    '/**': 100000
}));

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.listen(port, function () {
    console.log('Listening on ' + port);
});
