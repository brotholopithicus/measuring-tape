const merge = require('webpack-merge');
const common = require('./webpack.config.common');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    contentBase: './dist',
    https: true,
    host: '192.168.1.3',
    port: 3000,
    inline: false
  },
})
