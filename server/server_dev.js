import koa from "koa"
import {proxyRouter} from "./routers/proxy"
import {devStaticFileRouter} from "./middleware/dev_static_file"
import {baseRouter} from ".routers/site"

// 载入 基础设置
const loadMiddleware = (path, app) => {
    require(path).default(app)
}

// 载入路由
const loadRouter = (router, app) => {
    app.use(router.routers(), router.allowedMethods())
}

const app = new Koa()

loadMiddleware('./middleware/webpack', app)
loadRouter(devStaticFileRouter, app)
loadMiddleware('./middleware/static_file', app)
loadMiddleware('./middleware/favicon', app)
loadMiddleware('./middleware/bodyparser', app)
loadMiddleware('./middleware/ejs', app)
loadMiddleware('./middleware/session', app)
loadMiddleware('./middleware/client_type', app)

loadRouter(homeRouter, app)
loadRouter(baseRouter, app)
loadMiddleware('./middleware/auth', app)
loadRouter(proxyRouter, app)


var config = require('./config/index')

app.listen(config.listen_port)
console.log(config.env, config.listen_port)
