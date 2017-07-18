import cache from './cache'

export default class CacheManger{
    construct(){
        this.myCahce = cache.createCache()
    }
    static Instance(){
        if(this.instance == null){
            // 创建 单例
            this.instance = new CacheManger()
        }
        return this.instance
    }

    get(key){
        return this.myCahce.get(key)
    }
    set(key,value,tiemOut){
        this.myCahce.set(key,value,tiemOut)
    }
    clear(){
        this.myCahce.clear()
    }
}
