const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebPackPlugin = require('copy-webpack-plugin');
const MiniCss = require('mini-css-extract-plugin'); // Позволяет выносить стили из тега head

module.exports = {
  context: path.resolve(__dirname, 'src'), // Указывает на папку с исходниками
  mode: 'development',
  entry: {
    main: './index.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // resolve: {
  //   extensions: ['.js', '.json', '.png'], // Расширения по умолчанию, которые не нужно указывать
  //   alias: {
  //     '@models': path.resolve(__dirname, 'src/models'), // псевдоним для пути
  //     '@': path.resolve(__dirname, 'src'),
  //   }
  // },
  optimization: {
    splitChunks: {
      chunks: 'all', // Позволяет выносить библиотеки отдельно из файлов
    },
  },
  // devServer: { // Аналог live server хранит dist в ram
  //   port: 4200,
  // },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
    // new CopyWebPackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src/assets/favicon.ico'),
    //       to: path.resolve(__dirname, 'dist')
    //     },
    //   ]
    // }),
    new MiniCss({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCss.loader, 'css-loader'], // Справа налево
        // use: [
        //   {
        //     loader: MiniCss.loader,
        //     options: {
        //       hmr: isDev, // hot module replacement
        //       reloadAll: true,
        //     }
        //   }
        // ]
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource',
      },
    ],
  },
};
