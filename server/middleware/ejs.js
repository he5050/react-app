import path from 'path'
import ejsEngine from 'koa-ejs'

// 用于解析ejs模板,做为工作的模板文件 使用tps.ejx作为模板根文件所有文件都通用,j_main做为react的挂载文件
// 具体 参考 https://www.npmjs.com/package/koa-ejs
export default(app) => {
    ejsEngine(app, {
        root: path.join(__dirname, '/../../views'),
        layout: 'tpl',
        viewExt: 'ejs',
        cache: true,
        debug: false
    })
}
