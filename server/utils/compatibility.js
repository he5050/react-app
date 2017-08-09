// 兼容性处理
import Promise from "promise-polyfill";

const Compatibility = () => {
    // 判断是否存在Promise 对象
    if (!window.Promise) {
        window.Promise = Promise;
    }

    // 兼容URL的获取
    window.URL = window.URL || window.webkitURL

    // 判断String 是否 存在startsWith 与endsWith 这两个方法 如果存在就自己添加这两个方法
    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function(prefix) {
            return this.slice(0, prefix.length) === prefix;
        }
    }

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        }
    }
}

export default Compatibility
