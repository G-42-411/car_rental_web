import request from "@/utils/request"
import utils from "@/utils/utils";


const defaultHeaders = {
    'Content-Type': 'application/json'
}

const http = {
    get(url, params, headers) {
        const config = {
            method: 'get',
            url: url
        }
        if (utils.isNotEmpty(params)) {
            config.params = params
        }
        // if (utils.isNotEmpty(headers)) {
        //     config.headers = headers
        // } else {
        //     config.headers = defaultHeaders
        // }
        return request(config)
    },
    post(url, params, headers) {
        const config = {
            method: 'post',
            url: url
        }
        if (utils.isNotEmpty(params)) {
            config.data = params
        }
        if (utils.isNotEmpty(headers)) {
            config.headers = headers
        } else {
            config.headers = defaultHeaders
        }
        return request(config)
    }
}

export default http
