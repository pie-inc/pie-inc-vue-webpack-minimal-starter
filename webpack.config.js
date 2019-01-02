const path = require('path');
const webpack = require('webpack');
const NotifierPlugin = require('webpack-notifier');
const WebpackBar = require('webpackbar');
const clip = require('clipboardy');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const stats = {
  all: false,
  assets: true,
  cachedAssets: true,
  children: false,
  chunks: false,
  entrypoints: true,
  errorDetails: true,
  errors: true,
  hash: true,
  modules: false,
  performance: true,
  publicPath: true,
  timings: true,
  warnings: false,
  exclude: [
    'node_modules'
  ]
};

module.exports = (env, argv) => {
  return {
    mode: 'development',
    entry: {
      app: './src/main.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.join(__dirname, 'src'),
        vue: (this.mode === 'development') ? 'vue/dist/vue' : 'vue/dist/vue.min'
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'test'),
            path.join(__dirname, 'node_modules/webpack-dev-server/client')
          ]
        },
        {
          test: /\.css/,
          loader: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'media/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    plugins: [
      new WebpackBar(),
      new webpack.NoEmitOnErrorsPlugin(),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: __dirname + '/src/index.ejs',
        inject: 'body'
      }),
      new NotifierPlugin({
        alwaysNotify: true
      })
    ],
    devtool: '#source-map',
    performance: { hints: false },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: {
              removeAll: true
            },
            discardEmpty: true,
            discardOverridden: true
          }
        }),
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
          },
        })
      ]
    },
    stats: stats,
    devServer: {
      stats: stats,
      port: 4000,
      historyApiFallback: true,
      after: function(app, server) {
        clip.writeSync('http://localhost:4000/');
      }
    },
    node: {
      setImmediate: false,
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  };
};
