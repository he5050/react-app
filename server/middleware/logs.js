/*
 * log存储中间件
 */
import fs from "fs"
import logUtil from "../const/log_utils.js"
import logConfig from "../config/log_config.js"

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
const confirmPath = (pathStr) => {

    if (!fs.existsSync(pathStr)) {
        fs.mkdirSync(pathStr)
        console.log('createPath: ' + pathStr)
    }
}

/**
 * 初始化log相关目录
 */
const initLogPath = function() {
    //创建log的根目录'logs'
    if (logConfig.baseLogPath) {
        confirmPath(logConfig.baseLogPath)
        //根据不同的logType创建不同的文件目录
        for (let i = 0, len = logConfig.appenders.length; i < len; i++) {
            if (logConfig.appenders[i].path) {
                confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path)
            }
        }
    }
}

export default((app) => {
    app.use(async(ctx, next) {
        initLogPath()
        // 响应开始时间
        const startTime = new Date()
        // 响应间隔时间
        let ms = 0
        try {
            // 开始进入到下一个中间件
            await next()
            ms = new Date() - startTime
            // 记录响应日志
            logUtil.logResponse(ctx, ms)
        } catch (e) {
            ms = new Date() - startTime
            //记录异常日志
            logUtil.logError(ctx, e, ms)
        }
    })
})
