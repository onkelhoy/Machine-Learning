const debug = process.env.NODE_ENV !== 'production'
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    app: './app.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '/dist')
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
    port: 3000,
    open: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: '/node_modules',
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader']
      }
    ]
  },
  context: __dirname,
  target: 'web',
  devtool: debug ? 'inline-souremap' : null,
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
      disable: !debug
    }),
    new HtmlWebpackPlugin({
      title: 'Neural Network',
      hash: true,
      template: './src/views/template.pug'
    }),
    new webpack.EnvironmentPlugin([ 'NODE_ENV' ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}