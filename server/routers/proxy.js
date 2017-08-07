import Router from "koa-router";
import proxy from "koa-proxy";
import convert from "koa-convert";
import config from "../config/index";

const proxyRouter = new Router()

// 设置请求代理
proxyRouter.all('/api/*', convert(proxy({
    host: `http://${config.api_host}:${config.api_port}`,
    map: (path) => {
        return path
    },
    // requestOptions: (req, opt) => {
    //   // opt.headers = {
    //   //   ...opt.headers,
    //   // }
    //   return opt
    // }
})))

proxyRouter.all('/wxopen/*', convert(proxy({
    host: `https://open.weixin.qq.com`,
    map: (path) => {
        path = path.replace('/wxopen', '')
        return path
    }
})))

proxyRouter.all('/wxapi/*', convert(proxy({
    host: `https://api.weixin.qq.com`,
    map: (path) => {
        path = path.replace('/wxapi', '')
        return path
    }
})))

export default proxyRouter
