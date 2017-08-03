var webpack = require('webpack')
var extractTextPlugin = require('extract-text-webpack-plugin')

const getPlugins = (env) => {
  var plugins = []

  // 把不想 bundle 的文件排除掉
  plugins.push(new webpack.IgnorePlugin(/\.svg$/))

  // 默认
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    }
  }))

  // 根据entrys里面的vendors列表,提取公共部分打成vendors.js文件
  plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: [ 'chunk', 'third' ],
    filename: 'js/[name].js',
    minChunks: 2,
  }))

  if (env === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  } else {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      }
    }))
    plugins.push(new webpack.NoEmitOnErrorsPlugin())
  }

  plugins.push(new extractTextPlugin({
    filename: 'css/[name].min.css',
    allChunks: true
  }))

  return plugins
}

module.exports = getPlugins
