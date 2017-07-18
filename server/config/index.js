const config = {
  platform: 1, // platform:平台  自用针对同一套系统里的不同平台
  env: process.env.NODE_ENV || 'development',
  listen_port: '9000',
  dev_hot_server_host: 'localhost',
  dev_hot_server_port: '9001',
  rethink_db_host: (process.env.NODE_ENV === 'production') ? '127.0.0.1' : 'rethinkdb',
  rethink_db_port: (process.env.NODE_ENV === 'production') ? '28015' : '28015',
  api_host: (process.env.NODE_ENV === 'production') ? '127.0.0.1' : 'gohost',
  api_port: (process.env.NODE_ENV === 'production') ? '8000' : '8000',
  // 微信相关配置
  wx_app_id: (process.env.NODE_ENV === 'production') ? '' : '',
  wx_secret: (process.env.NODE_ENV === 'production') ? '' : '',
}

module.exports = config
