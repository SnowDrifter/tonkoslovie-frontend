const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack/webpack.config');
const webpackMiddleware = require("webpack-dev-middleware");
const compiler = webpack(config);
const path = require('path');

const PORT = process.env.PORT || 3000;

const devServerConfig = {
    hot: true,
    open: true,
    historyApiFallback: true,
    disableHostCheck: true
};

const app = new WebpackDevServer(webpack(config), devServerConfig);

app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
}));

app.use('/*', function (req, res) {
    const filename = path.join(compiler.outputPath, 'index.html');

    compiler.outputFileSystem.readFile(filename, function (err, result) {
        res.set('Content-Type', 'text/html');
        res.send(result);
        res.end();
    });
});

app.listen(PORT, function () {
    console.log('Listening on ' + PORT);
});
