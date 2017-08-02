// 本文件为常量文件

// 前缀
const APPPrefix = {
    Seesion: 'app_'
}

// 列表列类型
const TabColumnType = {
    Normal: 1, // 正常
    Search: 2, // 搜索
    DropDown: 3, // 下拉
    Picture: 4, // 图片
}

// 操作类型
const OperateType = {
    LIST: 0, // 列表
    DETAILS: 1, // 详情
    ADD: 2, // 新增
    DELETE: 3, // 删除
    UPDATE: 4, // 修改
    REFRESH: 5, // 刷新
}

// 用户类型
const UserType = {
    ADMIN: 1, // 系统
}

// 微信用户关注状态
const WxSubscribeState = {
    None: -1, // 错误
    Not: 0,  // 没有关注
    Is: 1   // 关注
}
export {APPPrefix, UserType, TabColumnType, OperateType, WxSubscribeState}
