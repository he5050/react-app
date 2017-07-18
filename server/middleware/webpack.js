import webpack from 'webpack'
import webapckDevServeice from 'webpack-dev-server'
import config from '../config'
import webpackConfig from '../../tools/webpack.dev.config.js'

// 此入webpack 进行编译
export default(app) => {
    let bundleStart = null // 定义编译

    const compiler = webpack(webpackConfig) // 引入配置文件,进行编译

    compiler.plugin('compile', () => {
        console.log('开始编译.....')
        bundleStart = Date.now()
    })

    compiler.plugin('done', () => {
        console.log(`编译用时: ${Date.now() - bundleStart} ms!`)
    })

    const bundler = new webapckDevServeice(compiler, {
        publicPath: webpackConfig.output.publicPath,
        historyApiFallback: true, // 所有的跳转将指向index
        hot: true,
        inline: true,
        quiet: false,
        noInfo: true,
        stats: {
            colors: true
        }
    })

    bundler.listen(config.dev_hot_server_port, 'localhost', () => {
        console.log('正在编译项目,请耐性等待...');
    })
}
