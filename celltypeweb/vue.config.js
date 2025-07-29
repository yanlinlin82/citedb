/*
 * @Description:
 * @Version: 1.0.0
 * @Author: Dragon
 * @Date: 2020-07-24 10:01:11
 * @LastEditors: zhangyu
 * @LastEditTime: 2022-02-18 13:54:27
 */
const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
  productionSourceMap: false,
  css: {
    // css预设器配置项
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // 引入全局变量样式,@使我们设置的别名,执行src目录
        additionalData: '@import "~@/scss/utils/_theme.scss";'
      }
    }
  },
  transpileDependencies: [
    'element-plus',
    'axios'
  ],
  // 发布路径，发布到服务端需要和其他项目区分开
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  devServer: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:7999',
        changeOrigin: true,
        pathRewrite: { '^/api/v1': '/api/v1' }
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')

    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@views', resolve('src/views'))
      .set('@components', resolve('src/components'))
      .set('@constants', resolve('src/constants'))
      .set('@config', resolve('src/config'))
      .set('@store', resolve('src/store'))
      .set('@mixin', resolve('src/mixin'))

    // 配置 Vue 特性标志
    config.plugin('define').tap(args => {
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = JSON.stringify(false)
      return args
    })

    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    return config
  },
  lintOnSave: false
}
