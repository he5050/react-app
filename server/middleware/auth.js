/*
 * 认证中间件，认证用户是否登录
 * 1.未登录，跳转到登录界面
 * 2.已登录，更新session过期时间
 */
import {UserType} from "../role/role";

// 更新session失效时间
const updateSessionExpires = async(ctx, next) => {
    // 每次操作激活一下cookie的过期时间 TODO:延长时间,目前是一天
    let dt = new Date()
    dt.setMinutes(dt.getMinutes() + 60 * 24)
    ctx.session.cookie.expires = dt

    await next()
}

export default(app) => {
    app.use(async(ctx, next) => {
        // 判断是否是js这些静态文件访问
        // 前台路由不需要认证
        if (ctx.url.startsWith('/static/') || ctx.url.startsWith('/index/') || ctx.url.startsWith('/api/index/')) {
            return await next()
        }

        // 获取用户的用户类型
        let userType = -1
        if (ctx.session.sid) {
            userType = ctx.session.user.userType
        }
        // 根据用户类型判断访问的url是否合法 判断请求是否为后台
        if (ctx.url.startsWith('/api/admin') || ctx.url.startsWith('/admin')) {
            // 判断是否管理员登录
            if (userType === UserType.ADMIN) {
                return await updateSessionExpires(ctx, next)
            }
        }  else {
            // URL不合法，重定向到大首页
            return ctx.redirect('/')
        }

        // 访问不合法，清空session
        ctx.session = null
        // 判断为api
        if (ctx.url.startsWith('/api')) {
            ctx.body = {
                success: false,
                message: "好像访问出了点问题",
                data: ['/login'],
                code: 302,
                count: 0
            }
        } else {
            ctx.redirect('/login')
        }
    })
}
