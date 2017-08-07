import config from '../server/config/index'
import getWebPackConfig from './webpack.config'

module.exports = getWebPackConfig(
    {
        env: 'development',
        dev_hot_server_host: conf.dev_hot_server_host,
        dev_hot_server_port: conf.dev_hot_server_port
    }
)
