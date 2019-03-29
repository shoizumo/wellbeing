module.exports = {
  // mode: 'development',//'production',//'development',
  // devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    path: `${__dirname}/js`,
    filename: 'main.js'
  },
  devServer: {
    contentBase: './js'
  },
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env"
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
  ]
};