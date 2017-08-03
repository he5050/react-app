import config from "../../server/config";
import util from "./util"

const ossUrl = 'jsbn-image.oss-cn-shenzhen.aliyuncs.com'
const OssConfig = {
    region: 'oss-cn-shenzhen',
    bucket: 'jsbn-image',
    bucketTest: 'test-image',
    hostUrl: '//' + ossUrl,
    baseDir: 'app'
}
// 小图标样式
export const thumb120 = '?x-oss-process=image/resize,m_fill,w_120,limit_0/auto-orient,0/quality,q_90'
// PC端图片处理,等比例缩放,固定宽度高度自适应,不做图片锐化处理(/sharpen,200)
export const sPCSrc = `?x-oss-process=image/resize,m_lfit,w_1200,limit_1/auto-orient,0`
// 移动端图片处理,等比例缩放,固定宽度高度自适应,不做图片锐化处理(/sharpen,200)
export const sMSrc = `?x-oss-process=image/resize,m_lfit,w_600,limit_1/auto-orient,0`

class DealWithOSSPath {
    // 获取bucket path
    getBucketPath(mode = config.env) {
        let ossCnf = {}
        if (mode === 'production') { // 产品模式
            ossCnf.region = OssConfig.region
            ossCnf.bucket = OssConfig.bucket
            ossCnf.hostUrl = OssConfig.hostUrl
            ossCnf.baseDir = OssConfig.baseDir
        } else { // 开发模式
            ossCnf.region = OssConfig.region
            ossCnf.bucket = OssConfig.bucketTest
            ossCnf.hostUrl = OssConfig.hostUrl
            ossCnf.baseDir = OssConfig.baseDir
        }
        return ossCnf
    }

    // 处理路径
    dealWithURL(path) {
        if (path.indexOf(ossUrl) > 0) {
            path = path.replace(/jsbn-image.oss-cn-shenzhen.aliyuncs.com/g, 'image.jsbn.com')
        } else if (path.indexOf('test-jsbn.oss-cn-shenzhen.aliyuncs.com') > 0) {
            path = path.replace(/test-jsbn.oss-cn-shenzhen.aliyuncs.com/g, 'testimg.jsbn.com')
        }

        if (!path.startsWith('http:')) {
            path = 'http:' + path
        }

        return path
    }

    // 获取水印
    getWatermark() {
        switch (config.platform) { // platform:平台 1:芭菲婚礼 2:金色百年 3:CMS 4:捷拍
            case 1:
                {
                    return '/watermark,image_YmZfd2hfc3kucG5n,t_80,g_se,y_15,x_15'
                }
            case 2:
                {
                    return '/watermark,image_c2h1aXlpbi5wbmc,t_50,g_center,y_10,x_10'
                }
            case 4:
                {
                    return '/watermark,image_amllcGFpX3N5LnBuZw,t_50,g_se,y_10,x_10'
                }
            default:
                {
                    return ''
                }
        }
    }

    // 根据图片路径获取水印，当前图片会作为水印图片
    getWatermarkWithPath(path) {
        let ct = path.match(/\.com\/(\S*)/)
        if (ct) {
            return `/watermark,image_${util.base64encode(ct[1])},t_50,g_se,y_10,x_10`
        }

        // 获取一个默认的水印
        return '/watermark,image_amllcGFpX3N5LnBuZw,t_50,g_se,y_10,x_10'
    }

    // 等比例缩放: 固定高度，宽度自适应
    dealWith_Gd_H_W(height, quality = 100) {
        let imageOption = ''
        if (height === '100%') {
            imageOption = `?x-oss-process=image/auto-orient,0`
        } else {
            imageOption = `?x-oss-process=image/resize,m_lfit,h_${height},limit_0/auto-orient,0`
        }

        if (quality < 100) {
            imageOption += `/quality,q_${quality}`
        }
        return imageOption
    }

    // 等比例缩放: 固定宽度，高度自适应
    dealWith_GD_W_H(width, quality = 100) {
        let imageOption = ''
        if (width === '100%') {
            imageOption = `?x-oss-process=image/auto-orient,0`
        } else {
            imageOption = `?x-oss-process=image/resize,m_lfit,w_${width},limit_0/auto-orient,0`
        }

        if (quality < 100) {
            imageOption += `/quality,q_${quality}`
        }
        return imageOption
    }

    // 等比例缩放: 限定宽高，按长边缩放
    dealWith_GD_HW_L(width, height, quality = 100) {
        let imageOption = ''
        if (height !== '100%' && width !== '100%') {
            imageOption = `?x-oss-process=image/resize,m_lfit,w_${width},h_${height},limit_0/auto-orient,0`
        } else {
            imageOption = `?x-oss-process=image/auto-orient,0`
        }

        if (quality < 100) {
            imageOption += `/quality,q_${quality}`
        }
        return imageOption
    }

    // 等比例缩放: 限定宽高，按短边缩放
    dealWith_GD_HW_S(width, height, quality = 100) {
        let imageOption = ''
        if (height !== '100%' && width !== '100%') {
            imageOption = `?x-oss-process=image/resize,m_mfit,w_${width},h_${height},limit_0/auto-orient,0`
        } else {
            imageOption = `?x-oss-process=image/auto-orient,0`
        }

        if (quality < 100) {
            imageOption += `/quality,q_${quality}`
        }
        return imageOption
    }

    // 限定宽高: 按长边缩放，缩略填充
    dealWith_GD_L_S(width, height, quality = 100) {
        let imageOption = ''
        if (height !== '100%' && width !== '100%') {
            imageOption = `?x-oss-process=image/resize,m_pad,w_${width},h_${height},limit_0/auto-orient,0`
        } else {
            imageOption = `?x-oss-process=image/auto-orient,0`
        }

        if (quality < 100) {
            imageOption += `/quality,q_${quality}`
        }
        return imageOption
    }

    // 限定宽高: 按短边缩放，居中裁剪
    dealWith_GD_S_S(width, height, quality = 100) {
        let imageOption = ''
        if (height !== '100%' && width !== '100%') {
            imageOption = `?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0/auto-orient,0`
        } else {
            imageOption = `?x-oss-process=image/auto-orient,0`
        }

        if (quality < 100) {
            imageOption += `/quality,q_${quality}`
        }
        return imageOption
    }

}

const dealWithOSSPath = new DealWithOSSPath()

export default dealWithOSSPath
