<template>
    <div class="container">
        <div class="line">门店信息</div>
        <a-table
                :columns="columns"
                :data-source="dataSource"
                size="small"
                :rowKey="(record,index)=>{return index}"
                :pagination="pagination"
                bordered>
            <div slot="watch" slot-scope="text,action,i">
                <a @click="viewImg(text,action,i)">查看</a>
            </div>
            <div slot="status" slot-scope="status">
                {{status === 1? '启用' : '关闭'}}
            </div>
            <div class="action-btn" slot="action" slot-scope="text,action,i">
                <a @click="edit(text,action,i)">修改</a>
                <a @click="add(text,action,i)">新增</a>
                <a @click="del(text,action,i)">删除</a>
            </div>

        </a-table>
        <a-modal v-model="visitor" title="图片预览" :footer="null">
            <div class="carousel_box">

                <a-carousel ref="conrousel" dot-position="bottom" style="width: 100%" dotsClass="point">
                    <img style="width: 100%;" :src="imgList">
                </a-carousel>

            </div>
        </a-modal>

        <a-modal v-model="visible_edit" title="图片预览" width="600px" :footer="null">
            <storefront :is-add-dto="isAdd" :storefront-info-dto="storefrontInfoDto" :key="timer" @childEvent="childCallback"/>
        </a-modal>
    </div>
</template>

<script>
    import Storefront from '@/components/storefront'
    import {getStorefrontList, deleteStorefront} from '@/api/api'

    const columns = [
        {
            title: '店名',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '门店地址',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
            width: 300,
        },
        {
            title: '固定电话',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center'
        },
        {
            title: '门店照片',
            key: 'watch',
            dataIndex: 'watch',
            align: 'center',
            scopedSlots: {customRender: 'watch'}
        },
        {
            title: '营业状态',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            scopedSlots: {customRender: 'status'}
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            width: 170,
            scopedSlots: {customRender: 'action'}
        }

    ];

    const dataSource = [
        {
            name: '夏一可的炉石旅店',
            address: '陕西省咸阳市长武县昭仁街道512号',
            phone: '1888888888',
            img: '',
            status: 1

        }
    ];
    export default {
        name: "index",
        data() {
            return {
                columns,
                dataSource,
                imgList: [],
                visitor: false,
                isAdd: false,
                visible_edit: false,
                timer: '',
                storefrontInfoDto: {},
                pagination: {
                    pageSize: 5
                }
            }
        },
        components: {
            Storefront
        },
        methods: {
            viewImg(text, action, index) {
                console.log(action)
                this.imgList = action.img
                this.visitor = true
                console.log(this.imgList, this.visitor)
            },
            getStorefront() {
                let params = {};
                getStorefrontList(params).then(res => {
                    if (res.status === 200) {
                        this.dataSource = res.data
                    }
                })
            },
            handlePrev() {
                // 通过上边指定的ref 来操作
                this.$refs.conrousel.prev();
            },
            handleNext() {
                this.$refs.conrousel.next();
            },
            edit(text, action, index) {
                this.visible_edit = true;
                this.isAdd = false;
                this.storefrontInfoDto = action;
                this.timer = new Date().getTime()
            },
            add(text, action, index){
                this.visible_edit = true;
                this.isAdd = true;
                this.timer = new Date().getTime()
            },
            del(text, action, index){
                let params = {
                    id: action.id
                }
                deleteStorefront(params).then(res => {
                    if (res.status === 200){
                        this.getStorefront()
                        this.$message.success(res.data);
                    }
                })
            },
            childCallback(data) {
                this.visible_edit = false;
                this.getStorefront()
            },
        },
        created() {
            this.getStorefront();
        }
    }
</script>

<style scoped>
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

    .edit-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }

    .edit-item {
        display: flex;
        margin: 10px 0;
        align-items: center;
    }

    .edit-item > span {
        display: inline-block;
        width: 70px;
        text-align: right;
        margin-right: 10px;
    }

    .edit-item > input {
        width: 150px;
    }

    .action-btn{
        display: flex;
        justify-content: space-around;
    }
</style>
