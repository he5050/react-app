// 微信token
import CacheManger from "../cache/cache_manger";
import ProxyManger from "../proxy/proxy_manger";
import config from "../config";

class WXTokenApi {
    static Instance() {
        if (this.instance == null) {
            // 创建单例
            this.instance = new WXTokenApi()
        }
        return this.instance
    }

    constructor() {}

    getToken() {
        return new Promise((resolve, reject) => {
            let token = CacheManger.Instance().get('wxToken')
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
                    path: `/cgi-bin/token?grant_type=client_credential&appid=${config.wx_app_id}&secret=${config.wx_secret}`,
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
                            CacheManger.Instance().set('wxToken', data, data.expires_in)
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
