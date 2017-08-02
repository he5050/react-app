import cache from './cache'

export default class CacheManger {
    construct() {
        // 初始化缓存对象
        this.myCahce = cache.createCache()
    }
    // 定义 单例创建
    static Instance() {
        if (this.instance == null) {
            // 创建 单例
            this.instance = new CacheManger()
        }
        return this.instance
    }
    // 从缓存取值
    get(key) {
        return this.myCahce.get(key)
    }
    // 写入缓存
    set(key, value, tiemOut) {
        this.myCahce.set(key, value, tiemOut)
    }
    // 清空缓存
    clear() {
        this.myCahce.clear()
    }
}
