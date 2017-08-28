const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    hot: true,
    contentBase: './dist',
    https: true,
    host: '192.168.1.3',
    port: 3000,
    inline: false
  }
}
