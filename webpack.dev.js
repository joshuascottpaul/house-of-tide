// ══════════════════════════════════════════════════════════
//  WEBPACK DEVELOPMENT CONFIGURATION
// ══════════════════════════════════════════════════════════
// Hot Module Reloading for development
// ══════════════════════════════════════════════════════════

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  
  entry: {
    app: './house-of-tide.html'
  },
  
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, '.'),
    },
    hot: true,
    open: true,
    port: 8080,
    liveReload: true,
    watchFiles: ['**/*.js', '**/*.css', '**/*.html']
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './house-of-tide.html',
      filename: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: '*.js', to: '[name][ext]' },
        { from: 'tests', to: 'tests', noErrorOnMissing: true }
      ]
    })
  ],
  
  performance: {
    hints: false
  }
};
