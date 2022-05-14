const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env = {}, argv = {}) => {

  const isProd = argv.mode === 'production';

  const config = {
    // We default to development when no 'mode' arg is passed
    mode: argv.mode || 'development',
    // Where should WebPack look for files?
    context: path.join(__dirname, '.'),
    // Which file should WebPack read first?
    entry: {
      'app': './src/js/app.js'
    },
    // Where do we want WebPack to put our file after it builds all of our assets?
    output: {
      filename: '[name].js',
      path: path.join(__dirname, '../wwwroot/dist'),
      publicPath: '/dist/'
    },
    devtool: 'source-map',
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/images', to: 'images' }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, // instead of style-loader
            'css-loader',
            'postcss-loader'
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash]-[name].[ext]'
          }
        },
      ]
    },
    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin()],
    }
  };

  return config;
};