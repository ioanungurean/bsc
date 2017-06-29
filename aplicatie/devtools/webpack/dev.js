const path = require('path');
const webpack = require('webpack');
/**
 * Env. vars
 */
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';
const host = 'http://' + hostname + ':' + port;
const assetHost = process.env.ASSET_HOST || host + '/';
const projectPaths = {
  source: 'client/src',
  dist: 'public'
};

module.exports = (config) => {
  return {
    entry: {
      app: [
        'webpack-dev-server/client?' + host,
        'webpack/hot/only-dev-server'
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        DEVELOPMENT: true
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    stats: 'errors-only',
    devtool: 'source-map', // or 'eval' or false for faster compilation
    devServer: {
      inline: true,
      host: hostname,
      port: port,
      publicPath: assetHost, // Make sure publicPath always starts and ends with a forward slash.
      contentBase: [
        path.join(process.cwd(), projectPaths.source),
        path.join(process.cwd(), projectPaths.dist)
      ],
      clientLogLevel: 'none',
      noInfo: true,
      historyApiFallback: {
        disableDotRule: true,
        proxy: {}
      }
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  path.resolve('node_modules/xbem/src/'),
                  path.resolve(`${projectPaths.source}/ui/themes/${config.theme}`),
                  path.resolve(`${projectPaths.source}/ui/themes/${config.theme}/fonts`),
                  path.resolve(`${projectPaths.source}/ui/themes/${config.theme}/patterns`)
                ]
              }
            }
          ]
        }
      ]
    }
  };
};
