import http from "@/utils/http";
import utils from "@/utils/utils";

// 登录
export function login(params){
    return http.post('/login', params)
}

export function getUserInfo() {
    return http.get('/getUserInfo')
}

