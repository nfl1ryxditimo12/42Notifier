const path = require("path");
const webpack = require("webpack");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const dotenv = require("dotenv");
const { NODE_TYPE } = process.env;

const config = {
  event: {
    env: "./.env.event",
    outputPath: "build/event",
  },
  exam: {
    env: "./.env.exam",
    outputPath: "build/exam",
  },
};

console.log(config[NODE_TYPE]);

dotenv.config({
  path: config[NODE_TYPE].env,
});

const outputPath = config[NODE_TYPE].outputPath;

module.exports = {
  entry: "./src/app.ts",
  target: "node",
  externals: [nodeExternals()],
  optimization: {
    minimize: false,
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, outputPath),
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
