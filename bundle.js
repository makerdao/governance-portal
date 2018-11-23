process.env.NODE_ENV = 'production';

require('react-scripts/config/webpack.config.prod').plugins.push(
  new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'report.html'
  })
);

require('react-scripts/scripts/build');
