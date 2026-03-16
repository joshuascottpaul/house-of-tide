// ══════════════════════════════════════════════════════════
//  WEBPACK PRODUCTION CONFIGURATION
// ══════════════════════════════════════════════════════════
// Optimized build with bundle analysis
// ══════════════════════════════════════════════════════════

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  
  entry: {
    app: './house-of-tide.html'
  },
  
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
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
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: '*.js', to: '[name][ext]' },
        { from: 'tests', to: 'tests', noErrorOnMissing: true }
      ]
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false
    })
  ],
  
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
