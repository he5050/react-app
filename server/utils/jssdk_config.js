// 用于获取微信jsdk
var jsSHA = require("jssha")

class WXSdkConf {
    // 生成签名的随机串
    createNonceStr() {
        return Math.random().toString(36).substr(2, 15)
    }

    // 生成签名的时间戳
    createTimestamp() {
        return parseInt(new Date().getTime() / 1000) + ''
    }

    // 对所有待签名参数按照字段名的ASCII码从小到大排序(字典序)后，使用URL键值对的格式(即key1=value1&key2=value2…)拼接成字符串string
    raw(args) {
        let keys = Object.keys(args).sort() // 对所有key 进行排序
        let newArgs = {}
        // 把排序之后的值 放入新的对像
        keys.forEach(function(key) {
            newArgs[key.toLowerCase()] = args[key]
        })

        let string = ''
        for (let k in newArgs) {
            string += '&' + k + '=' + newArgs[k]
        }
        // 除去第一位置的&
        string = string.substr(1)

        return string
    }

    /**
    * [sign 生成签名算法]
    * @param  {[type]} ticket [用于签名的凭证 临时票据]
    * @param  {[type]} url    [用于签名的 url,注意必须动态获取,不能hardcode]
    * @return {[type]}        [description]
    */
    sign(ticket, url) {
        // 设置 基本配置
        let ret = {
            jsapi_ticket: ticket,
            nonceStr: this.createNonceStr(),
            timestamp: this.createTimestamp(),
            url: url
        }

        // 初始化  jsSHA的 散列类型
        let shaObj = new jsSHA('SHA-1', 'TEXT')
        // 使用update 进行对象输入
        shaObj.update(this.raw(ret))
        // 得到 签名
        ret.signature = shaObj.getHash('HEX')
        return ret
    }

    /**
     * [jssdk 配置]
     * @param  {[type]} mode        [description]
     * @param  {[type]} appId       [description]
     * @param  {[type]} ticket      [description]
     * @param  {[type]} url         [description]
     * @param  {[type]} successBack [description]
     * @param  {[type]} errorBack   [description]
     * @return {[type]}             [description]
     */
    config(mode, appId, ticket, url, successBack, errorBack) {
        let ret = this.sign(ticket, url)
        wx.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: mode === 'production'
                ? false
                : true,
            // 必填，公众号的唯一标识
            appId: appId,
            // 必填，生成签名的时间戳
            timestamp: ret.timestamp,
            // 必填，生成签名的随机串
            nonceStr: ret.nonceStr,
            // 必填，签名，见附录1
            signature: ret.signature,
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            jsApiList: ['previewImage']
        })
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
        // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
        // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.ready(function() {
            if (typeof successBack === "function") {
                successBack()
            }
        })
         // config信息验证失败会执行error函数，如签名过期导致验证失败，
         // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        wx.error(function(res) {
            if (typeof errorBack === "function") {
                errorBack(res)
            }
        })

    }
}

const jsSdk = new WXSdkConf()

export default jsSdk
