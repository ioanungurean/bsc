const path = require('path');
const merge = require('webpack-merge');
const alias = require('./webpack/alias');
/**
 * Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(config) {
  let _CONFIG_ = { // default config if nothing is passed from CLI
    environment: (config && config.environment) ? config.environment : 'dev',
    theme: (config && config.theme) ? config.theme : 'default'
  };

  console.info('*** Environment', _CONFIG_.environment);
  console.info('*** Theme', _CONFIG_.theme);

  return merge({
    entry: {
      app: [
        path.resolve('client/main.js')
      ]
    },
    output: {
      path: path.join(process.cwd(), 'public'),
      filename: '[name].js',
      chunkFilename: '[chunkhash].[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('client/index.ejs'),
        inject: 'head'
      })
    ],
    resolveLoader: {
      modules: ['node_modules']
    },
    resolve: {
      modules: [
        'devtools',
        'client/src',
        'server',
        'node_modules'
      ],
      extensions: ['.js', '.json', '.scss', '.css', '.html', '.jpg', '.png', '.dae'],
      alias: Object.assign({},
        alias.bootstrap,
        alias.modules,
        alias.ui,
        alias.webc
      )
    },
    node: {
      global: true,
      process: true,
      console: true,
      fs: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader'
            }
          ]
        },
        // {
        //   test: /\.(dae)$/,
        //   exclude: /node_modules/,
        //   use: [
        //     {
        //       loader: 'file-loader',
        //       options: {
        //         name: '[name].js',
        //         outputPath: 'resources/'
        //       }
        //     }
        //   ]
        // },
        {
          test: /\.(jpe?g|gif|png|json)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'resources/'
              }
            }
          ]
        }
      ]
    }
  }, require('./webpack/' + _CONFIG_.environment)(_CONFIG_));
};
