const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.config.js");

console.log(`#### This env is development ####`);

module.exports = merge(base, {
  mode: "development",
  devtool: "source-map",
  output: {
    path: __dirname + "/dist/browser/",
    filename: "stellar-suite-dev.js",
    library: "StellarSuite",
    libraryTarget: 'umd'
  },
});
