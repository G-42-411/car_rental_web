<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
            <div class="logo">
            </div>
            <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
                <a-sub-menu v-for="(item, i) in menus" :key="i">
                    <span slot="title"><a-icon :type="item.iconCls"/><span>{{item.nameZh}}</span></span>

                    <a-menu-item @click="goto(child.path)" v-for="(child, j) in item.children" :key=" '' + i +j " v-if="child.mate.show === 1">
                        <a-icon :type="child.iconCls"/>
                        <span>{{child.nameZh}}</span>
                    </a-menu-item>
                </a-sub-menu>
            </a-menu>


        </a-layout-sider>
        <a-layout>
            <a-layout-header class="header" style="background: #fff; padding: 0">
                <a-icon class="trigger"
                        :type="menuFold"
                        @click="toZoom"/>

                <div class="user-info">
                    <a-avatar class="user-avatar" :src="$store.state.userInfo.avatar"/>
                    <span class="user-name">{{$store.state.userInfo.name}}</span>
                    <span class="len">|</span>
                    <span class="sign-out" @click="signOut">退出</span>
                </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
                <router-view/>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
    import {getUserInfo} from "@/api/api";
    import Cookie from 'js-cookie'
    export default {
        name: 'App',
        data() {
            return {
                collapsed: false,
            };
        },
        methods: {
            toZoom() {
                return this.collapsed = !this.collapsed;
            },
            goto(url){
                this.$router.push({path: url})
            },
            signOut(){
                Cookie.remove('token');
                this.$router.push({path: '/login'})
            }
        },
        computed: {
            menuFold() {
                return this.collapsed ? 'menu-unfold' : 'menu-fold';
            },
            menus() {
                return this.$store.state.menus
            },
            currentPath() {
                return this.$route.path
            }

        },
        components: {},
        created: function () {
            getUserInfo(this.$store.state.userInfo.username).then(res => {
                this.$store.commit('setUserInfo', res.data.user)
                this.$store.commit('setAuthorities', res.data.authorities)
            })
        }

    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    a {
        margin: 0;
        color: rgba(255, 255, 255, 0.65);
    }

    #components-layout-demo-custom-trigger {
        height: 100vh;

        .trigger {
            font-size: 18px;
            line-height: 64px;
            padding: 0 24px;
            cursor: pointer;
            transition: color 0.3s;
        }

        .trigger:hover {
            color: #1890ff;
        }

        .logo {
            height: 32px;
            background: rgba(255, 255, 255, 0.2);
            margin: 16px;
        }

        .header {
            position: relative;
            display: flex;
            align-items: center;

            .user-info {
                display: flex;
                align-items: center;
                position: absolute;
                right: 20px;

                .user-avatar {

                }

                .user-name {
                    margin-left: 10px;
                }
                .len{
                    margin: 0 10px;
                }
                .sign-out{
                    cursor: pointer;
                }
            }
        }

    }


</style>
