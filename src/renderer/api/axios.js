import Vue from 'vue'
import Axios from 'axios'
import request from './api';
const axios = Axios.create({
    timeout: 60000 * 3,
    withCredentials: false
})



// todo 全局监管请求生命周期,以namespace处理,需要改造axios


export function init() {
    axios.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        // 网络错误,4xx,5xx,统一转化为resolve为对应format{code,errmsg}
        const st = error.response.status
        if (st >= 400 && st < 599) {
            error.response.dataOrigin = error.response.data
            error.response.data = {
                'code': -99999,
                'message': `status error: ${st}`,
                'result': null
            }
            return Promise.resolve(error.response)
        } else {
            return Promise.reject(error)
        }
    });

    axios.defaults.baseURL = 'http://localhost:3000'
}

/**
 *
 * @param {*String} url api地址
 * @param {*Object} params   参数
 */


export function AxiosPlugin(Vue, options) {
    Vue.prototype.$http = axios
    Vue.prototype.$ajaxGet = ajaxGet;
    Vue.prototype.$ajaxPost = ajaxPost;
    Vue.prototype.$ajaxDelete = ajaxDelete;
}


export  const ajaxGet = function (url, params = {}) {
    let requ = request
    return new Promise((resolve, reject) => {
        axios.get(requ[url],{
            params: params
        }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}
// vue.prototype
/**
 *
 * @param {*String} url api地址
 * @param {*Object} params   参数
 */
export const ajaxPost = function ajaxPost(url, params = {},suffix = '1') {
    let requ = request;
    return new Promise((resolve, reject) => {
        axios.post(requ[url],params).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err);
        });
    })
}
/**
 *
 * @param {*String} url api地址
 * @param {*Object} params   参数
 */
export const ajaxDelete = function ajaxDelete(url, params = {},suffix = '1') {
    let requ = request;
    return new Promise((resolve, reject) => {
        axios.delete(requ[url],{
            params: params
        }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    })
}

export default axios
