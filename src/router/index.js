import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index'
import Main from '@/views/main/index'
import CarInfo from '@/views/car/info'
import UserInfo from '@/views/user/info'
import Order from '@/views/order'
import OrderDetails from '@/views/order/details'
import CarRentOut from '@/views/car/rentout'
import CarRentOutDetails from '@/views/car/rentout/details'
import CarReturn from '@/views/car/return'
import CarReturnDetails from '@/views/car/return/details'
import CheckList from '@/views/checkList/info'
import Storefront from '@/views/storefront'
import Comment from '@/views/comment'


Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',

    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/main',
            name: 'Main',
            component: Main,
        }
    ],
    scrollBehavior: () => {
        history.pushState(null, null, document.URL)
    }
});
