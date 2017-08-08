/*
 * @file 首页的入口文件
 */
import React from "react"
import ReactDOM from "react-dom"
import _ from "lodash"
import routeNodes from "./router.jsx"
import Compatibility from "../../../server/utils/compatibility"

// 处理兼容性
Compatibility()

// 传递给客户端的初始状态值 用于seo优化
//  默认获取 获取初始化的值
let initStateString = document.getElementById('J_Server').attributes['data-init-state'].nodeValue || '{}'
let initState = JSON.parse(decodeURIComponent(initStateString)) // 转成json 对象
let params = initState.params
console.log('当前页面的parmas: ',params)
params.renderType = 'client'

// 删除 initState 中的params
let ctx = routeNodes(params, _.omit(initState, 'params'))
ReactDOM.render(ctx.render, document.getElementById('J_Client'))
