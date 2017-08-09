import React from "react"
import {fromJS, is} from "immutable"
import _ from 'lodash'
import {Button, Modal, notification, Icon} from "antd"
import {OperateType} from "../../server/const/const"

/**
 * [打印]
 * @param  {[String]} componentName [组件名称]
 * @return {[type]} result       [返回一个新组件]
 */
function warLog(componentName) {
    return function(target, name, descriptor) {
        const fn = descriptor.value

        descriptor.value = function() {
            let result = fn.apply(this, arguments)
            if (result) {
                console.log(`注意:组件[${componentName}]出现更新`)
            }
            return result
        }
    }
}

/**
 * [BaseComponent 所的的组件都继承于这个组件]
 * @param {String} [name='未知'] [创建的组件的名称]
 */
const BaseComponent = (name = '未知') => class extends React.Component {
    @warLog(name)
    // 断组件是否应该重新渲染，默认是true 判断下一次传进来的 数据是否为空
    shouldComponentUpdate(nextProps, nextState) {
        // 比对 当前的props  state 与下次传入进行的nextProps nextSate 进行比较如果 fromJs 主是用于生成不可以变更的数据对像,然后用is来判断是否相同
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState)) || !_.isEmpty(nextProps)
    }

    //componentWillReceiveProps(nextProps) {
    //}

    //// 在完成首次渲染之前调用，此时仍可以修改组件的state
    //componentWillMount() {}
    //
    //// 接收到新的props或者state后，进行渲染之前调用，此时不允许更新props或state
    //componentWillUpdate() {}
    //
    //// 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素
    //componentDidUpdate() {}
    //
    //// 组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
    //componentWillUnmount() {}
}

/**
 * [BaseListPageComponent 列表组件]
 * @param {String} [name='未知'] [生成的列组件]
 */
export const BaseListPageComponent = (name = '未知') => class extends React.Component {
    @warLog(name)
    // 判断组件是否重新渲染
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    // 组件重新渲染完成
    componentDidUpdate() {
        this.showHint()
    }
    // 关闭当前页 回去上一页
    pageClose() {
        this.props.history.goBack()
    }
    // 关闭提示框的 方法
    onErrConfirm = () => {
        // 判断是否存在
        if (this.props.detailsErrConfirm) {
            this.props.detailsErrConfirm()
        }
    }
    // 显示 警告信息
    showHint() {
        const {
            fetchFlg = false, // 判断是否加载完成 主要用于spin 组建的使用
            errMsg = ''
        } = this.props.list
        // 如果查询完成 则直接返回 跳出
        if (fetchFlg) {
            return
        }
        // 如果查询出错
        if (errMsg.length > 0) {
            // 弹出提醒框
            notification.error({
                message: '错误提示',
                description: errMsg,
                icon: <Icon type="frown-o" style={{color: '#ff2741'}}/>,
                onClose: this.onErrConfirm,
                duration: 3 // antd 默认设置为4.5秒 这里设置 为3秒
            })
        }
    }
    /**
     * [onTableFilterChange description]
     * @param  {Object} pagination [分页的]
     * @param  {String} filters    [查询的内容]
     * @param  {[type]} sorter     [排序]
     * @return {[type]}            [description]
     */
    onTableFilterChange = (pagination, filters, sorter) => {
        // 获取当前的页码
        let p = {
            pageIndex: pagination.current
        }

        _.map(filters, (v, k) => {
            p[k] = v[0]
        })

        // 查询列表
        this.props.fetchList(p)
    }

    onOperateAction(pathname, operateType, record) {
        switch (operateType) {
            case OperateType.ADD:
                {
                    let navigate = {
                        pathname: pathname,
                        state: {
                            operateType: operateType
                        }
                    }
                    this.props.history.push(navigate)
                    break
                }
            case OperateType.AUTH:
            case OperateType.DETAILS:
            case OperateType.UPDATE:
                {
                    let navigate = {
                        pathname: pathname,
                        state: {
                            id: record.id,
                            operateType: operateType
                        }
                    }
                    this.props.history.push(navigate)
                    break
                }
            case OperateType.DELETE:
                {
                    Modal.confirm({
                        title: '确认操作',
                        content: `确认删除ID为${record.id}的记录?`,
                        onOk: () => {
                            this.props.fetchDelete({id: record.id})
                        },
                        onCancel: () => {}
                    })
                    break
                }
            case OperateType.REFRESH:
                { // 刷新
                    this.props.fetchListRefresh()
                    break
                }
        }
    }
}

export const BaseDetailsPageComponent = (name = '未知') => class extends React.Component {
    @warLog(name)
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    componentDidMount() {
        let {operateType, id} = this.props.location.state
        if (operateType !== OperateType.ADD) {
            this.props.fetchDetails({id: id})
        } else {
            this.props.clearDetails()
        }
    }

    pageInit(title, uploadDir) {
        const {ossToken, renderType, mode} = this.props.params
        let operateType
        if (renderType === 'server') {
            operateType = -1
        } else {
            operateType = this.props.location.state.operateType
        }
        switch (operateType) {
            case OperateType.ADD:
                {
                    this.readOnly = false
                    this.pageTitle = `新增${title}`
                    break
                }
            case OperateType.UPDATE:
                {
                    this.readOnly = false
                    this.pageTitle = `修改${title}`
                    break
                }
            case OperateType.DETAILS:
                {
                    this.readOnly = true
                    this.pageTitle = `${title}详情`
                    break
                }
            case OperateType.AUTH:
                {
                    this.readOnly = false
                    this.pageTitle = `${title}审核`
                    break
                }
            default:
                {
                    return false
                }
        }

        this.formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 14
            }
        }

        this.detailImageProps = {
            ossToken,
            renderType,
            mode,
            uploadDir: uploadDir,
            readOnly: this.readOnly
        }
        this.detailVideoProps = {
            ossToken,
            renderType,
            mode,
            uploadDir: uploadDir,
            readOnly: this.readOnly,
            maxNum: 1
        }
        this.coverImageProps = {
            ossToken,
            renderType,
            mode,
            uploadDir: uploadDir,
            readOnly: this.readOnly
        }

        this.formImageListLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 4
                }
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 20
                }
            }
        }

        return true
    }

    componentDidUpdate() {
        this.showHint()
    }

    operateExtra = () => {
        return (
            <Button.Group>
                <Button icon="close" onClick={(e) => this.pageClose(e)}>关闭</Button>
                {!this.readOnly && <Button type="primary" icon="check" onClick={(e) => this.onSave(e)}>保存</Button>
}
            </Button.Group>
        )
    }

    checkCoverUrl = (rule, value, callback) => {
        if (value.length > 0) {
            callback()
            return
        }
        callback('封面不能为空');
    }

    checkVideoUrl = (rule, value, callback) => {
        if (value.length > 0) {
            callback()
            return
        }
        callback('视频不能为空');
    }

    checkImageDetails = (rule, value, callback) => {
        if (value.length > 0) {
            callback()
            return
        }
        callback('详情不能为空')
    }

    checkVideoDetails = (rule, value, callback) => {
        if (value.length > 0) {
            callback()
            return
        }
        callback('详情不能为空')
    }

    checkMealDetails = (rule, value, callback) => {
        if (value.length > 0) {
            callback()
            return
        }
        callback('请选择菜品')
    }

    pageClose() {
        this.props.history.goBack()
    }

    onErrConfirm = () => {
        if (this.props.detailsErrConfirm) {
            this.props.detailsErrConfirm()
        }
    }

    showHint() {
        const {
            postFlg = false,
            fetchFlg = false,
            errMsg = ''
        } = this.props.details
        if (fetchFlg) {
            return
        }

        // 提交相关操作
        if (postFlg) {
            const {operateType} = this.props.location.state
            if (errMsg.length > 0) {
                if (operateType === OperateType.ADD) {
                    // 新增失败
                    notification.error({message: '新增失败', description: errMsg, onClose: this.onErrConfirm})
                } else if (operateType === OperateType.AUTH) {
                    // 认证失败
                    notification.error({message: '提交审核结果', description: errMsg, onClose: this.onErrConfirm})
                } else {
                    // 修改失败
                    notification.error({message: '修改失败', description: errMsg, onClose: this.onErrConfirm})
                }
            } else {
                if (operateType === OperateType.ADD) {
                    // 新增成功
                    Modal.success({
                        title: '成功',
                        content: '新增成功',
                        okText: '确定',
                        onOk: () => {
                            this.pageClose()
                        }
                    })
                } else if (operateType === OperateType.AUTH) {
                    // 认证成功
                    Modal.success({
                        title: '成功',
                        content: '提交审核结果',
                        okText: '确定',
                        onOk: () => {
                            this.pageClose()
                        }
                    })
                } else {
                    // 修改成功
                    Modal.success({
                        title: '成功',
                        content: '修改成功',
                        okText: '确定',
                        onOk: () => {
                            this.pageClose()
                        }
                    })
                }
            }
        } else { // 加载
            if (errMsg.length > 0) {
                // 加载失败
                notification.error({message: '加载失败', description: errMsg, onClose: this.onErrConfirm})
            }
        }
    }
}

export default BaseComponent
