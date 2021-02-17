import request from "@/utils/request"
import utils from "@/utils/utils";

const http = {
    get(url, params) {
        const config = {
            method: 'get',
            url: url
        }
        if (utils.isNotEmpty(params)) {
            config.data = params
        }
        return request(config)
    },
    post(url, params) {
        const config = {
            method: 'post',
            url: url
        }
        if (utils.isNotEmpty(params)) {
            config.data = params
        }
        return request(config)
    }
}

export default http
