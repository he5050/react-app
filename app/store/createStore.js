/**
 * 创建Store
 */
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";

// 用于开发模式 的日志打印
const logger = store => next => action => {
    console.log('dispatching', action)
    const result = next(action)
    console.log('next state', store.getState())
    return result
}

// 测试 用于捕获异常
const crashReporter = store => next => action => {
    try {
        return next(action);
    } catch (err) {
        console.error('Caught an exception:[', err, ']')
        console.error('Action:[', action, ']')
        console.error('State:[', store.getState(), ']')
        throw err
    }
}

/**
 * 用于合并创建生成一个新手Reducer
 * @param  {Object} reducers [传入多个reducers组成的对象]
 * @return {Object} reducer   [返回一个reducer对象]
 */
const makeRootReducer = (asyncReducers = {}) => {
    // 你可以调用 combineReducers({ todos: myTodosReducer, counter: myCounterReducer }) 将 state 结构变为 { todos, counter }。
    // 就是 State 的属性名必须与子 Reducer 同名 a:reducer  = a.reducer(state.a,action)
    // 主要是用于合并
    return combineReducers({
        ...asyncReducers
    })
}

/**
 * [创建Store]
 * @param  {[type]} params        [服务配置参数]
 * @param  {[type]} initialState  [初始的state]
 * @param  {[type]} asyncReducers [所的reducers]
 * @return {[type]}               [state]
 */
const structureStore = (params, initialState, asyncReducers) => {
    let middleware = [] // 中间件 用于输出
    let enhancers = []  // 第三个参数enhancer, 是一个组合 store creator 的高阶函数，返回一个 新的强化过的 store creator。

    // 如果为开发模式 打印日志与 异常s
    if (params.mode === 'development') {
        middleware.push(logger);
        middleware.push(crashReporter);

        /** Redux DevTools **/
        if (params.renderType === 'client') {
            if (typeof devToolsExtension === 'function') {
                enhancers.push(devToolsExtension())
            }
        }
    }
    // state rethink当中
    middleware.push(thunkMiddleware);

    let store = {}

    // 判断是设置了初始化的state
    // compose 方法主要用于 从右向左组合多个函数, compose(f, g, h)会返回(...args) => f(g(h(...args)))
    // applyMiddleware 调度中间件来增强store，例如中间件redux-thunk等
    if (initialState) {
        store = createStore(makeRootReducer(asyncReducers), initialState, compose(applyMiddleware(...middleware), ...enhancers));
    } else {
        store = createStore(makeRootReducer(asyncReducers), compose(applyMiddleware(...middleware), ...enhancers));
    }

    return store;
};

export default structureStore
