import KoaRouter from "koa-router";
import ProxyManager from "../proxy/proxy_manger";
import OSSTokenApi from "../oss/oss_token";
import WXTokenApi from "../weixin/weixin_token";

// koa router
const baseRouter = new KoaRouter()

// 注册
baseRouter.post('/register/', async(ctx, next) => {
    let body = {
        ...ctx.request.body
    }
    let res = await ProxyManager.getInstance().Post('/api/system/register', body, {})
    ctx.body = res
})

// 登录
baseRouter.post('/login/', async(ctx, next) => {
    let body = {
        ...ctx.request.body
    }
    let res = await ProxyManager.getInstance().Post('/api/login', body, {})
    if (res.success) {
        res.data[0].userType = body.userType
        ctx.session.user = res.data[0]
    }
    ctx.body = res
})

// 注销
baseRouter.get('/logout', async(ctx, next) => {
    ctx.session = null
    return ctx.redirect('/login')
})

// 获取OSS Token
baseRouter.get('/ossToken', async(ctx, next) => {
    ctx.body = await OSSTokenApi.Instance().getToken()
})

// 获取微信 Token
baseRouter.get('/wxToken', async(ctx, next) => {
    ctx.body = await WXTokenApi.Instance().getToken()
})

export default baseRouter
