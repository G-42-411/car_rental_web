<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
            <div class="logo">
            </div>
            <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
                <a-sub-menu key="1">
                    <span slot="title"><a-icon type="user" /><span>人员</span></span>
                    <a-menu-item key="11">
                        <a-icon type="car"/>
                        <span>人员信息</span>
                    </a-menu-item>
                    <a-menu-item key="12">
                        <a-icon type="car"/>
                        <span>人员管理</span>
                    </a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="2">
                    <span slot="title"><a-icon type="car" /><span>车辆</span></span>
                    <a-menu-item key="21">
                        <a-icon type="car"/>
                        <span>车辆信息</span>
                    </a-menu-item>
                    <a-menu-item key="22">
                        <a-icon type="car"/>
                        <span>出车</span>
                    </a-menu-item>
                    <a-menu-item key="23">
                        <a-icon type="car"/>
                        <span>还车</span>
                    </a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="3">
                    <span slot="title"><a-icon type="solution" /><span>订单</span></span>
                    <a-menu-item key="31">
                        <a-icon type="car"/>
                        <span>订单详情</span>
                    </a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="4">
                    <span slot="title"><a-icon type="solution" /><span>门店</span></span>
                    <a-menu-item key="41">
                        <a-icon type="car"/>
                        <span>门店列表</span>
                    </a-menu-item>
                    <a-menu-item key="42">
                        <a-icon type="car"/>
                        <span>新增门店</span>
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
                    <a-avatar class="user-avatar" icon="user"/>
                    <span class="user-name">成语利息</span>
                </div>

            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
                Content
                <router-link to="/main">Main</router-link>
                <router-view/>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>

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
            }
        },
        computed: {
            menuFold() {
                return this.collapsed ? 'menu-unfold' : 'menu-fold';
            }
        },
        components: {}
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
            }
        }

    }


</style>
