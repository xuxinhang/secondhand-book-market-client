module.exports = {
  lintOnSave: false,
  publicPath: '',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://159.65.66.147/',
        pathRewrite: {
          '^/api': '/api',
        },
        ws: true,
        changeOrigin: true
      },
      '/download': {
        target: 'http://192.168.137.1:5000/',
        pathRewrite: {
          '^/download': '/download',
        },
        ws: true,
        changeOrigin: true
      },
    },
  },
}
