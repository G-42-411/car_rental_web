<template>
    <div class="container">
        <div class="box">
            <h1 class="title">汽车租赁后台管理系统</h1>
            <div class="box-item">
                <a-input class="item-input" placeholder="Account" :maxLength="12" v-model="username"/>
            </div>
            <div class="box-item">
                <a-input-password class="item-input" placeholder="Password" :maxLength="12" v-model="password"/>
            </div>
            <a-button class="btn" type="primary" @click="toLogin">sign in</a-button>
        </div>
    </div>
</template>

<script>
    import utils from "@/utils/utils";
    import {login} from "@/api/api";
    import Cookie from 'js-cookie'

    export default {
        name: "Login",
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            toLogin() {
                if (!this.checkContent()) {
                    return;
                }
                console.log("成功")
                login({
                    username: this.username,
                    password: this.password
                }).then(res => {
                    let token = res.data.token
                    Cookie.set('token', token)
                }).catch(err => {

                })

            },
            checkContent() {
                let flag = true
                if (utils.isEmpty(this.username)) {
                    this.$message.error('请输入账号')
                    flag = false
                }
                if (utils.isEmpty(this.password)) {
                    this.$message.error('请输入密码')
                    flag = false
                }
                return flag
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #334960;

        .box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 450px;
            width: 400px;
            padding: 25px;
            border: solid 1px #a1cae2;
            border-radius: 10px;
            box-sizing: border-box;

            .title {
                text-align: center;
                color: #ffffff;
                margin-bottom: 20px;
            }

            .box-item {
                margin-top: 35px;

                .item-input {
                    width: 240px;
                    margin: 5px;
                }
            }

            .btn {
                margin-top: 40px;
                width: 200px;
                height: 35px;
            }
        }
    }


</style>
