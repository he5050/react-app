import staticServer from 'koa-static'

// 使用koa static中间 设置public目录为项目的静态文件目录 文件缓存时间为 一小时
// https://github.com/koajs/static
export default(app) => {
    app.use(staticServer(__dirname + '/../../public', {
        'maxage': 60 * 60 * 1000
    }))
}
