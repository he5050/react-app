// 用于获取微信jsdk
var jsSHA = require("jssha")

class WXSdkConf {
    /*
   * 生成签名的随机串
   * */
    createNonceStr() {
        return Math.random().toString(36).substr(2, 15)
    }

    /*
   * 生成签名的时间戳
   * */
    createTimestamp() {
        return parseInt(new Date().getTime() / 1000) + ''
    }

    /*
   * 对所有待签名参数按照字段名的ASCII码从小到大排序(字典序)后，使用URL键值对的格式(即key1=value1&key2=value2…)拼接成字符串string
   * */
    raw(args) {
        let keys = Object.keys(args).sort()
        let newArgs = {}
        keys.forEach(function(key) {
            newArgs[key.toLowerCase()] = args[key]
        })

        let string = ''
        for (let k in newArgs) {
            string += '&' + k + '=' + newArgs[k]
        }
        string = string.substr(1)

        return string
    }

    /**
   * @synopsis 签名算法
   *
   * @param ticket 用于签名的凭证
   * @param url 用于签名的 url,注意必须动态获取,不能hardcode
   *
   * @returns
   */
    sign(ticket, url) {
        let ret = {
            jsapi_ticket: ticket,
            nonceStr: this.createNonceStr(),
            timestamp: this.createTimestamp(),
            url: url
        }

        let shaObj = new jsSHA('SHA-1', 'TEXT');
        shaObj.update(this.raw(ret))
        ret.signature = shaObj.getHash('HEX')
        return ret
    }

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

        wx.ready(function() {
            if (typeof successBack === "function") {
                successBack()
            }
        })

        wx.error(function(res) {
            if (typeof errorBack === "function") {
                errorBack(res)
            }
        })

    }
}

/*
 wxConfig() {
 const { mode, wxAppId, wxTicket } = this.props
 jsSdk.config(
 mode,
 wxAppId,
 wxTicket,
 location.href.split('#')[ 0 ],
 () => {},
 (res) => {
 this.props.initError(JSON.stringify(res))
 }
 )
 }
* */

const jsSdk = new WXSdkConf()

export default jsSdk
