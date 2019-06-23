import axios from 'axios';
import request from './api';

axios.defaults.timeout = 8000;
axios.defaults.baseURL = "http://localhost:3000"; //http://123.207.114.48:86
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
/**
 * 请求配置
 */
axios.interceptors.request.use(
        config => {
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
            return config;
        },
        err => {
            return Promise.reject(err);
        }
    )
    /**
     * 请求拦截
     */
axios.interceptors.response.use(
    response => {
        console.log(response)
        if (response.data.code == 400) {
            // Vue.$Message.error('操作失败')
            return response.data;
        } else if (response.data.code == 501) {
            
        } else
            return response.data;
    },
    err => {
        console.log(err)
        return Promise.reject(err.response.data);
    }
)

/**
 *
 * @param {*String} url api地址
 * @param {*Object} params   参数
 */

export function ajaxGet(url, params = {}) {
    return new Promise((resolve, reject) => {

        axios.get(request[url], {
            params: params
        }).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err);
        })
    })
}

/**
 *
 * @param {*String} url api地址
 * @param {*Object} params   参数
 */
export function ajaxPost(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: request[url],
            data: params,
            transformRequest: [function(data) {
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                }
                return ret;
            }]
        }).then(response => {
            resolve(response);
        }).catch(err => {

            reject(err);
        });
    })
}
export default {
    axios
}