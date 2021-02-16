import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main'
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
            path: '/main',
            name: 'main',
            component: Main
        }
    ]
});
