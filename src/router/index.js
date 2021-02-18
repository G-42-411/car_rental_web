import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/page/Login'
import Main from '@/page/Main'

Vue.use(VueRouter)

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
            component: Main
        }
    ]
});
