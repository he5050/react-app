/*
 * 开发模式，静态文件访问中间件
 */
import Router from "koa-router";
import proxy from "koa-proxy";
import convert from "koa-convert";
import config from "../config";

// 定义静态文件路由
const devStaticFileRouter = new Router()

// 代理请求
devStaticFileRouter.get('/static/*', convert(proxy({
    host: `http://${config.dev_hot_server_host}:${config.dev_hot_server_port}`,
    map: (path) => {
        return path
    }
})))

export default devStaticFileRouter
