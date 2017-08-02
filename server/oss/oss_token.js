/**
 * 获取oss token
 */
import ALY from "aliyun-sdk";
import CacheManger from "../cache/cache_manger";
import config from '../config/index'

class OSSTokenApi {

    static Instance() {
        if (this.instance == null) {
            // 创建单例
            this.instance = new OSSTokenApi()
        }
        return this.instance
    }

    constructor() {
        // 通过 https://github.com/aliyun-UED/oss-js-upload 生成的accessKeyId,secretAccessKey,roleARN
        // 生成用户,为用户选择角色,生成成功的时候回自动生成一个文件,里面就有accessKeyId,secretAccessKey  roleARN是在角色管理里面查看
        this.sts = new ALY.STS({
            accessKeyId: config.aliyun_accessKeyId,
            secretAccessKey: config.aliyun_secretAccessKey,
            endpoint: config.aliyun_endpoint,
            apiVersion: config.aliyun_apiVersion
        })
    }

    // 获取token
    getToken() {
        return new Promise((resolve, reject) => {
            // 先判断缓存是否已存在ossToken
            let token = CacheManger.Instance().get('ossToken')
            // 如果存在
            if (token !== null) {
                let res = {
                    success: true,
                    message: '',
                    count: 1
                }
                res.data = [
                    {
                        ...token.Credentials
                    }
                ]
                resolve(res);
            } else {
                this.sts.assumeRole({
                    // 指定角色的资源描述符；每个角色都有一个唯一的资源描述符(Arn)，您可以在RAM的角色管理中查看一个角色的Arn
                    RoleArn: 'acs:ram::1712472832694546:role/wh-oss-role',
                    // 此参数用来区分不同的Token，以标明谁在使用此Token，便于审计;
                    RoleSessionName: 'wh-oss-role',
                    // 过期时间,秒
                    DurationSeconds: 3600
                }, (err, data) => {
                    let res = {
                        success: true,
                        message: '',
                        count: 1
                    }
                    if (err) {
                        res.success = false
                        res.data = [{}]
                    } else {
                        CacheManger.Instance().set('ossToken', data, 3600 * 50) // 设置缓存超时为50分钟
                        res.data = [
                            {
                                ...data.Credentials
                            }
                        ]
                    }
                    resolve(res);
                })
            }
        })
    }
}

export default OSSTokenApi
