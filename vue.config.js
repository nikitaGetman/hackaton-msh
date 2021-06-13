module.exports = {
  lintOnSave: true,

  devServer: {
    open: true,
    watchOptions: {
      poll: true
    },
    // Configure proxy, more: https://github.com/chimurai/http-proxy-middleware#http-proxy-options
    proxy: 'http://45.9.24.21:3000'
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/scss/vars";'
      }
    }
  },

  transpileDependencies: ['vuetify']
}
