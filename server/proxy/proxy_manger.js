// 代理 为了解决跨域问题
import http from 'http'
import https from 'https'
import config from '../config'

export default class ProxyManger {
    construct() {
        console.log('进入ProxyManger')
    }

    static getInstance() {
        if (this.Instance == null) {
            this.Instance = new ProxyManger();
        }
        return this.Instance;
    }
    // post 方法
    Post(path, body, user) {
        return new Promise((resolve, reject) => {
            let data = {
                success: false,
                message: '',
                data: [],
                code: 404,
                count: 0
            }
            let bodyString = new Buffer(JSON.stringify(body))
            // 请求头
            let headers = {
                'Content-Type': 'application/json',
                'Content-Length': bodyString.length
            }
            if (user) {
                headers['Login-User'] = encodeURIComponent(JSON.stringify(user))
            }
            // 配置请求配置项目
            let options = {
                path: path,
                method: 'POST',
                headers: headers,
                host: config.api_host,
                port: config.api_port
            }
            let req = http.request(options, (res) => {
                res.setEncoding('utf8') // 设置编码格式
                let chunks = ''
                res.on('data', (chunk) => {
                    chunks += chunk
                })
                res.on('end', () => {
                    if (res.statusCode != 200) {
                        data.message = '服务器响应异常'
                        data.code = res.statusCode
                        resolve(data)
                    } else {
                        if (chunks === '') {
                            data.message = '服务器异常'
                            data.code = res.statusCode
                            resolve(data)
                        } else {
                            try {
                                let json = JSON.parse(chunks)
                                resolve(json)
                            } catch (e) {
                                data.message = '数据请求异常'
                                data.code = res.statusCode
                                resolve(data)
                            }
                        }
                    }
                })
                res.on('error', (e) => {
                    data.message = e.message
                    data.code = 404
                    resolve(data)
                })
            })
            // 设置请求超时30秒
            req.setTimeout(30000);
            req.on('error', (e) => {
                if (req.res && req.res.abort && (typeof req.res.abort === 'function')) {
                    req.res.abort();
                }
                req.abort();
                data.message = '服务器错误';
                data.code = 404;
                resolve(data);
            }).on('timeout', (e) => {
                if (req.res && req.res.abort && (typeof req.res.abort === 'function')) {
                    req.res.abort();
                }
                req.abort();
                data.message = 'request timeout';
                data.code = 404;
                resolve(data);
            });

            req.write(bodyString);
            req.end();
        })
    }
    Get(path, user) {
        return new Promise((resolve, reject) => {
            let data = {
                success: false,
                message: "",
                data: [],
                code: 404,
                count: 0
            };

            let headers = {
                'Content-Type': 'application/json'
            };
            if (user) {
                headers['Login-User'] = encodeURIComponent(JSON.stringify(user))
            }

            let options = {
                path: path,
                method: "GET",
                headers: headers,
                host: config.api_host,
                port: config.api_port
            };

            let req = http.request(options, (res) => {
                res.setEncoding('utf8');
                let chunks = "";
                res.on('data', (chunk) => {
                    chunks += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode != 200) {
                        data.message = '服务器应答异常';
                        data.code = res.statusCode;
                        resolve(data)
                    } else {
                        if (chunks === "") {
                            data.message = '服务器异常';
                            data.code = res.statusCode;
                            resolve(data)
                        } else {
                            try {
                                let json = JSON.parse(chunks);
                                resolve(json);
                            } catch (e) {
                                data.message = '数据请求异常';
                                data.code = res.statusCode;
                                resolve(data);
                            }
                        }
                    }
                });
                res.on('error', (e) => {
                    data.message = e.message;
                    data.code = 404;
                    resolve(data);
                });
            });

            // 设置请求超时30秒
            req.setTimeout(30000);

            req.on('error', (e) => {
                if (req.res && req.res.abort && (typeof req.res.abort === 'function')) {
                    req.res.abort();
                }
                req.abort();
                data.message = '服务器错误';
                data.code = 404;
                resolve(data);
            }).on('timeout', (e) => {
                if (req.res && req.res.abort && (typeof req.res.abort === 'function')) {
                    req.res.abort();
                }
                req.abort();
                data.message = 'request timeout';
                data.code = 404;
                resolve(data);
            });

            req.end();
        })
    }
    HttpsGet(options, cb) {
        let data = {
            success: false,
            message: "",
            data: [],
            code: 404,
            count: 0
        };

        let req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let chunks = "";
            res.on('data', (chunk) => {
                chunks += chunk;
            });
            res.on('end', () => {
                if (res.statusCode != 200) {
                    data.message = '服务器应答异常';
                    data.code = res.statusCode;
                    cb(null, data)
                } else {
                    if (chunks === "") {
                        data.message = '服务器异常';
                        data.code = res.statusCode;
                        cb(null, data)
                    } else {
                        try {
                            let json = JSON.parse(chunks);
                            cb(null, json);
                        } catch (e) {
                            data.message = '数据请求异常';
                            data.code = res.statusCode;
                            cb(null, data);
                        }
                    }
                }
            });
            res.on('error', (e) => {
                data.message = e.message;
                data.code = 404;
                cb(null, data);
            });
        });

        // 设置请求超时30秒
        req.setTimeout(30000);

        req.on('error', (e) => {
            if (req.res && req.res.abort && (typeof req.res.abort === 'function')) {
                req.res.abort();
            }
            req.abort();
            data.message = '服务器错误';
            data.code = 404;
            cb(null, data);
        }).on('timeout', (e) => {
            if (req.res && req.res.abort && (typeof req.res.abort === 'function')) {
                req.res.abort();
            }
            req.abort();
            data.message = 'request timeout';
            data.code = 404;
            cb(null, data);
        });

        req.end();
    }
}
