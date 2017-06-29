const path = require('path');
const webpack = require('webpack');
/**
 * Plugins
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const projectPaths = {
  source: 'client/src',
  dist: 'public'
};

module.exports = function(config) {
  return {
    plugins: [
      new ExtractTextPlugin({
        filename: 'bundle.css',
        allChunks: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function(module) { // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            use: [
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
          })
        }
      ]
    }
  };
};
