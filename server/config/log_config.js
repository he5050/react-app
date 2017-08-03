// 本文件用于定义日志输出文件

import Path from "path"

// 日志文件根目录
const baseLogPath = path.resolve(__dirname, '../logs')

// 错误日志目录
const errorPath = '/error'
// 错误日志文件名
const errorFileName = 'error'
// 错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName
// const errorLogPath = path.resolve(__dirname, '../logs/error/error')

//响应日志目录
const responsePath = "/response";
//响应日志文件名
const responseFileName = "response";
//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// const responseLogPath = path.resolve(__dirname, '../logs/response/response')

config = {
    // 设置 日志文件的配置
    appenders: [
        // 错误日志
        {
            category: 'errolrLogger', // logger名称
            type: 'dateFile', // 日志类型
            filename: errorLogPath, // 日志文件输出位置
            alwaysIncludePattern: true, //是否总是有后缀名
            pattern: "-yyyy-MM-dd-hh.log" //后缀，每小时创建一个新的日志文件
        },
        //响应日志
        {
            "category": "resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd-hh.log"
        }

    ],
    //设置logger名称对应的的日志等级
    "levels": {
        "errorLogger": "ERROR",
        "resLogger": "ALL"
    }
}
module.exports = config
