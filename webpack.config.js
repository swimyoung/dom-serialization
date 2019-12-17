module.exports = {
  entry: {
    'dist/domSerialization': `${__dirname}/src/index.ts`,
  },
  output: {
    path: __dirname,
    filename: `[name].js`,
    library: 'domSerialization',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  devtool: 'source-map',
};