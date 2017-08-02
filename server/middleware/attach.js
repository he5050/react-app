/*
 * 信息附加中间件
 * 1.附加客户端信息
 * 2.附加头信息，便于访问后台服务器
 */
export default(app) => {
    app.use(async(ctx, next) => {
        // 判断请求路径是为后端请求 非静态请求
        if (!ctx.req.url.startsWith('/static/')) {
            // 默认设置为 web访问
            ctx.clientInfo = {
                isMobile: false
            }

            // 判断客户端的浏览器是否是移动端访问
            let userAgent = ctx.req.headers['user-agent']
            console.log(`您正使用的设备为: ${userAgent} `)
            // 判断是否移动设备访问
            if (userAgent) {
                let deviceAgent = ctx.req.headers['user-agent'].toLowerCase()
                let agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/)
                ctx.clientInfo.isMobile = agentID
                    ? true
                    : false
            }

            // 在访问请求里面带上登录用户的信息,用于访问后台服务器的时候传递当前用户信息
            if (ctx.req.url.startsWith('/api/')) {
                // 扩展头信息
                ctx.req.headers = {
                    ...ctx.req.headers,
                    // 把session当中的user信息进行转成json字符串,然后进行url编码操作,为了解决多系统这间字节的长短不一的问题
                    // 主要为了把请求当中的非 ASCII 字母和数字进行编码， ASCII 标点符号进行编码： - _ . ! ~ * ' ( )
                    // 可以把下字符中进行编码成16进制 比如 (：;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的。
                    // 在后端口api服务器当中 需要进行对应使用 decodeURIComponent 进行解码操作
                    'Login-User': encodeURIComponent(JSON.stringify(ctx.session.user || {}))
                }
            }
        }
        // 下一个中间件
        await next()
    })
}
