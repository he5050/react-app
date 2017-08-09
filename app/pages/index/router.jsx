import React from "react"
import {Provider} from "react-redux"
import {BrowserRouter, Route, StaticRouter} from "react-router-dom
 import registerRouters from "../common/register_router.jsx"
import structureStore from "../../store/createStore"
import {UserType} from "../../utils/code_def"

import Home from "./components/home/home"
import Login from "./components/login/login.jsx"
import loginReducer from "./modules/login"

import Register from "./components/register/register.jsx"
import regReducer from "./modules/register"

const routeNodes = (params, initState, l, c) => {
    let ctx = {}
    ctx.store = structureStore(params, initState, {
        params: () => params,
        login: loginReducer,
        register: regReducer
    })

    // 路由
    let routes = registerRouters((match, location, history) => {
        switch (location.pathname) {
            case '/':
                {
                    return {
                        path: '/', // 路由路径
                        strict: true, // 路由是否是精确匹配,'/**/**/:id'这样的可以不设置
                        render: (props) => (
                            <Home {...params} {...props}>
                                {props.children}
                            </Home>
                        )
                    }
                }
            case '/login':
                {
                    return {
                        path: '/login', // 路由路径
                        strict: true, // 路由是否是精确匹配,'/**/**/:id'这样的可以不设置
                        render: (props) => (
                            <Login {...params} {...props}>
                                {props.children}
                            </Login>
                        )
                    }
                }
            case '/register':
                {
                    return {
                        path: '/', // 路由路径
                        strict: true, // 路由是否是精确匹配,'/**/**/:id'这样的可以不设置
                        render: (props) => (
                            <Home {...params} {...props}>
                                {props.children}
                            </Home>
                        )
                    }
                }
            default:
                { // 可以定义一个404公用页面返回
                    return {
                        redirect: { // 跳转
                            pathname: '/', // 跳转路由
                            search: '', // 地址请求参数
                            state: {}, // 页面状态
                        }
                    }
                }
        }
    })

    if (params.renderType === 'client') {
        // 客户端渲染模型
        ctx.render = (
            <Provider store={ctx.store}>
                <BrowserRouter>
                    {routes}
                </BrowserRouter>
            </Provider>
        )
    } else {
        // 服务器渲染模型
        ctx.render = (
            <Provider store={ctx.store}>
                <StaticRouter
                    location={l}
                    context={c}>{routes}
                </StaticRouter>
            </Provider>
        )
    }

    return ctx
}

export default routeNodes
