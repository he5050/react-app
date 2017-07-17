import favicon from "koa-favicon"

// 设置全局图标
export default (app)=>{
    app.use(favicon(__dirname + '/../../public/static/images/favicon.ico'))
}
