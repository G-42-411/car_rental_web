import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../page/Login'

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
        }
    ]
});
