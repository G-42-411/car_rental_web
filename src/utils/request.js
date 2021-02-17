import axios from "axios"
import Cookie from 'js-cookie'
import utils from "@/utils/utils";

const request = axios.create({
    baseURL: '/api',
    timeout: 3 * 1000
})

/**
 * 请求拦截
 */
request.interceptors.request.use(config => {
    let token = Cookie.get('token')
    if (utils.isNotEmpty(token)) {
        token = 'Bearer ' + token
        config.headers.Authorization = token
    }
    config.headers = {
        'Content-Type': 'application/json',
    }
    return config
}, (err) => {
    return Promise.reject(err)
})

/**
 * 响应拦截
 */
request.interceptors.response.use( res => {
    //res.data才是返回的数据
    return res.data
}, (err) => {
    return Promise.resolve(err.response)
})

export default request
