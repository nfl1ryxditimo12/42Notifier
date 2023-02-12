const path = require("path");
const webpack = require("webpack");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/app.ts",
  target: "node",
  externals: [nodeExternals()],
  optimization: {
    minimize: false,
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build"),
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@controller": path.resolve(__dirname, "./src/controller/"),
      "@repository": path.resolve(__dirname, "./src/repository/"),
      "@entities": path.resolve(__dirname, "./dist/entities/"),
      "@modules": path.resolve(__dirname, "./dist/modules/"),
    },
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
};
