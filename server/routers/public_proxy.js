/*
 * 一些不需要认证的公共代理
*/
import Router from "koa-router";
import proxy from "koa-proxy";
import convert from "koa-convert";
import config from "../config/index";
import dealWithOSSPath from "../utils/dealwith_oss_path"

const publicProxyRouter = new Router()

// https请求
let ossCnf = dealWithOSSPath.getBucketPath(config.env)
if (!ossCnf.hostUrl.startsWith('http')) {
    ossCnf.hostUrl = `http:${ossCnf.hostUrl}`
}

// 微信回调域名验证代理
publicProxyRouter.all('/MP_verify_*', convert(proxy({
    host: ossCnf.hostUrl,
    map: (path) => {
        path = `/${ossCnf.baseDir}/mp_verify${path}`
        return path
    }
})))

export default publicProxyRouter
