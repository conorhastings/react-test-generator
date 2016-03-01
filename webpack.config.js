const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
  context: path.join(__dirname),
  devtool: 'source-map',
  entry: {
        index: "./test/index.js"
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js"
  },
  module: {
      loaders: [{
          test: /\.js?$/,
          loader: 'babel',
          query: {
            presets: ["es2015", "react", "stage-2"],
            "plugins": [["react-transform", {
              "transforms": [{
                "transform": path.join(__dirname, 'src', 'index.js')
              }]
            }]]
          },
          include: [path.join(__dirname, 'test'), path.join(__dirname, 'src')]
      }]
  },
}