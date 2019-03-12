module.exports = {
  mode: 'development',
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
      }
    ]
  },
  plugins: [
  ]
};