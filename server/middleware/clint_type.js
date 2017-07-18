// 判断 客户端访问
export default(app) => {
    app.use(async(ctx, next) => {
        if (!ctx.req.url.startsWith('/static/')) {
            ctx.clientInfo = {
                isMobile: false
            }
            // 判断客户端的浏览器是否是移动端访问
            let userAgent = ctx.req.headers['user-agent']
            console.log(userAgent);
            if (userAgent) {
                let deviceAgent = ctx.req.headers['user-agent'].toLowerCase()
                let agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/)
                console.log(agentID);
                ctx.clientInfo.isMobile = agentID
                    ? true
                    : false
            }
        }
        await next()
    })
}
