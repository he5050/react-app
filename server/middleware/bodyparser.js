import bodyparser from 'koa-bodyparser'

// 设置解析中间件 解析 传递当中的ctx
// body 解析中间件
// 具体api 参考 https://github.com/koajs/bodyparser
export default (app) =>{
    app.use(bodyparser())
}
