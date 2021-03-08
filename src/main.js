import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import './assets/style/reset.css'
import Antd from 'ant-design-vue'
import router from './router/index'
import store from '@/store'
import Moment from 'moment'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import utils from "@/utils/utils";
import echarts from 'echarts'
import china from "@/assets/json/china";

Moment.locale('zh-cn');
Vue.prototype.$moment = Moment

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(mavonEditor)
window.addEventListener('popstate', function() {
    history.pushState(null, null, document.URL)
})

router.beforeEach((to, from, next) => {
        utils.initAdminMenu(router, store)
        next()
    }
);


new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
