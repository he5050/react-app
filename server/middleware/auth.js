import config from '../config'
import {UserType} from '../../app/utils/code_def'

const updateExpires = async(ctx, next) => {
    // 每次操作激活一下cookie的过期时间 TODO:延长时间,目前是一天
    let dt = new Date()
    dt.setMinutes(dt.getMinutes() + 60 * 24)
    ctx.session.cookie.expires = dt
    // 在访问请求里面带上登录用户的信息,用于访问后台服务器的时候传递当前用户信息
    ctx.req.headers = {
        ...ctx.req.headers,
        'Login-User': encodeURIComponent(JSON.stringify(ctx.seesion.user)) // 解析json 对象成 字符串
    }
    await next()
}

export default(app) => {
    app.use(async(ctx, next) => {
        // 判断是否是js这些静态文件访问
        // 获取客户访问的路由不需要认证
        if (ctx.url.startsWith('/static/')) {
            return await next()
        }
        // 清空session
    })
}
