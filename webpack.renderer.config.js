'use strict'
const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path")
const isDevelopment = false

module.exports = {
  mode: 'development',
  target: "web",
  entry: [
    path.resolve(__dirname, './src/renderer/main.js')
  ],
  module: {
    rules: [
    {
      test: /\.vue$/,
      use: 'vue-loader'
    },
    {
      test: /\.js$/,
      use: 'babel-loader'
    },
    {
      test: /\.s(a|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDevelopment
          }
        }
      ]
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    },
    { 
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
      loader: "url-loader" 
    },
    { 
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
      loader: "url-loader" 
    },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: [".js", ".scss"]
  }
}