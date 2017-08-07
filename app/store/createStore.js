/**
 * 创建Store
 */
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

// 用于开发模式 的日志打印
const logger = store => next => action => {
  console.log('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception:[', err, ']');
    console.error('Action:[', action, ']');
    console.error('State:[', store.getState(), ']');
    throw err;
  }
};

const makeRootReducer = (asyncReducers = {}) => {
  return combineReducers({ ...asyncReducers })
}

const structureStore = (params, initialState, asyncReducers) => {
  let middleware = [];
  let enhancers = [];

  if (params.mode === 'development') {
    //middleware.push(logger);
    middleware.push(crashReporter);

    /** Redux DevTools **/
    if (params.renderType === 'client') {
      if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
      }
    }
  }
  middleware.push(thunkMiddleware);

  let store
  if (initialState) {
    store = createStore(
      makeRootReducer(asyncReducers),
      initialState,
      compose(
        applyMiddleware(...middleware),
        ...enhancers
      )
    );
  } else {
    store = createStore(
      makeRootReducer(asyncReducers),
      compose(
        applyMiddleware(...middleware),
        ...enhancers
      )
    );
  }

  return store;
};

export default structureStore
