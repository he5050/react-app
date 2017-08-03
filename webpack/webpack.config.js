
import extractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'
import getEntries from './entries'
import getPlugins from './plugins'

// 跟目录
const ROOT_PATH = path.resolve(__dirname, '../')
// 代码目录
const APP_PATH = path.resolve(ROOT_PATH, 'app')
// node模块目录
const NODE_MODULE_DIR = path.resolve(ROOT_PATH, 'node_module')

// 根据开发环境获取webpack
function getWebPackConfig(param) {
    let webPackConfig = {}

    webPackConfig.entry = getEntries(APP_PATH, param)

    webPackConfig.output = {
        path: ROOT_PATH + '/public/static/',
        filename: 'js/[name].js',
        publicPath: '/static/'
    }

    webPackConfig.resolve = {
        extensions: [
            '.js', '.jsx', '.scss', '.css', '.less'
        ],
        modules: [APP_PATH, "node_modules"]
    }

    webPackConfig.module = {
        rules: []
    }

    if (param.env === 'development') {
        webPackConfig.devtool = "source-map"
    } else {
        webPackConfig.devtool = ""
    }

    // eslint静态代码检查
    //webPackConfig.module.rules.push(
    //  {
    //    test: /\.(js|jsx)$/,
    //    use: [{
    //      loader: 'eslint-loader',
    //      options: {
    //        formatter: require('eslint-friendly-formatter')
    //      }
    //    }],
    //    enforce: "pre",
    //    include: ROOT_PATH,
    //    exclude: NODE_MODULE_DIR
    //  }
    //)

    webPackConfig.module.rules.push({test: /\.(js|jsx)$/, use: ['babel-loader'], include: APP_PATH, exclude: NODE_MODULE_DIR})

    webPackConfig.module.rules.push({
        test: /\.(scss|css)$/,
        use: extractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: { // 如果没有options这个选项将会报错 No PostCSS Config found
                        plugins: (loader) => [
                            require('postcss-import')({root: loader.resourcePath}),
                            require('autoprefixer')({
                                browsers: [
                                    '> 1%',
                                    'last 2 versions',
                                    'Chrome >= 15',
                                    'Explorer >= 9',
                                    'Firefox >= 12',
                                    'Safari >= 5.1',
                                    'Opera >= 12',
                                    'Android >= 4.1',
                                    'iOS >= 8',
                                    //'last 5 Chrome versions',
                                    //'last 5 Firefox versions',
                                    //'last 3 Opera versions',
                                    //'last 3 Safari versions',
                                    //'last 3 OperaMobile versions',
                                    //'last 3 OperaMini versions',
                                    //'last 3 ChromeAndroid versions',
                                    //'last 3 FirefoxAndroid versions',
                                    //'last 3 ExplorerMobile versions'
                                ],
                                cascade: true, //是否美化属性值 默认：true 像这样：
                                remove: true //是否去掉不必要的前缀 默认：true
                            }), //CSS浏览器兼容
                            require('cssnano')() //压缩css
                        ]
                    }
                }, {
                    loader: 'sass-loader'
                }
            ]
        })
    })

    //webPackConfig.module.rules.push(
    //  {
    //    test: /\.(png|jpg|gif|md)$/,
    //    use: ['file-loader?limit=10000&name=[md5:hash:base64:10].[ext]'],
    //    include: APP_PATH,
    //    exclude: NODE_MODULE_DIR
    //  }
    //)
    //
    //webPackConfig.module.rules.push(
    //  {
    //    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    //    use: ['url-loader?limit=10000&mimetype=image/svg+xml'],
    //    include: APP_PATH,
    //    exclude: NODE_MODULE_DIR
    //  }
    //)

    webPackConfig.plugins = getPlugins(param.env)

    return webPackConfig
}

module.exports = getWebPackConfig
