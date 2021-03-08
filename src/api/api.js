import http from "@/utils/http";

// 登录
export function login(params){
    return http.post('/login', params)
}
//获取登录用户信息
export function getUserInfo(params) {
    return http.get('/getUserInfo')
}

//文件上传
export function uploadFile(params){
    const headers = {
        'Content-Type': 'multipart/form-data'
    }
    return http.post('/upload', params, headers)
}

// 汽车操作
export function getCarList(){
    return http.get('/getCarList')
}

export function getCarListByCondition(params){
    return http.post('/getCarListByCondition', params)
}

export function updateCar(params){
    return http.post('/updateCar', params)
}

export function addCar(params){
    return http.post('/addCar', params)
}

export function deleteCar(params) {
    return http.get('deleteCar', params)
}

// 用户操作
export function getUserList(){
    return http.get('/getUserList')
}

export function getUserListByCondition(params){
    return http.post('getUserListByCondition', params)
}

export function addUser(params){
    return http.post('addUser', params)
}

export function updateUser(params){
    return http.post('updateUserInfo', params)
}

export function delUser(params){
    return http.get('delUser', params)
}

//订单

export function getOrderList(params) {
    return http.post('getOrderList', params)
}

export function getOrderDetails(params) {
    return http.post('/getOrderDetails', params)
}

export function updateOrder(params) {
    return http.post('/updateOrder', params)
}
// 门店

export function getStorefrontList(params) {
    return http.post('/getStorefront', params)
}

export function updateStorefront(params) {
    return http.post('/updateStorefront', params)
}

export function addStorefront(params) {
    return http.post('/addStorefront', params)
}

export function deleteStorefront(params) {
    return http.get('/deleteStorefront', params)
}
//检查单

export function addCheckList(params) {
    return http.post('/addCheckList', params)
}

export function getCheckList(params) {
    return http.post('/getCheckList', params)
}

export function getCheckListDto(params) {
    return http.post('/getCheckListDto', params)
}

export function deleteCheckList(params) {
    return http.get('deleteCheckList', params)
}
export function updateCheckList(params) {
    return http.post('updateCheckList', params)
}
//留言
export function getCommentList(){
    return http.get('/queryCommentList')
}

export function deleteComment(params){
    return http.get('/deleteComment', params)
}

export function updateComment(params) {
    return http.post('/updateComment', params)
}
//菜单
export function menu() {
    return http.get('/menu')
}
//统计与分析
export function getRevenue(params) {
    return http.get('/getRevenue', params)
}

export function getUserDistribution(){
    return http.get('/getUserDistribution')
}
