import React from "react";
import {Redirect, Route} from "react-router-dom";

// 用于保存页面位置,详情返回的时候能滚动到那个位置
var scroll = {}

// 定一个滚动组件 用于滚动到上次回转的位置
class ScrollTool extends React.Component {
    componentDidMount() {
        // 主键被加载以后移动到记忆位置
        const {
            pageKey = ''
        } = this.props
        if (scroll[pageKey]) {
            window.scrollTo(scroll[pageKey].pageXOffset, scroll[pageKey].pageYOffset)
        }
    }

    render() {
        return this.props.children
    }

    componentWillUnmount() {
        // 被移除是记住当前的页面位置
        const {
            pageKey = ''
        } = this.props
        scroll[pageKey] = {
            pageXOffset: window.pageXOffset,
            pageYOffset: window.pageYOffset
        }
    }
}

/*
 返回的p说明:
 path: '/demo',// 路由路径
 key: '/demo',// 如果有key,会记录页面位置,回退的时候会滚到记忆位置
 strict: true,// 路由是否是精确匹配,'/aaa/bbb/:id'这样的可以不设置
 render: 组件渲染的高阶函数
 redirect: {// 跳转
 pathname: '/demo',// 跳转路由
 search:'',// 地址请求参数
 state:{},// 页面状态
 }
 * */
const registerRouters = (mb) => {
    return (
        <Route render={({match, location, history}) => {
            let p = mb(match, location, history)
            if (p == null) {
                return
            }
            return (
                <Route
                    strict={p.strict}
                    path={p.path}
                    component={(props) => {
                    if (p.redirect) {
                        /*判断是否为跳转*/
                        return (<Redirect to={{...p.redirect }}/>)
                    } else if (p.key) {
                        /*如果key存在 刚滚动到上次浏览的位置*/
                        return (
                            <ScrollTool pageKey={p.key}>{p.render(props)}</ScrollTool>
                        )
                    }
                    return p.render(props)
                }}>
                </Route>
            )
        }}/>
    )
}

export default registerRouters
