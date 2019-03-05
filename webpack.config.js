const path = require('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    entry: './app/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './app/index.pug',
          inject: false
      }),
      new MiniCssExtractPlugin({
        filename: "main.css",
        template: './app/main.scss'
      })
    ],
    module: {
      rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
              test: /\.(scss|css)$/,
              use: [
                  MiniCssExtractPlugin.loader,
                  {
                    loader: "css-loader",
                    
                  },
                  "sass-loader"
              ]
          },
          {
              test: /\.(pug|jade)$/, 
              loader: 'pug-loader'
          },
          {
            test: /\.(ttf|woff|eot|otf)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[folder]/[name].[ext]',
                }
              }
            ]
          },
          {
            test: /\.(png|jpg|svg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[folder]/[name].[ext]'
                }
              }
            ]
          },
      ]
    }
  };