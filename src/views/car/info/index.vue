<template>
    <div>
<!--        <div class="line">查询条件</div>-->
        <div class="options">
            <div class="input-len">
                <label for="number">车牌号:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="number" v-model="carInfo.number"/>
                </div>
            </div>
            <div class="input-len">
                <label for="type">车辆类型:</label>
                <div class="input">
                    <a-select id="type" default-value="" style="width: 170px" @change="selectChangeType" v-model="carInfo.type">
                        <a-select-option value="">
                            空
                        </a-select-option>
                        <a-select-option value="轿车">
                            轿车
                        </a-select-option>
                        <a-select-option value="SUV">
                            SUV
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="input-len">
                <label for="colour">车牌颜色:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="colour" v-model="carInfo.colour"/>
                </div>
            </div>
            <div class="input-len">
                <label for="rentPrice">出租价格:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="rentPrice" v-model="carInfo.rentPrice"/>
                </div>
            </div>
            <div class="input-len">
                <label for="isRenting">租赁中:</label>
                <div class="input">
                    <a-select id="isRenting" default-value="" style="width: 170px" @change="selectChange" v-model="carInfo.isRenting">
                        <a-select-option value="">
                            空
                        </a-select-option>
                        <a-select-option value="1">
                            是
                        </a-select-option>
                        <a-select-option value="0">
                            否
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="input-len">
                <label for="brand">品牌:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="brand" v-model="carInfo.brand"/>
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
                :data-source="data"
                size="small"
                :rowKey="(record,index)=>{return index}"
                :pagination="pagination"
                bordered>
            <span slot="type" slot-scope="type">
                {{type}}
            </span>
            <span slot="isRenting" slot-scope="isRenting">
                {{isRenting === 1 ? '是' : '否'}}
            </span>
            <div slot="watch" slot-scope="text,action,i">
                <a @click="viewImg(text,action,i)">编辑</a>
            </div>
            <div class="action-btn" slot="action" slot-scope="text,action,i">
                <a @click="edit(text,action,i)">修改</a>
                <a @click="delCar(text,action,i)">删除</a>
            </div>

        </a-table>
        <a-modal v-model="visible" title="图片预览" @ok="handleOk" :footer="null">
            <div class="carousel_box">

                <a-carousel ref="conrousel" dot-position="bottom" style="width: 100%" dotsClass="point">
                    <div v-for="(img, index) in imgList" :key="index">
                        <img style="width: 100%;" :src="img">
                    </div>
                </a-carousel>
                <div v-if="imgList.length > 1" class="a-left" @click="handlePrev">
                    <a-icon type="left"  style="font-size: 25px"/>
                </div>
                <div v-if="imgList.length > 1" class="a-right"  @click="handleNext">
                    <a-icon type="right" style="font-size: 25px"/>
                </div>

            </div>
        </a-modal>
        <a-modal v-model="visible_edit" title="图片预览" width="800px" :footer="null">
            <add :is-add-dto="isAdd" :car-info-dto="carInfoDto" :img-list-dto="imgList" :key="timer" @childEvent="childCallback"></add>
        </a-modal>
    </div>
</template>

<script>

    import { getCarListByCondition, getCarList, deleteCar} from "@/api/api";
    import Add from '@/components/car/edit'

    const columns = [
        {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
            align: 'center'
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            scopedSlots: {customRender: "type"},
        },
        {
            title: '车名',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '车牌号',
            key: 'number',
            dataIndex: 'number',
            align: 'center'
        },
        {
            title: '颜色',
            key: 'colour',
            dataIndex: 'colour',
            align: 'center'
        }, ,
        {
            title: '价格',
            key: 'price',
            dataIndex: 'price',
            align: 'center'
        }, ,
        {
            title: '租金',
            key: 'rentPrice',
            dataIndex: 'rentPrice',
            align: 'center',
            width: 110
        }, ,
        {
            title: '押金',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'center',
            width: 110
        }, ,
        {
            title: '租赁中',
            key: 'isRenting',
            dataIndex: 'isRenting',
            align: 'center',
            width: 110,
            scopedSlots: {customRender: "isRenting"},
        },
        {
            title: '查看图片',
            key: 'watch',
            dataIndex: 'watch',
            align: 'center',
            width: 100,
            scopedSlots: {customRender: 'watch'}
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

    const data = [
        {
            brand: '奥迪',
            type: '轿车',
            name: 'RS7',
            number: '陕A.S7788',
            colour: '黑色',
            price: '5000000',
            rentPrice: '1000',
            deposit: '2000',
            isRenting: 'true'
        }
    ];
    export default {
        name: "index",
        data() {
            return {
                data,
                columns,
                visible: false,
                visible_edit: false,
                imgList: [],
                isAdd: true,
                timer: '',
                carInfoDto: '',
                carInfo: {
                    id: '',
                    brand: '',
                    type: '',
                    name: '',
                    number: '',
                    colour: '',
                    price: '',
                    rentPrice: '',
                    deposit: '',
                    isRenting: '',
                    description: ''
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
            selectChange(value) {
                console.log(`selected ${value}`)
                this.carInfo.isRenting = value
            },
            selectChangeType(value){
                this.carInfo.type = value
            },
            edit(text, action, i) {
                const data = action.__ob__.value;
                this.visible_edit = true;
                this.carInfoDto = data;
                this.isAdd = false;
                this.imgList = data.imgList;
                this.timer = new Date().getTime()
            },
            delCar(text, action, i) {
                const data = action.__ob__.value;
                console.log(data)
                const params = {
                    carId: data.id
                }
                deleteCar(params).then(res=>{
                    if (res.status === 200){
                        this.$message.success("删除成功")
                        this.queryInfo()
                    }
                })
            },
            add(){
                this.visible_edit = true
                this.isAdd = true
                this.timer = new Date().getTime()
            },
            viewImg(text, action, i) {
                console.log(action)
                const data = action.__ob__.value;
                this.imgList = data.imgList
                this.visible = true;
            },
            handleOk() {
                console.log(e);
                this.visible = false;
            },
            handlePrev() {
                // 通过上边指定的ref 来操作
                this.$refs.conrousel.prev();
            },
            handleNext() {
                this.$refs.conrousel.next();
            },
            childCallback(data) {
                this.visible_edit = false;
                this.queryInfo()
            },
            queryInfo(){
                getCarListByCondition(this.carInfo).then(res => {
                    console.log(res)
                    this.data = res.data
                })
            },
            resetInfo(){
                this.carInfo = {
                    isRenting: '',
                    type: ''
                }
            }
        },
        created: function () {
            getCarList().then(res => {
                console.log(res)
                this.data = res.data
            })
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>


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
        .btn_group{
            margin-left: 25px;
            display: flex;
            justify-content: space-around;
            width: 220px;
        }

    }

    .carousel_box {
        width: 100%;
        position: relative;
        .a-left{
            position: absolute;
            left: 10px;
            top: 50%;

        }
        .a-right{
            position: absolute;
            right: 10px;
            top: 50%;
        }

    }

    .action-btn{
        display: flex;
        justify-content: space-around;
    }

</style>
