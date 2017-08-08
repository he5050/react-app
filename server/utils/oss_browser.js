/**
 * 浏览器端OSS操作类,限于浏览器端调用
 */
import shortId from "shortid";
import dealWithOSSPath from "../utils/dealwith_oss_path"

class OSSUtil {
    constructor(ossToken, renderType = 'server', mode = 'development', keyId = null) {
        // 默认开发模式
        this.ossCnf = {
            accessKeyId: ossToken.AccessKeyId,
            accessKeySecret: ossToken.AccessKeySecret,
            stsToken: ossToken.SecurityToken,
            ...dealWithOSSPath.getBucketPath(mode)
        }

        this.client = null
        if (renderType === 'client') {
            // 本对象的唯一ID,keyId是服务器端生成的,通过shortId.generate(),再结合客户端生成的,保证唯一性
            if (keyId) {
                this.keyId = `${keyId}_${shortId.generate()}`
            } else {
                this.keyId = shortId.generate()
            }

            // 传输序号
            this.index = 0

            // OSS客户端对象
            this.ossClient = new OSS.Wrapper({
                region: this.ossCnf.region,
                bucket: this.ossCnf.bucket,
                secure: true,
                accessKeyId: this.ossCnf.accessKeyId,
                accessKeySecret: this.ossCnf.accessKeySecret,
                stsToken: this.ossCnf.stsToken
            })
        }
    }

    async uploadFiles(files, uploadDir, suffix = 'jpg', progress, checkpoint) {
        let filePaths = []
        if (this.ossClient == null || !uploadDir) {
            throw new Error('参数异常')
        }

        for (let v of files) {
            let key = `${this.ossCnf.baseDir}/${uploadDir}/${this.keyId}_${this.index}.${suffix}`

            // 传输序号递增
            this.index += 1

            let result
            if (progress) {
                result = await this.ossClient.multipartUpload(key, v, {
                    checkpoint: checkpoint,
                    progress: progress
                })
            } else {
                result = await this.ossClient.multipartUpload(key, v)
            }

            filePaths.push(`${this.ossCnf.hostUrl}/${result.name}`)
        }

        return filePaths
    }

    // 上传图片，文件名随机生成
    async uploadFile(file, uploadDir, suffix = 'jpg', progress, checkpoint) {
        if (this.ossClient == null || !uploadDir) {
            throw new Error('参数异常')
        }

        let key = `${this.ossCnf.baseDir}/${uploadDir}/${this.keyId}_${this.index}.${suffix}`

        // 传输序号递增
        this.index += 1

        let result
        if (progress) {
            result = await this.ossClient.multipartUpload(key, file, {
                checkpoint: checkpoint,
                progress: progress
            })
        } else {
            result = await this.ossClient.multipartUpload(key, file)
        }

        return `${this.ossCnf.hostUrl}/${result.name}`
    }

    // 上传图片，文件名保存不变
    async upWithFileName(file, uploadDir, progress, checkpoint) {
        if (this.ossClient == null || !uploadDir) {
            throw new Error('参数异常')
        }

        let key = `${this.ossCnf.baseDir}/${uploadDir}/${file.name}`

        let result
        if (progress) {
            result = await this.ossClient.multipartUpload(key, file, {
                checkpoint: checkpoint,
                progress: progress
            })
        } else {
            result = await this.ossClient.multipartUpload(key, file)
        }

        return `${this.ossCnf.hostUrl}/${result.name}`
    }

    // 删除单文件(必须是本次上传的文件)
    async deleteFile(path) {
        if (this.ossClient == null) {
            throw new Error('参数异常')
        }

        if (path.indexOf(`${this.keyId}`) > 0) {
            await this.ossClient.delete(path.substr(this.ossCnf.hostUrl.length))
        }
    }

    // 删除多文件(必须是本次上传的文件)
    async deleteFiles(paths) {
        if (this.ossClient == null) {
            throw new Error('参数异常')
        }

        for (let v of paths) {
            if (v.indexOf(`${this.keyId}`) > 0) {
                await this.ossClient.delete(v.substr(this.ossCnf.hostUrl.length))
            }
        }
    }
}

/*
 import OSSUtil from '../../../../until/oss_browser'

 const { ossToken, renderType, mode } = this.props
 let oss = new OSSUtil(ossToken, renderType, mode)

 (e) => {
 let fs = e.target.files||[]
 oss.uploadFile(fs, 'test').then((fs)=>{console.log(fs)}).catch(err=>{console.log(err)})
 }
 * */

export default OSSUtil
