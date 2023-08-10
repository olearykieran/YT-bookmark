const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    popup: './popup.js',
    bookmarks: './bookmarks.js', // Adjust paths according to your structure
    content: './content.js', // Add this line to include your content.js
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: './bookmarks.html',
      filename: 'bookmarks.html',
      chunks: ['bookmarks']
    }),
  ],
  module: {
    rules: [
      // Add any other loaders you need, like Babel
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};