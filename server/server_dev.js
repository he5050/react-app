import koa from "koa"
import logger from "koa-logger"
// 载入 中间件基础设置
const loadMiddleware = (path, app) => {
    require(path).default(app)
}

// 载入路由
const loadRouter = (router, app) => {
    app.use(router.routers(), router.allowedMethods())
}

const app = new Koa()
// 设置 日志  后台打印日志
app.use(convert(logger()))
loadMiddleware('./middleware/logs', app)
loadMiddleware('./middleware/webpack', app)
loadRouter('./middleware/dev_static_file', app)
loadRouter('./routers/public_proxy', app)
loadMiddleware('./middleware/static_file', app)
loadMiddleware('./middleware/favicon', app)
loadMiddleware('./middleware/bodyparser', app)
loadMiddleware('./middleware/ejs', app)
loadMiddleware('./middleware/session', app)
loadMiddleware('./middleware/attach', app)

loadRouter('./routers/base', app)
loadRouter('./routers/index', app)
loadMiddleware('./middleware/auth', app)
loadRouter('./routers/proxy', app)
loadRouter('./routers/system', app)

var config = require('./config/index')

app.listen(config.listen_port)
console.log(config.env, config.listen_port)
