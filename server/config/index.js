const config = {
    platform: 1, // platform:平台  自用针对同一套系统里的不同平台
    env: process.env.NODE_ENV || 'development', // 环境变量 来决定是生产还是开发
    listen_port: '9000', // 生产模式监听端口
    dev_hot_server_host: 'localhost', // 服务地址
    dev_hot_server_port: '9001', // 热更新

    // 阿里云配置
    aliyun_accessKeyId:'LTAIdRTvcQfp9VGq',
    aliyun_secretAccessKey:'CBqaA881wYVBziEOV0mmURANsoAIeA',
    aliyun_endpoint:'https://sts.aliyuncs.com',
    aliyun_apiVersion:'2015-04-01'

    // 在进行以下配置的的时候请修改本的host文件 使用了rethink_db 做为缓存服务的数据库
    rethink_db_host: (process.env.NODE_ENV === 'production')
        ? '127.0.0.1'
        : 'rethinkdb',
    rethink_db_port: (process.env.NODE_ENV === 'production')
        ? '28015'
        : '28015',
    // API 服务器的地址与端口
    api_host: (process.env.NODE_ENV === 'production')
        ? '127.0.0.1'
        : 'api',
    api_port: (process.env.NODE_ENV === 'production')
        ? '8000'
        : '8000',

    // 微信相关配置
    wx_app_id: (process.env.NODE_ENV === 'production')
        ? ''
        : '',
    wx_secret: (process.env.NODE_ENV === 'production')
        ? ''
        : ''
}
module.exports = config
