<template>
    <div>
        <div class="options">
            <div class="input-len">
                <label for="number">订单号:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="number" v-model="options.number"/>
                </div>
            </div>
            <div class="input-len" style="width: 460px">
                <label for="time">下单时间:</label>
                <div class="timeSelect" id="time">
                    <a-date-picker @change="startTimeChange" v-model="options.startTime"/>
                    <span style="margin: 0 5px">至</span>
                    <a-date-picker @change="endTimeChange" v-model="options.endTime"/>
                </div>
            </div>


            <div class="btn_group">
                <a-button type="primary" @click="queryInfo()">
                    查询
                </a-button>
                <a-button type="danger" @click="resetInfo()">
                    重置
                </a-button>
            </div>
        </div>
        <div class="line">待出车订单</div>
        <a-table
                :columns="columns"
                :data-source="dataSource"
                size="small"
                :rowKey="(record,index)=>{return index}"
                :pagination="pagination"
                bordered>

        <span slot="startTime" slot-scope="startTime">
            {{formatTime(startTime)}}
        </span>
            <span slot="endTime" slot-scope="endTime">
            {{formatTime(endTime)}}
        </span>
            <div slot="status" slot-scope="status">
                <span v-if="status === 1">
                已下单
            </span>
                <span v-else-if="status === 2">
                待出车
            </span>
                <span v-else-if="status === 3">
                租赁中
            </span>
                <span v-else-if="status === 4">
                已还车
            </span>
                <span v-else-if="status === 5">
                已完成
            </span>
                <span v-else>
                已取消
            </span>
            </div>

            <div class="action-btn" slot="action" slot-scope="text,action,i">
                <a @click="confirmRentout(text,action,i)">出车</a>
            </div>
        </a-table>
    </div>
</template>

<script>
    import {getOrderList, updateOrder} from '@/api/api'
    import Dateutils from '@/utils/dateutils'

    const columns = [
        {
            title: '出租单号',
            dataIndex: 'number',
            key: 'number',
            align: 'center',
            width: 160
        },
        {
            title: '身份证号',
            key: 'idNumber',
            dataIndex: 'idNumber',
            align: 'center',
            width: 160
        },
        {
            title: '车牌号',
            key: 'carNumber',
            dataIndex: 'carNumber',
            align: 'center',
            width: 120
        },
        {
            title: '出租价格',
            dataIndex: 'rentPrice',
            key: 'rentPrice',
            align: 'center',
            width: 100
        },
        {
            title: '起租时间',
            dataIndex: 'startTime',
            key: 'startTime',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'startTime'},
        },
        {
            title: '结束时间',
            key: 'endTime',
            dataIndex: 'endTime',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'endTime'},
        },
        {
            title: '订单状态',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 100,
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: {customRender: 'action'},
            width: 120
        }

    ];

    const dataSource = [
        {
            name: '',
            age: '',
            sex: '',
            address: '',
            phone: '',
            email: '',
            idNumber: '',
        }
    ];
    export default {
        name: "index",
        data(){
            return {
                columns,
                dataSource,
                visible_edit: false,
                isAdd: true,
                userInfoDto: [],
                timer: '',
                options:{
                    number: '',
                    startTime: '',
                    endTime: '',
                },
                pagination: {
                    pageSize: 7
                }
            }
        },
        methods:{
            startTimeChange(date, dateString){
                console.log(date, dateString)
                this.options.startTime = dateString
            },
            endTimeChange(date, dateString){
                console.log(date, dateString)
                this.options.endTime = dateString
            },
            queryInfo(){
                getOrderList(this.options).then(res => {
                    console.log(res)
                    this.dataSource = res.data
                })
            },
            resetInfo(){
                this.options = {}
            },
            SelectChange(value){
                console.log(value)
                this.options.status = value
            },
            formatTime(timestamp){
                return Dateutils.formatDate(timestamp)
            },
            queryRentoutOrder(){
                let params = {
                    status: 2
                }
                getOrderList(params).then(res => {
                    if (res.status === 200){
                        console.log(res.data)
                        this.dataSource = res.data
                    }
                })
            },
            confirmRentout(text, action, index) {
                let params = {
                    id: action.id,
                    status: 3
                }
                updateOrder(params).then(res => {
                    if (res.status === 200) {
                        this.$message.success('出车成功')
                        this.queryRentoutOrder();
                    }
                })
            },
        },

        created(){
            this.queryRentoutOrder()
        }
    }
</script>

<style lang="scss" ref="stylesheet/scss" scoped>
    .line {
        position: relative;
        text-align: center;
        display: block;
        margin: 15px 0px 30px 0px;
        font-size: 18px;
    }
    .line:before{
        content: '';
        position: absolute;
        background: #E8E8E8;
        top: 50%;
        width: 45%;
        left: 1%;
        height: 1px;
    }
    .line:after{
        content: '';
        position: absolute;
        background: #E8E8E8;
        top: 50%;
        width: 45%;
        right: 1%;
        height: 1px;
    }

    .options {
        display: flex;
        flex-wrap: wrap;

        .input-len {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            margin: 0px 20px 15px 20px;
            width: 250px;
            font-size: 14px;

            .input {
                width: 170px;
            }
            .timeSelect{
                display: flex;
                justify-content: center;
                align-items: center;
            }

            label {
                text-align: center;
                margin-right: 12px;
            }
        }

        .btn_group {
            margin-left: 25px;
            display: flex;
            justify-content: space-around;
            width: 220px;
        }

    }

    .action-btn{
        display: flex;
        justify-content: space-around;
    }
</style>
