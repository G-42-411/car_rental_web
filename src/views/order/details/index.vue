<template>
    <div class="box">
        <div class="return" @click="backToOrder()">
            <a-icon class="icon" type="left-circle" :style="{ fontSize: '20px' }" />
            <span class="text">返回</span>
        </div>

        <div class="top">
            <div class="top-header">
                <h3 class="title">{{showStatus}}</h3>
                <span>订单号: {{orderInfo.id}}  <span class="line"></span>  支付方式: 在线支付  <span class="line"></span>  订单创建时间: {{formatTime(orderInfo.createTime)}}</span>
            </div>
            <div class="top-body">
                <div class="infoBox">
                    <div class="info">
                        <h3>客户信息</h3>
                        <span>姓名: {{userInfo.name}}</span>
                        <span>年龄: {{userInfo.age}}</span>
                        <span>性别: {{userInfo.sex == 1 ? '男' : '女'}}</span>
                        <span>手机号: {{userInfo.phone}}</span>
                        <span>身份证号: {{userInfo.idNumber}}</span>
                    </div>
                    <div class="info">
                        <h3>车辆信息</h3>
                        <span>{{carInfo.type}} | {{carInfo.brand}} | {{carInfo.name}}</span>
                        <span>车牌号: {{carInfo.number}}</span>
                        <span>颜色: {{carInfo.colour}}</span>
                        <span>价格: {{carInfo.price}}元</span>
                        <span>租金: {{carInfo.rentPrice}}元</span>
                    </div>
                    <!--            </div>-->

                    <!--            <div class="infoBox">-->
                    <div class="info">
                        <h3>取车</h3>
                        <span>取车门店: {{fromStorefront.name}}</span>
                        <span>取车时间: {{formatTime(orderInfo.startTime)}}</span>
                        <span>取车地点: {{fromStorefront.address}}</span>
                    </div>
                    <div class="info">
                        <h3>还车</h3>
                        <span>还车门店: {{toStorefront.name}}</span>
                        <span>还车时间: {{formatTime(orderInfo.endTime)}}</span>
                        <span>还车地点: {{toStorefront.address}}</span>
                    </div>
                </div>

            </div>
        </div>
        <h3 style="margin: 15px 0 ">费用明细</h3>
        <div class="bottom">
            <div class="cost">
                <span>租金: {{carInfo.rentPrice}}元</span>
                <span class="total">共计: {{totalMoney}}元</span>
            </div>
            <div class="btn-group">
                <div class="btn-item">
                    <label for="operator">操作员: </label>
                    <a-input :disabled="orderInfo.status !== 1" id="operator" style="width: 150px" v-model="orderInfo.acceptionOfficer"/>
                </div>
                <div class="btn-item">
                    <a-button v-if="orderInfo.status === 1" type="primary" @click="confirmOrder">确认订单</a-button>
                </div>
                <div class="btn-item">
                    <a-button v-if="orderInfo.status === 1 || orderInfo.status === 2" type="danger" @click="cancelOrder">取消订单</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getOrderDetails, updateOrder, getOrderList} from '@/api/api'
    import Dateutils from "@/utils/dateutils";

    export default {
        name: "index",
        data() {
            return {
                userInfo: {},
                carInfo: {},
                toStorefront: {},
                fromStorefront: {},
                orderInfo: {},
                payOrderInfo: {}

            }
        },
        methods: {
            formatTime(timestamp) {
                console.log("时间戳")
                console.log(timestamp)
                return Dateutils.formatDate(timestamp)
            },
            queryOrder(data){
                let params = {
                    id: data
                }
                getOrderList(params).then(res => {
                    if (res.status === 200){
                        this.orderInfo = res.data[0]
                        this.queryOrderDetails();
                    }

                })
            },

            queryOrderDetails() {
                getOrderDetails(this.orderInfo).then(res => {
                    if (res.status === 200) {
                        this.userInfo = res.data.userInfo;
                        this.carInfo = res.data.carInfo;
                        this.fromStorefront = res.data.pickUpStorefront;
                        this.toStorefront = res.data.returnStorefront;
                        this.payOrderInfo = res.payOrder;
                    }
                })
            },
            confirmOrder() {
                let params = {
                    id: this.orderInfo.id,
                    acceptionOfficer: this.orderInfo.acceptionOfficer,
                    status: 2
                }
                updateOrder(params).then(res => {
                    if (res.status === 200) {
                        this.$message.success(res.data)
                        // this.$router.push({name:"Order", params:{refresh: true}})
                        this.$router.push({path: "/order"})
                    }
                })
            },
            cancelOrder() {
                let params = {
                    id: this.orderInfo.id,
                    acceptionOfficer: this.orderInfo.acceptionOfficer,
                    status: -1
                }
                updateOrder(params).then(res => {
                    if (res.status === 200) {
                        this.$message.success(res.data)
                        // this.$router.push({name:"Order", params:{refresh: true}})
                        this.$router.push({path: "/order"})
                    }
                })
            },
            backToOrder(){
                this.$router.push({path: "/order"})
            }
        },
        computed: {
            showStatus() {
                const temp = this.orderInfo.status;
                let status = '';
                if (temp === 1) {
                    status = '已下单'
                } else if (temp === 2){
                    status = '待出车'
                } else if(temp === 3){
                    status = '租赁中'
                }else if(temp === 4){
                    status = '已还车'
                }else if(temp === 5){
                    status = '已完成'
                }else {
                    status = '已取消'
                }
                return status
            },
            totalMoney(){
                return 1000
            }

        },
        created() {
            let data = this.$route.params.id;
            this.queryOrder(data);
        }
    }
</script>

<style lang="scss" ref="stylesheet/scss" scoped>
    .box {
        padding: 10px;
        display: flex;
        flex-direction: column;

        .return{
            cursor: pointer;
            width: 80px;
            display: flex;
            align-items: center;
           margin-bottom: 10px;
            .text{
                margin-left: 10px;
                font-size: 18px;
            }
        }

        .top {
            display: flex;
            flex-direction: column;
            border: solid 1px #F0F2F5;

            .top-header {
                border-bottom: solid 1px #F0F2F5;
                padding: 15px;

                h3 {
                    /*margin: 10px 0;*/
                    margin-bottom: 15px;
                }

                span {
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                }

                .line {
                    width: 1px;
                    height: 13px;
                    background-color: #001529;
                    display: inline-block;
                    margin: 0 10px;
                }
            }

            .top-body {
                padding: 15px;
                display: flex;
                flex-direction: column;

                .infoBox {
                    display: flex;

                    .info {
                        display: flex;
                        flex-direction: column;
                        margin-right: 50px;

                        h3 {
                            margin-bottom: 5px;
                        }

                        span {
                            font-size: 14px;
                            display: inline-block;
                            margin-top: 10px;
                        }

                        span:nth-last-child(1) {
                            margin-bottom: 0px;
                        }
                    }
                }


            }
        }

        .bottom {
            display: flex;
            flex-direction: column;
            border: solid 1px #F0F2F5;


            .cost {
                display: flex;
                flex-direction: column;
                border-bottom: solid 1px #F0F2F5;
                padding: 15px;

                span {
                    font-size: 14px;
                    display: inline-block;
                    margin-top: 10px;
                    padding-bottom: 10px;
                    border-bottom: dashed 1px #F0F2F5;
                }

                span:nth-child(1) {
                    margin-top: 0px;
                }

                .total {
                    display: flex;
                    justify-content: flex-end;
                    font-size: 16px;
                    margin-top: 10px;
                    border-bottom: none;
                    padding-bottom: 0px;
                    font-weight: bold;
                }
            }

            .btn-group {
                display: flex;
                align-items: center;
                padding: 10px;

                .btn-item {
                    margin-right: 20px;
                }
            }

        }
    }
</style>
