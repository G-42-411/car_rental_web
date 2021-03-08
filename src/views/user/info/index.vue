<template>
    <div>
<!--        <div class="line">查询条件</div>-->
        <div class="options">
            <div class="input-len">
                <label for="name">姓名:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="name" v-model="options.name"/>
                </div>
            </div>
            <div class="input-len">
                <label for="age">年龄:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="age" v-model="options.age"/>
                </div>
            </div>
            <div class="input-len">
                <label for="phone">联系电话:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="phone" v-model="options.phone"/>
                </div>
            </div>
            <div class="input-len">
                <label for="idNumber">身份证号:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="idNumber" v-model="options.idNumber"/>
                </div>
            </div>
            <div class="input-len">
                <label for="address">用户地址</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="address" v-model="options.address"/>
                </div>
            </div>
            <div class="input-len">
                <label for="sex">性别:</label>
                <div class="input">
                    <a-select id="sex" default-value="" style="width: 170px" @change="selectChange" v-model="options.sex">
                        <a-select-option value="">
                            空
                        </a-select-option>
                        <a-select-option value="男">
                            男
                        </a-select-option>
                        <a-select-option value="女">
                            女
                        </a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="btn_group">
                <a-button type="primary" @click="queryInfo()">
                    查询
                </a-button>
                <a-button type="danger" @click="resetInfo()">
                    重置
                </a-button>
                <a-button @click="add()">
                    新增
                </a-button>
            </div>
        </div>

        <div class="line">查询结果</div>


        <a-table
                :columns="columns"
                :data-source="dataSource"
                size="small"
                :rowKey="(record,index)=>{return index}"
                :pagination="pagination"
                bordered>

        <span slot="sex" slot-scope="sex">
            {{sex === 1 ? '男' : '女'}}
        </span>

            <div class="action-btn" slot="action" slot-scope="text,action,i">
                <a @click="edit(text,action,i)">修改</a>
                <a @click="delUser(text,action,i)">删除</a>
            </div>
        </a-table>

        <a-modal v-model="visible_edit" title="客户信息操作" width="800px" :footer="null">
            <add :is-add-dto="isAdd" :user-info-dto="userInfoDto" :key="timer" @childEvent="childCallback"></add>
        </a-modal>
    </div>
</template>

<script>
    import {delUser, getUserList, getUserListByCondition} from "@/api/api";
    import Add from '@/components/user/edit'

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 120
        },
        {
            title: '性别',
            key: 'sex',
            dataIndex: 'sex',
            align: 'center',
            scopedSlots: {customRender: "sex"},
            width: 80
        },
        {
            title: '年龄',
            key: 'age',
            dataIndex: 'age',
            align: 'center',
            width: 80
        },
        {
            title: '身份证号',
            dataIndex: 'idNumber',
            key: 'idNumber',
            align: 'center',
            width: 190
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
            width: 190
        },
        {
            title: '用户地址',
            key: 'address',
            dataIndex: 'address',
            align: 'center'
        },
        {
            title: '邮箱',
            key: 'email',
            dataIndex: 'email',
            align: 'center',
            width: 190
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
        data() {
            return {
                columns,
                dataSource,
                visible_edit: false,
                isAdd: true,
                userInfoDto: [],
                timer: '',
                options: {
                    name: '',
                    age: '',
                    sex: '',
                    address: '',
                    phone: '',
                    email: '',
                    idNumber: '',
                },
                pagination: {
                    pageSize: 7
                }
            }
        },
        components:{
            Add
        },
        methods: {
            // 根据条件查询用户信息
            queryInfo() {
                getUserListByCondition(this.options).then(res => {
                    this.dataSource = res.data
                })
            },

            // 重置搜索栏
            resetInfo() {
                this.options = {
                    sex: ''
                }
            },

            // 新增客户
            add() {
                this.visible_edit = true
                this.isAdd = true
                this.timer = new Date().getTime()
            },

            //修改客户信息
            edit(text, action, index) {
                const data = action.__ob__.value;
                this.visible_edit = true;
                this.userInfoDto = data;
                this.isAdd = false;
                this.timer = new Date().getTime()
            },

            // 删除客户信息
            delUser(text, action, index) {
                const data = action.__ob__.value;
                const params = {
                    userId: data.id
                }
                delUser(params).then(res => {
                    this.$message.success("删除成功")
                    this.queryInfo()
                })
            },

            // 性别选项
            selectChange(value){
                this.options.sex = value
            },

            //子组件回调
            childCallback(data) {
                this.visible_edit = false;
                this.queryInfo()
            },

        },
        created: function () {
            getUserList().then(res => {
                this.dataSource = res.data;
            })
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
