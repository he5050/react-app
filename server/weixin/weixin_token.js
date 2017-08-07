/**
 * 用于获取微信token
 */
import CacheManger from "../cache/cache_manger";
import ProxyManger from "../proxy/proxy_manger";

class WXTokenApi {
    static Instance() {
        if (this.instance == null) {
            // 创建单例
            this.instance = new WXTokenApi()
        }
        return this.instance
    }

    constructor() {
        console.log('正在获取wx token');
    }

    // 获取token的方法
    getToken(appId, appSecret) {
        return new Promise((resolve, reject) => {
            // 判断是否有获取过token
            let token = CacheManger.Instance().get(`${appId}_${appSecret}_wxToken`)
            if (token !== null) {
                let res = {
                    success: true,
                    message: '',
                    count: 1
                }
                res.data = [
                    {
                        ...token
                    }
                ]
                resolve(res);
            } else {
                ProxyManger.getInstance().HttpsGet({
                    path: `/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
                    method: "GET",
                    host: 'api.weixin.qq.com'
                }, (err, data) => {
                    let res = {
                        success: true,
                        message: '',
                        count: 1,
                        data: [{}]
                    }

                    if (err) {
                        res.message = "错误"
                        res.success = false
                    } else {
                        // 判断调用是否出错
                        if (data.errcode) {
                            // 出错了
                            res.message = data.errmsg
                            res.success = false
                        } else {
                            // 超时时间设定为微信返回的3/4
                            data.expires_in = (data.expires_in) * (3 / 4) * 1000
                            CacheManger.Instance().set(`${appId}_${appSecret}_wxToken`, data, data.expires_in)
                            res.data = [
                                {
                                    ...data
                                }
                            ]
                        }
                    }
                    resolve(res)
                })
            }
        })
    }

    // 获取用户的openid
    getOpenId(appId, appSecret, code) {
        return new Promise((resolve, reject) => {
            ProxyManger.getInstance().HttpsGet({
                path: `/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`,
                method: "GET",
                host: 'api.weixin.qq.com'
            }, (err, data) => {
                let res = {
                    success: true,
                    message: '',
                    count: 1,
                    data: [{}]
                }
                if (err) {
                    res.message = "错误"
                    res.success = false
                } else {
                    // 判断调用是否出错
                    if (data.errcode) {
                        // 出错了
                        res.message = data.errmsg
                        res.success = false
                    } else {
                        res.data = [
                            {
                                ...data
                            }
                        ]
                    }
                }
                resolve(res)
            })
        })
    }

    // 获取用户信息
    getUserInfo(accessToken, openid, lang = 'zh_CN') {
        return new Promise((resolve, reject) => {
            ProxyManger.getInstance().HttpsGet({
                path: `/cgi-bin/user/info?access_token=${accessToken}&openid=${openid}&lang=${lang}`,
                method: "GET",
                host: 'api.weixin.qq.com'
            }, (err, data) => {
                let res = {
                    success: true,
                    message: '',
                    count: 1,
                    data: [{}]
                }
                if (err) {
                    res.message = "错误"
                    res.success = false
                } else {
                    // 判断调用是否出错
                    if (data.errcode) {
                        // 出错了
                        res.message = data.errmsg
                        res.success = false
                    } else {
                        res.data = [
                            {
                                ...data
                            }
                        ]
                    }
                }
                resolve(res)
            })
        })
    }

    // 获取ticket
    getTicket(access_token, expires) {
        return new Promise((resolve, reject) => {
            let ticket = CacheManger.Instance().get('wxTicket')
            if (ticket !== null) {
                let res = {
                    success: true,
                    message: '',
                    count: 1
                }
                res.data = [
                    {
                        ...ticket
                    }
                ]
                resolve(res);
            } else {
                ProxyManger.getInstance().HttpsGet({
                    path: `/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`,
                    method: "GET",
                    host: 'api.weixin.qq.com'
                }, (err, data) => {
                    let res = {
                        success: true,
                        message: '',
                        count: 1,
                        data: [{}]
                    }
                    if (err) {
                        res.message = "错误"
                        res.success = false
                    } else {
                        // 判断调用是否出错
                        if (data.errcode) {
                            // 出错了
                            res.message = data.errmsg
                            res.success = false
                        } else {
                            // 超时时间
                            CacheManger.Instance().set('wxTicket', data, expires)
                            res.data = [
                                {
                                    ...data
                                }
                            ]
                        }

                        resolve(res)
                    }
                })
            }
        })
    }
}

export default WXTokenApi
