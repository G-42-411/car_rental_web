import http from "@/utils/http";
import request from "@/utils/request";
import utils from "@/utils/utils";

// 登录
export function login(params){
    if (utils.isNotEmpty(params)){
        const config = {
            method: 'post',
            url: '/login',
            params: params
        }
        return request(config)
    }
    return null
}

