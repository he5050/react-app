/**
 * 浏览器端OSS操作类,限于浏览器端调用
 */
import shortId from "shortid"
import dealWithOSSPath from "./dealwith_oss_path"

class OSSUtil {
    constructor(ossToken, renderType = 'server', mode = 'development', keyId = null) {
        // 默认开发模式 配置oss
        this.ossCnf = {
            accessKeyId: ossToken.AccessKeyId,
            accessKeySecret: ossToken.AccessKeySecret,
            stsToken: ossToken.SecurityToken,
            ...dealWithOSSPath.getBucketPath(mode) // 获取配置文件
        }

        this.client = null
        // 判断为哪个端口
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

    /**
     * [批量图片上传]
     * @param  {[type]}  files          [文件]
     * @param  {[type]}  uploadDir      [上传路径]
     * @param  {String}  [suffix='jpg'] [文件名后缀]
     * @param  {Function}  progress       [上传进度]
     * @param  {Object}  checkpoint     [分片上传用于保存上传进度]
     */
    async uploadFiles(files, uploadDir, suffix = 'jpg', progress, checkpoint) {
        // 用于存放 文件上传之后 返回的路径
        let filePaths = []
        // 判断 客户端 状态  以及上传路径
        if (this.ossClient == null || !uploadDir) {
            throw new Error('参数异常')
        }
        // 定义每个文件的上传地址以及文件名
        for (let v of files) {
            let key = `${this.ossCnf.baseDir}/${uploadDir}/${this.keyId}_${this.index}.${suffix}`

            // 传输序号递增
            this.index += 1

            let result
            // 是否需要上传进度 使用分片上传
            if (progress) {
                result = await this.ossClient.multipartUpload(key, v, {
                    checkpoint: checkpoint,
                    progress: progress
                })
            } else {
                result = await this.ossClient.multipartUpload(key, v)
            }
            // 保存上传成功后的路径
            filePaths.push(`${this.ossCnf.hostUrl}/${result.name}`)
        }

        return filePaths
    }

    /**
     * [uploadFile 批量图片上传]
     * @param  {[type]}  file           [上传文件]
     * @param  {[type]}  uploadDir      [文件路径]
     * @param  {String}  [suffix='jpg'] [文件类型]
     * @param  {Function}  progress       [上传进度]
     * @param  {Object}  checkpoint     [分片上传用于保存上传进度]
     */
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

export default OSSUtil
