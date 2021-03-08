<template>
    <div class="container">
        <div class="top">
            <div class="input-group">
                <div class="input-item">
                    <label>检查单号: </label>
                    <div class="item">
                        <a-input v-model="options.number"/>
                    </div>
                </div>
                <div class="input-item" style="width: 494px">
                    <label>创建时间: </label>
                    <div class="timeSelect">
                        <a-date-picker @change="startTimeChange"
                                       :show-time="{hideDisabledOptions: true, defaultValue: this.$moment('00:00:00', 'HH:mm:ss')}"
                                       format="YYYY-MM-DD HH:mm:ss"/>
                        <label style="margin: 0 5px">至</label>
                        <a-date-picker @change="endTimeChange"
                                       :show-time="{hideDisabledOptions: true, defaultValue: this.$moment('00:00:00', 'HH:mm:ss')}"
                                       format="YYYY-MM-DD HH:mm:ss"/>
                    </div>
                </div>
                <div class="input-item">
                    <label>存在问题: </label>
                    <div class="item">
                        <a-input v-model="options.question"/>
                    </div>
                </div>
                <div class="input-item">
                    <label>订单编号: </label>
                    <div class="item">
                        <a-input v-model="options.orderNumber"/>
                    </div>
                </div>
                <div class="input-item">
                    <label>操作人员: </label>
                    <div class="item">
                        <a-input v-model="options.operator"/>
                    </div>
                </div>
                <div class="btn-group">
                    <a-button type="primary" @click="query">查询</a-button>
                    <a-button type="danger" @click="clean">清空</a-button>
                </div>
            </div>
        </div>
        <div class="line">查询结果</div>
        <div class="bottom">
            <a-table
                    :columns="columns"
                    :data-source="dataSource"
                    size="small"
                    :rowKey="(record,index)=>{return index}"
                    :pagination="pagination"
                    bordered>
                <label slot="createTime" slot-scope="createTime">
                    {{$moment(createTime).format('YYYY-MM-DD HH:mm:ss')}}
                </label>
                <label slot="action" slot-scope="text,action,i">
                    <a @click="edit(text,action,i)">修改</a>
                </label>

            </a-table>
        </div>
        <a-modal v-model="visible" title="检查单修改" @ok="handleOk" :footer="null" width="650px">
            <div class="modal-box">
                <div class="input-group">
                    <div class="input-item">
                        <label>检查单号: </label>
                        <div class="item">
                            <a-input v-model="modelDate.number"/>
                        </div>
                    </div>
                    <div class="input-item">
                        <label>出租单号: </label>
                        <div class="item">
                            <a-input v-model="modelDate.orderNumber"/>
                        </div>
                    </div>
                    <div class="input-item">
                        <label>创建时间: </label>
                        <div class="item">
                            <a-date-picker @change="startTimeChangeModel"
                                           :show-time="{hideDisabledOptions: true, defaultValue: this.$moment('00:00:00', 'HH:mm:ss')}"
                                           format="YYYY-MM-DD HH:mm:ss"/>
                        </div>
                    </div>
                    <div class="input-item">
                        <label>操作人员: </label>
                        <div class="item">
                            <a-input v-model="modelDate.operator"/>
                        </div>
                    </div>
                    <div class="input-item">
                        <label>存在问题: </label>
                        <div class="item">
                            <a-input v-model="modelDate.question"/>
                        </div>
                    </div>
                    <div class="input-item">
                        <label>应付金额: </label>
                        <div class="item">
                            <a-input v-model="modelDate.compensationAmount"/>
                        </div>
                    </div>

                </div>
                <div class="textarea">
                    <label>问题描述: </label>
                    <div class="item">
                        <a-textarea
                                id="description"
                                placeholder="Controlled autosize"
                                :auto-size="{ minRows: 3, maxRows: 5 }"
                                v-model="modelDate.description"
                                style="width: 100%;"
                        />
                    </div>
                </div>
                <div class="btn-group">
                    <a-button @click="submitModel">提交</a-button>
                    <a-button @click="resetModel">重置</a-button>
                </div>

            </div>
        </a-modal>
    </div>
</template>

<script>
    import {getCheckList, deleteCheckList, updateCheckList, getCheckListDto} from "@/api/api";

    const columns = [
        {
            title: '检查单号',
            dataIndex: 'number',
            key: 'number',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
            scopedSlots: {customRender: "createTime"},
            width:200
        },
        {
            title: '存在问题',
            dataIndex: 'question',
            key: 'question',
            align: 'center',

        },
        {
            title: '问题描述',
            key: 'description',
            dataIndex: 'description',
            align: 'center',
            width:300
        },
        {
            title: '赔付金额',
            key: 'compensationAmount',
            dataIndex: 'compensationAmount',
            align: 'center',
            width: 90
        },
        {
            title: '订单编号',
            key: 'orderNumber',
            dataIndex: 'orderNumber',
            align: 'center',
            width: 90
        },
        {
            title: '操作人员',
            key: 'operator',
            dataIndex: 'operator',
            align: 'center'
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            width: 130,
            scopedSlots: {customRender: 'action'}
        }

    ];

    const dataSource = [
        {
            number: '1',
            createTime: '2021-03-01 14:14:00',
            question: '爆胎',
            description: '就是爆胎了嘛，能有什么问题嘛？',
            compensationAmount: '128.21',
            orderNumber: '1',
            operator: '小黑',
        }
    ];
    export default {
        name: "index",
        data() {
            return {
                columns,
                dataSource,
                startTime: '',
                endTime: '',
                visible: false,
                modelDate:{},
                options: {
                    number: '',
                    question: '',
                    orderNumber: '',
                    operator: '',
                },
                pagination: {
                    pageSize: 7
                }
            }
        },
        methods: {
            startTimeChange(date, dateString) {
                console.log(date,dateString);
                this.startTime = dateString;
            },
            endTimeChange(date, dateString) {
                console.log(date,dateString);
                this.endTime = dateString;
            },
            query() {
                let params = {
                    number: this.options.number,
                    question: this.options.question,
                    orderNumber: this.options.orderNumber,
                    operator: this.options.operator,
                    startTime: this.startTime,
                    endTime: this.endTime,
                };
                getCheckListDto(params).then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        this.dataSource = res.data
                    }
                })
            },
            clean() {
                this.options = {}
            },

            edit(text, action, index) {
                console.log(text, action, index)
                this.modelDate = action
                this.visible = true;

            },
            handleOk(){

            },
            startTimeChangeModel(date, dateString){
                console.log(date,dateString);
                this.modelDate.createTime = dateString;
            },
            submitModel(){
                updateCheckList(this.modelDate).then(res => {
                    if (res.status === 200){
                        this.$message.success("修改成功")
                        this.queryCheckList()
                        this.visible = false
                    }
                })
            },
            resetModel(){
                this.modelDate = {};
            },
            queryCheckList(){
                let params = {}
                getCheckList(params).then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        this.dataSource = res.data
                    }
                })
            }
        },
        created() {
            this.queryCheckList()
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

    .line:before {
        content: '';
        position: absolute;
        background: #E8E8E8;
        top: 50%;
        width: 45%;
        left: 1%;
        height: 1px;
    }

    .line:after {
        content: '';
        position: absolute;
        background: #E8E8E8;
        top: 50%;
        width: 45%;
        right: 1%;
        height: 1px;
    }

    .container {
        display: flex;
        flex-direction: column;
        /*padding: 10px;*/
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
                    margin: 0 20px 15px 20px;
                    width: 250px;
                    font-size: 14px;

                    label {
                        display: inline-block;
                        margin-right: 12px;
                    }

                    .item {
                        width: 170px;
                    }

                    .timeSelect {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                }

                .btn-group {
                    width: 220px;
                    display: flex;
                    justify-content: space-around;
                    margin-left: 8px;
                }
            }
        }

        .bottom {

        }

        .action-btn {
            display: flex;
            justify-content: space-around;
        }



    }

    .modal-box{
        width: 600px;
        display: flex;
        flex-direction: column;
        .input-group {
            display: flex;
            flex-wrap: wrap;

            .input-item {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin: 0 20px 15px 20px;
                width: 250px;
                font-size: 14px;

                label {
                    display: inline-block;
                    margin-right: 12px;
                }

                .item {
                    width: 170px;
                }

                .timeSelect {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

            }
        }
        .textarea {
            margin: 10px 30px;
            span {
                display: inline-block;
                margin-bottom: 10px;
            }
        }
        .btn-group {
            width: 300px;
            display: flex;
            justify-content: space-around;
            margin: auto;
        }
    }
</style>
