/**
 * 设置 缓存
 * @param {[type]} key    [缓存k键]
 * @param {[type]} value  [缓存的值]
 * @param {[type]} expire [缓存时间]
 */
const set = (key, value, expire) => {
    let _cache = this.cache
    // 如果已经存在该值,则重新赋值
    if (_cache[key]) {
        // 重新赋值
        _cache[key].value = value
        _cache[key].expire = expire
    } else {
        // 不存在 就是插入新值
        _cache[key] = {
            value: value,
            expire: expire, // 有效期
            insertTime: + new Date() // 日期对象转成数字
        }
    }
}

// 获取缓存
const get = (key) => {
    let _cache = this.cache
    //如果存在该值
    if (_cache[key]) {
        let insertTime = _cache[key].insertTime
        let expire = _cache[key].expire
        let curTime = +new Date() // 当前时间

        // 如果不存在过期时间 或者 存在过期时间但尚未过期
        if (!expire || (expire && curTime - insertTime < expire)) {
            return _cache[key].value;
        } else if (expire && curTime - insertTime > expire) {
            // 如果已经过期
            _cache[key] = null
            return null
        }
    } else {
        return null
    }
}

// 清空cache
const clear = () => {
    this.cache = {}
}

// 导出
const createCache = () => {
    return {cache: {}, set: set, get: get, clear: clear}
}

exports.createCache = createCache
