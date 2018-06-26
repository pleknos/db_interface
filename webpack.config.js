const path = require( 'path' )
const nodeExternals = require( 'webpack-node-externals' )

module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  resolve: {
    alias: {
      src: path.resolve( __dirname, 'src' ),
      components: path.resolve( __dirname, 'src/components' ),
      utilities: path.resolve( __dirname, 'src/utilities' ),
      configs: path.resolve( __dirname, 'src/configs' ),
    },
  },
  output: {
    path: path.resolve( __dirname, 'app' ),
    filename: 'main.js',
  },
  target: 'electron-renderer',
  externals: [nodeExternals()],
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
    ],
  },
}

