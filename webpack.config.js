const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const mode = process.argv[3] || 'development';

const OPTIONS = {
  ENTRY: {
    production: './src/client/tracker.js',
    development: './src/index.js',
  },
  OUTPUT_PATH: {
    production: 'build',
    development: 'dist',
  },
  OUTPUT_FILENAME: {
    production: 'jstrakcer.js',
    development: 'main.js',
  },
};
module.exports = {
  mode,
  entry: OPTIONS.ENTRY[mode],
  devtool: 'inline-source-map',
  plugins: mode === 'production' ? [new CleanWebpackPlugin([OPTIONS.OUTPUT_PATH[mode]])] : [
    new CleanWebpackPlugin([OPTIONS.OUTPUT_PATH[mode]]),
    new HtmlWebpackPlugin({
      title: 'Output Management',
    }), new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist',
  },
  output: {
    path: path.resolve(__dirname, OPTIONS.OUTPUT_PATH[mode]),
    filename: OPTIONS.OUTPUT_FILENAME[mode],
    // globalObject: 'this',
  },
};
