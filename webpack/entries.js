// 获取入口文件
const getEntries = (app_path, param) => {
    var pageCommon = []
    if (param.env === 'development') {
        pageCommon.push('webpack/hot/dev-server')
        pageCommon.push(`webpack-dev-server/client?http://${param.dev_hot_server_host}:${param.dev_hot_server_port}`)
    }

    return {
        'third': [ // 三方代码
            'promise-polyfill',
            'prop-types',
            'lodash',
            'react',
            "react-dom",
            "react-redux",
            "react-router",
            "react-router-dom",
            "react-addons-update",
            "redux",
            "redux-thunk",
            "shortid",
            'jssha',
            'moment',
            'isomorphic-fetch'
        ],
        'app': [
            ...pageCommon,
            `${app_path}/style/public.scss`
        ],
        'index': [
            ...pageCommon,
            `${app_path}/pages/index/index.jsx`,
            `${app_path}/style/pages/index/index.scss`
        ],
        'system': [
            ...pageCommon,
            `${app_path}/pages/system/index.jsx`,
            `${app_path}/style/pages/system/index.scss`
        ]
    }
}

module.exports = getEntries
