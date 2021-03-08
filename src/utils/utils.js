import {menu} from '@/api/api'

//判断是否为空
const isEmpty = (s) => {
    return s === '' || s == null || typeof (s) == 'undefined';
};
const isNotEmpty = (s) => {
    return !isEmpty(s)
};

const formatRoutes = (routes) => {
    let fmtRoutes = []
    routes.forEach(route => {
        if (route.children) {
            route.children = formatRoutes(route.children)
        }

        let fmtRoute = {
            path: route.path,
            component: resolve => {
                require(['@/views/' + route.component + '/index.vue'], resolve)
            },
            name: route.name,
            nameZh: route.nameZh,
            iconCls: route.iconCls,
            children: route.children,
            mate: {
                show: route.show
            }
        }
        fmtRoutes.push(fmtRoute)
    })
    return fmtRoutes
}

const initAdminMenu = (router, store) => {
    if (store.state.menus.length > 0) {
        return
    }
    menu().then(res => {
        if (res && res.status === 200) {
            let fmtRoutes = formatRoutes(res.data);
            console.log("fmtRoutes:",fmtRoutes)
            router.addRoutes(fmtRoutes);
            console.log("addRoutes:",router)
            store.commit('initAdminMenu', fmtRoutes)
        }
    })
};



export default {
    isEmpty,
    isNotEmpty,
    initAdminMenu
}



