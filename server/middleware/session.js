/*
 * session存储中间件
 */
import session from 'koa-generic-session'
import convert from 'koa-convert'

import connection from '../session/story'
import {APPPrefix} from '../const/const'

const sessionStore = new connection()

export default(app) => {
    app.keys = ['my_app'] // 默认cookie的名称
    app.use(convert(session({ // 中间件转换
        store: sessionStore, // 会话存储的实例 这里使用的rethinkdb
        prefix: APPPrefix.Session, // session 前缀 其余可以 参考 https://github.com/koajs/generic-session
        cookie: {
            httpOnly: true,
            path: '/',
            overwrite: true,
            signed: true,
            maxAge: 4 * 60 * 60 * 1000 //毫秒 4小时
        }
    }})))
}
