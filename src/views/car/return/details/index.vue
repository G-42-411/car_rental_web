<template>
    <div class="container">
        <div class="return" @click="backToOrder()">
            <a-icon class="icon" type="left-circle" :style="{ fontSize: '20px' }" />
            <span class="text">返回</span>
        </div>
        <div class="top">
            <div class="input-group">
                <div class="input-item">
                    <span>检查单号:</span>
                    <div class="input">
                        <a-input v-model="options.number"/>
                    </div>
                </div>
                <div class="input-item">
                    <span>出租单号:</span>
                    <div class="input" >
                        <a-input v-model="orderInfo.number" :disabled="true"/>
                    </div>
                </div>
                <div class="input-item">
                    <span>检查员:</span>
                    <div class="input">
                        <a-input v-model="options.operator"/>
                    </div>
                </div>
                <div class="input-item">
                    <span>存在的问题:</span>
                    <div class="input">
                        <a-input v-model="options.question"/>
                    </div>
                </div>
                <div class="input-item">
                    <span>赔付金额:</span>
                    <div class="input">
                        <a-input v-model="options.compensationAmount"/>
                    </div>
                </div>
                <div class="input-item">
                    <span>检查时间:</span>
                    <div class="input">
                        <a-date-picker @change="dateChange" v-model="options.createTime"/>
                    </div>
                </div>
            </div>

            <div class="textarea" width="100%">
                <span>问题描述:</span>
                <div style="width: 100%">
                    <a-textarea
                            id="description"
                            placeholder="Controlled autosize"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                            v-model="options.description"
                    />
                </div>
            </div>
            <a-button @click="save" class="save" type="primary" style="width: 120px; margin: auto">保存</a-button>
        </div>

        <div class="bottom">
            <div class="item">
                <span class="title">车辆信息</span>
                <span>车牌号: {{carInfo.number}}</span>
                <span>车辆类型: {{carInfo.type}}</span>
                <span>车辆品牌: {{carInfo.brand + carInfo.name}}</span>
                <span>车辆颜色: {{carInfo.colour}}</span>
                <span>购买价格: {{carInfo.price}}</span>
                <span>车辆租金: {{carInfo.rentPrice}}</span>
            </div>
            <div class="item">
                <span class="title">出租单信息</span>
                <span>出租单号: {{orderInfo.number}}</span>
                <span>创建时间: {{formatTime(orderInfo.createTime)}}</span>
                <span>起租时间: {{formatTime(orderInfo.startTime)}}</span>
                <span>结束时间: {{formatTime(orderInfo.endTime)}}</span>
                <span>订单状态: {{showStatus}}</span>
                <span>办理人员: {{orderInfo.acceptionOfficer}}</span>
            </div>
            <div class="item">
                <span class="title">客户信息</span>
                <span>客户姓名: {{userInfo.name}}</span>
                <span>客户年龄: {{userInfo.age}}</span>
                <span>客户性别: {{userInfo.sex}}</span>
                <span>手机号码: {{userInfo.phone}}</span>
                <span>身份证号: {{userInfo.idNumber}}</span>
                <span>客户住址: {{userInfo.address}}</span>
            </div>
        </div>

    </div>
</template>

<script>
    import Dateutils from "@/utils/dateutils";
    import {getOrderDetails, getOrderList, updateOrder, addCheckList} from "@/api/api";

    export default {
        name: "index",
        data(){
            return {
                userInfo: {},
                carInfo: {},
                toStorefront: {},
                fromStorefront: {},
                orderInfo: {},
                payOrderInfo: {},
                options: {
                    number: '',
                    createTime: '2021-02-29 22:51:30',
                    question: '',
                    description: '',
                    compensationAmount: '',
                    orderNumber: '',
                    operator: '',
                }
            }
        },
        methods: {
            formatTime(timestamp) {
                return Dateutils.formatDate(timestamp)
            },
            queryOrder(data){
                let params = {
                    id: data
                };
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
            updateOrderStatus() {
                let params = {
                    id: this.orderInfo.id,
                    acceptionOfficer: this.orderInfo.acceptionOfficer,
                    status: 4
                }
                updateOrder(params).then(res => {
                    if (res.status === 200) {
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
            dateChange(date, dateString){
                console.log(dateString)
            },
            save(){
                this.options.orderNumber = this.orderInfo.number;
                addCheckList(this.options).then(res => {
                    console.log(res)
                    if (res.status === 200){
                        this.$message.success("车辆入库成功");
                        this.updateOrderStatus()
                    }
                })

            },
            backToOrder(){
                this.$router.push({path: "/carReturn"})
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
            nowDate(){
                return new Date.now().toString()
            }

        },
        created() {
            let data = this.$route.params.id;
            this.queryOrder(data);
            this.options.createTime = this.$moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        }
    }
</script>

<style lang="scss" ref="stylesheet/scss" scoped>
    .container {
        padding: 0 10px;
        font-size: 14px;
        display: flex;
        flex-direction: column;

        .return{
            cursor: pointer;
            width: 80px;
            display: flex;
            align-items: center;
            /*margin-bottom: 10px;*/
            .text{
                margin-left: 10px;
                font-size: 18px;
            }
        }

        .top {
            display: flex;
            flex-direction: column;

            .input-group {
                display: flex;
                flex-wrap: wrap;

                .input-item {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    width: 270px;
                    margin: 10px;

                    span {
                        display: inline-block;
                        text-align: right;
                        font-size: 14px;
                    }

                    .input {
                        margin-left: 10px;
                        width: 170px;
                    }
                }
            }

            .textarea {
                margin: 10px 40px;

                span {
                    display: inline-block;
                    margin-bottom: 10px;
                }
            }
        }

        .bottom {
            margin-top: 10px;
            display: flex;
            justify-content: space-around;
            background-color: #F0F2F5;
            padding: 10px;
            .item {
                padding: 5px;
                display: flex;
                flex-direction: column;
                background-color: #FFFFFF;
                flex: 1;
                box-sizing: border-box;
                margin-left: 10px;

                span {
                    display: inline-block;
                    margin: 10px 0;
                }

                .title {
                    border-bottom: solid 1px #F0F2F5;
                    padding: 10px 0px;
                }
            }
            .item:nth-child(1){
                margin-left: 0;
            }
        }
    }
</style>
