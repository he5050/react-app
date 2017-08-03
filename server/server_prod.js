import koa from "koa"
import logger from "koa-logger"
import convert from "koa-convert"
import { baseRouter} from "./routers/site"
import { proxyRouter } from "./routers/proxy"
// 载入 基础设置
const loadMiddleware = (path, app) => {
  require(path).default(app)
}

// 载入路由
const loadRouter = (router, app) => {
  app.use(router.routes(), router.allowedMethods())
}

const app = new koa()

loadMiddleware('./middleware/static_file', app)
loadRouter('./routers/public_proxy', app)
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
