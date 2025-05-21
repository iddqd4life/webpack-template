const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pages = [
  {
    name: "index",
    entry: "./src/js/index.js",
    template: "./src/index.html",
    filename: "index.html",
  },
];

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    entry: Object.fromEntries(pages.map((page) => [page.name, page.entry])),

    output: {
      filename: "js/[name].bundle.[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true,
    },

    devtool: isDev ? "source-map" : false,

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name].[hash][ext][query]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name].[hash][ext][query]",
          },
        },
        {
          test: /\.html$/,
          loader: "html-loader",
        },
      ],
    },
    plugins: [
      ...pages.map((page) => {
        return new HtmlWebpackPlugin({
          template: page.template,
          filename: page.filename,
          chunks: [page.name],
          minify: {
            removeComments: true,
            collapseWhitespace: false,
          },
        });
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash].css",
      }),
    ],
    devServer: {
      static: "./dist",
      open: true,
      port: 1337,
      hot: true,
      watchFiles: {
        paths: ["src/**/*"],
      },
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    mode: isDev ? "development" : "production",
  };
};
