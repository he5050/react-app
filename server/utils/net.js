import fetch from "isomorphic-fetch";

const Method = {
    GET: 'GET',
    POST: 'POST'
}
// net 请求
export class NetApi {
    post(url, body, callback) {
        // Fetch 请求默认是不带 cookie 的，需要设置 fetch(url, {credentials: 'include'})
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')

        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            // include:表示可以跨域传递cookie same-origin:表示只能同源传递cookie
            credentials: 'same-origin',
            mode: 'cors',
            cache: 'default'
        }
        return fetch(url, init).then(res => res.json()).then(j => {
            if (!j.success && j.code === 302) {
                window.location.href = j.data[0]
            } else {
                callback(null, j)
            }
        }).catch(err => {
            callback(err.message)
        })
    }

    get(url, callback) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const init = {
            method: 'GET',
            headers,
            // include:表示可以跨域传递cookie same-origin:表示只能同源传递cookie
            credentials: 'same-origin',
            mode: 'cors',
            cache: 'default'
        };
        return fetch(url, init).then(res => res.json()).then(j => {
            if (!j.success && j.code === 302) {
                window.location.href = j.data[0]
            } else {
                callback(null, j)
            }
        }).catch(err => {
            callback(err.message)
        })
    }
}

const netApi = new NetApi()

export {netApi as default, Method}
