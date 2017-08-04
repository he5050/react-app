import _ from "lodash";
import crypto from "crypto";
import moment from "moment";

// 设置本地时区
moment.locale('zh-cn');

// 定义基础字符串
const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

class Util {
    // 标识符
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
        return 'APP'
    }

    // 使用crypto当中的md5对密码进行加密
    md5(password) {
        let md5 = crypto.createHash('md5')
        let salt = '(!%$88hs@gogoapp*)#appb9'
        let newPwd = md5.update(password + salt).digest('hex') // 返回16进度的密码
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

    // 构建查询
    /**
       例如url为: /sample
       传入的参数为: {id:123,typeId:2343}
       /sample?id=123&typeId=2343
   **/
    buildQueryUrl(url, params) {
        let paramsUrl = url
        if (_.size(params) > 0 && paramsUrl) {
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

    /**
     * 解析特定格式下的锚点，如(#key=value&key2=value2)
     * */
    parseAnchor() {
        let url
        if (typeof window !== 'undefined') {
            url = window.location.hash // 获取锚点
        }
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

    // 验证值
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

    isTel(mobile) {
        return /^1[3|4|5|6|7|8][0-9]\d{8}$/.test(mobile)
    }

    isPhone(match) {
        if (!match) {
            return false;
        }
        let phone = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|170)\d{8}$/;
        if (phone.test(match)) {
            return true;
        }
        return false;
    }
    // 判断是否为中文
    isChinese(match) {
        let zhcn = /^[\u4E00-\u9FA5]+$/gi; //fixed |[\uFE30-\uFFA0]
        if (!zhcn.exec(match)) {
            return false;
        }
        return true;
    }
    // 判断 是否为数字
    isNumber(match) {
        /*
       let num = /^[1-9]+[0-9]*]*$/ ;//合法的数学数字不能以0开头
       if (num.test(match)) {
       return true;
       }
       return false;
       */
        //
        return !isNaN(parseFloat(match)) && isFinite(match);
    }
    // 判断是否为qq号
    isQQ(match) {
        let QQ = /^[1-9]\d{3,9}\d$/;
        if (QQ.test(match)) {
            return true;
        }
        return false;
    }
    // 判断是否为全法的域名地址
    isUrl(match) {
        let Url = /^http[s]?:\/\/(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*\'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/\?)|(\/[0-9a-zA-Z_!~\*\'\(\)\.;\?:@&=\+\$,%#-\/]*)?)$/i;
        if (Url.test(match)) {
            return true;
        }
        return false;
    }
    /*===检测传入的字符串是否是合法密码格式===*/
    //该检测方式仅检测传入的字符串即包含字母也包含数字的形式
    isPassWord(match) {
        let pcre = /[A-Za-z]+/,
            num = /\d+/;
        if (pcre.test(match)) {
            if (num.test(match)) {
                return true;
            }
            return false;
        }
        return false;
    }
    /*===检测传入的字符串是否是全部由字母构成===*/
    isAlphabet(match) {
        let pcre = /^[A-Za-z]+$/;
        if (pcre.test(match)) {
            return true;
        }
        return false;
    }
    /*===检测传入的字符串是否是天朝身份证号码===*/
    isCardID(match) {
        let id = match.toUpperCase(); //18位身份证中的x为大写
        id = this.trimAll(match); //去除字符中的所有空格
        let ID18 = /^\d{17}(\d|X)$/,
            ID15 = /^\d{15}$/,
            oCity = {
                11: "\u5317\u4eac",
                12: "\u5929\u6d25",
                13: "\u6cb3\u5317",
                14: "\u5c71\u897f",
                15: "\u5185\u8499\u53e4",
                21: "\u8fbd\u5b81",
                22: "\u5409\u6797",
                23: "\u9ed1\u9f99\u6c5f",
                31: "\u4e0a\u6d77",
                32: "\u6c5f\u82cf",
                33: "\u6d59\u6c5f",
                34: "\u5b89\u5fbd",
                35: "\u798f\u5efa",
                36: "\u6c5f\u897f",
                37: "\u5c71\u4e1c",
                41: "\u6cb3\u5357",
                42: "\u6e56\u5317",
                43: "\u6e56\u5357",
                44: "\u5e7f\u4e1c",
                45: "\u5e7f\u897f",
                46: "\u6d77\u5357",
                50: "\u91cd\u5e86",
                51: "\u56db\u5ddd",
                52: "\u8d35\u5dde",
                53: "\u4e91\u5357",
                54: "\u897f\u85cf",
                61: "\u9655\u897f",
                62: "\u7518\u8083",
                63: "\u9752\u6d77",
                64: "\u5b81\u590f",
                65: "\u65b0\u7586",
                71: "\u53f0\u6e7e",
                81: "\u9999\u6e2f",
                82: "\u6fb3\u95e8",
                91: "\u56fd\u5916"
            };
        //{11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
        if (!(ID18.test(id) || ID15.test(id))) {
            return false;
        } //不符合基本的身份证号码规则
        function _15to18(cardNumber) {
            //15位转换为18位 数据库统一保存18位数字身份证
            let CardNo17 = cardNumber.substr(0, 6) + '19' + cardNumber.substr(6, 9);
            let Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
            let Ai = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            let cardNoSum = 0;

            for (let i = 0; i < CardNo17.length; i++) {
                cardNoSum += CardNo17.charAt(i) * Wi[i];
            }
            let seq = cardNoSum % 11;
            return CardNo17 + '' + Ai[seq];
        }
        function CheckValidCode(carNumber) {
            //效验第18位字符的合法性
            let CardNo17 = carNumber.substr(0, 17); //去除18位id中的最后一位进行运算后对比
            let Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
            let Ai = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            let cardNoSum = 0;
            for (let i = 0; i < CardNo17.length; i++) {
                cardNoSum += CardNo17.charAt(i) * Wi[i];
            }
            let seq = cardNoSum % 11;
            if (Ai[seq] != carNumber.substr(17, 1)) {
                return false;
            }
            return true;
        }
        //输入的18位效验码合法性检测
        if (ID18.test(id)) {
            if (!CheckValidCode(id)) {
                return false;
            }
        } //输入的18位身份证号  先效验其标准编码合法性
        if (ID15.test(id)) {
            id = _15to18(id);
        } //将15位转换为18位 == 唯一对应
        //使用处理并转换完毕的18位身份证数字进行统一效验
        let City = id.substr(0, 2),
            BirthYear = id.substr(6, 4),
            BirthMonth = id.substr(10, 2),
            BirthDay = id.substr(12, 2),
            StrData = id.substr(6, 8), //形如19881101类型的出生日期表示法
            Sex = id.charAt(16) % 2, //男1 女0
            Sexcn = Sex
                ? '男'
                : '女';
        //地域验证
        if (oCity[parseInt(City)] == null) {
            return false;
        }
        //出生日期验证
        let BirthObj = StrData.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);
        if (BirthObj == null) {
            return false;
        } //出生日期基本的组合规则不符合要求
        let d = new Date(BirthObj[1], BirthObj[2] - 1, BirthObj[3]); //效验出生日期的数字年份是否符合要求
        if (d.getFullYear() == BirthObj[1] && (d.getMonth() + 1) == BirthObj[2] && d.getDate() == BirthObj[3]) {
            return {
                'ID': id,
                'Y': BirthYear,
                'm': BirthMonth,
                'd': BirthDay,
                'YmdNumber': Number(StrData),
                'YmdString': BirthYear + '-' + BirthMonth + '-' + BirthDay,
                'sexInt': Sex,
                'sexCn': Sexcn,
                'local': oCity[parseInt(City)]
            }
        }
        return false;
    }

    // 产生随即数
    rand(min, max) {
        let params = {
            min: min || 0,
            max: max || 9999999
        };
        let Range = params.max - params.min;
        let Rand = Math.random();
        return (params.min + Math.round(Rand * Range));
    }
    /*===产生随机字符串[去除易混淆的0、1、I、l、L、O、o]===*/
    randString(length) {
        let lens = length || 16;
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = chars.length;
        let strings = '';
        for (i = 0; i < lens; i++) {
            strings += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return strings;
    }
    // 除掉空白
    trimAll(strings) {
        if (!strings) {
            return false;
        }
        strings.replace(/(^\s+)|(\s+$)/g, "");
        return strings.replace(/\s/g, "");
    }
    // 判断是否为邮箱
    isMail(match) {
        if (!match) {
            return false;
        }
        var mail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (mail.test(match)) {
            var maiarr = match.split(/@/);
            var mailobj = { //返回用户名与域名部分组成的数组 boolean判断时为真
                'name': maiarr[0],
                'domain': maiarr[1]
            };
            return mailobj;
        }
        return false;
    };
}

const util = new Util()

export default util
