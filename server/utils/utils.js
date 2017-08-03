/**
 * Created by chenjianjun on 16/6/21.
 */
import _ from "lodash";
import crypto from "crypto";
import moment from "moment";
moment.locale('zh-cn');

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

class Util {
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0
            let v = c == 'x'
                ? r
                : (r & 0x3 | 0x8)
            return v.toString(16)
        }).toUpperCase()
    }

    getKey() {
        return 'SAAS-SYS'
    }

    md5(password) {
        let md5 = crypto.createHash('md5')
        let salt = '(!%$88hs@gophs*)#sassb9'
        let newPwd = md5.update(password + salt).digest('hex')
        return newPwd
    }

    base64encode(str) {
        let out,
            i,
            len;
        let c1,
            c2,
            c3;
        i = 0;
        out = "";

        len = str.length;
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                //out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                //out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }

    buildQueryUrl(url, params) {
        let paramsUrl = url
        if (_.size(params) > 0 && paramsUrl) {
            /**
       例如url为: /sample
       传入的参数为: {id:123,typeId:2343}
       /sample?id=123&typeId=2343
       **/
            paramsUrl += '?';
            let first = true;
            _.each(params, (v, k) => {
                if (v !== undefined) {
                    if (first) {
                        paramsUrl += k + '=' + v;
                        first = false;
                    } else {
                        paramsUrl += '&' + k + '=' + v;
                    }
                }
            })
        }
        return paramsUrl
    }

    parseAnchor() {
        let url

        if (typeof window !== 'undefined') {
            url = window.location.hash
        }

        /**
     * 解析特定格式下的锚点，如(#key=value&key2=value2)
     * */
        if (url && url.length > 0) {
            let params = {}

            let attrs = url.substring(1).split('&')
            for (let v of attrs) {
                let keyAndValue = v.split('=')
                if (keyAndValue.length === 2) {
                    params[keyAndValue[0]] = keyAndValue[1]
                }
            }

            return params
        }

        return undefined
    }

    // 解析请求参数 类似: ?key=value&key2=value2
    parseSearch(search) {
        let params = {}

        if (search && search.length > 0) {
            let attrs = search.substring(1).split('&')
            for (let v of attrs) {
                let keyAndValue = v.split('=')
                if (keyAndValue.length === 2) {
                    params[keyAndValue[0]] = keyAndValue[1]
                }
            }
        }

        return params
    }

    utilValidate(value) {
        let flag = false;
        if (value != null && value !== '' && value != undefined) {
            flag = true;
        }
        return flag;
    }

    nowDate() {
        return new Date().getTime()
    }

    now() {
        return moment().format('YYYY-MM-DD HH:mm:ss')
    }

    //日期对象转换字符串日期
    dateConvertString(date) {
        return moment(date).format('YYYY-MM-DD')
    }

    //字符串日期转换日期对象
    stringConvertDate(stringDate) {
        return moment(stringDate, 'YYYY-MM-DD')
    }

    timestampConvertString(timestamp) {
        return this.dateConvertString(new Date(timestamp))
    }

    isPhoto(mobile) {
        return /^1[3|4|5|6|7|8][0-9]\d{8}$/.test(mobile)
    }
}

const util = new Util()

export default util
