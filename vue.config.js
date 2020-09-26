module.exports = {
  chainWebpack: config => {
    // 生产
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 用来判断首页的
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      // 用来判断首页的
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
