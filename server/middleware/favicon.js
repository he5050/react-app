import favicon from 'koa-favicon'

// 设置全局图标  https://github.com/koajs/favicon
export default (app)=>{
    app.use(favicon(__dirname + '/../../public/static/images/favicon.ico'))
}
