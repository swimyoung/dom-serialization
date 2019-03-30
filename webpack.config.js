module.exports = {
  entry: {
    'dist/domSerialization': `${__dirname}/src/index.js`,
  },
  output: {
    path: __dirname,
    filename: `[name].js`,
    library: 'domSerialization',
    libraryTarget: 'umd',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devtool: 'source-map',
};
