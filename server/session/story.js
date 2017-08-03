/**
 *   koa-generic-session 的自定义插件
 *   rthinkdb
 */

import _ from 'lodash'
import config from '../config/index'

const debug = require('debug')('session:generic-session-rethinkdb')
const Thinky = require('thinky')({db: 'sessions', host: config.rethink_db_host, port: config.rethink_db_port})

// 获取数据库当中的类型
const type = Thinky.type
// 创建连接
const r = Thinky.r

// 创建session模型
const Sessions = Thinky.createModel('sessions', {
    sid: type.string(),
    updateTime: type.date().default(r.now()),
    cookie: {
        expires: type.date().default(r.now()),
        httpOnly: type.boolean(),
        maxage: type.number(),
        overwrite: type.boolean(),
        path: type.string(),
        signed: type.boolean()
    },
    user: {}
})
// 创建索引
Sessions.ensureIndex('sid');

function ThinkySession() {
    this.model = Sessions
}

ThinkySession.prototype.get = async(sid)=>{
    debug('get',sid)
    let res = await this.model.filter({sid: sid}).run()
    if(res[0]){
        return res[0]
    }
    return ''
}


ThinkySession.prototype.set = async(sid, session)=> {
    // 根据sid查询session是否存在
    debug('set', sid, session)
    var res = await this.model.filter({sid: sid}).run()
    if (res[0]) {
        // 更新
        return await this.model.filter({sid: sid}).update({cookie: session.cookie, updateTime: session.cookie.expires})
    } else {
        // 新的session需要删除同一用户的老session
        debug('new session', session)
        if (session.user && session.user.userName) {
            await this.model.filter({
                user: {
                    userName: session.user.userName,
                    userType: session.user.userType
                }
            }).delete()
        }

        var dt = new Date()
        // 重新设置cookie
        dt.setMilliseconds(dt.getMilliseconds() + session.cookie.maxage || session.cookie.maxAge);
        // 插入
        let payload = _.assignIn({
            sid: sid,
            updateTime: dt
        }, session)

        return await this.model.save(payload)
    }
}

ThinkySession.prototype.destroy = async(sid)=> {
    debug('destroy', sid)
    return await this.model.filter({sid: sid}).delete();
}

module.exports = ThinkySession
