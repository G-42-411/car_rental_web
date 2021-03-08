<template>
    <div class="container">
        <h2>添加车辆信息</h2>
        <div class="top">

            <div class="top-left">
                <div class="input-len">
                    <label for="brand">品牌:</label>
                    <div class="input">
                        <a-input placeholder="Basic usage" id="brand" v-model="carInfo.brand"/>
                    </div>

                </div>
                <div class="input-len">
                    <label for="type">类型:</label>
                    <div class="input">
                        <a-select id="type" default-value="轿车" style="width: 170px" @change="selectChange">
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
                    <label for="name">车名:</label>
                    <div class="input">
                        <a-input placeholder="Basic usage" id="name" v-model="carInfo.name"/>
                    </div>
                </div>
            </div>
            <div class="top-right">
                <a-upload
                        list-type="picture-card"
                        :file-list="fileList"
                        @preview="handlePreview"
                        @change="handleChange"
                        :before-upload="beforeUpload"
                        :remove="handleRemove"
                        :customRequest="customUpload"
                >
                    <div v-if="fileList.length < 3">
                        <a-icon type="plus" nzNoAnimation/>
                        <div class="ant-upload-text">
                            Upload
                        </div>
                    </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage"/>
                </a-modal>
            </div>
        </div>
        <div class="down">
            <div class="input-len">
                <label for="number">车牌号:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="number" v-model="carInfo.number"/>
                </div>
            </div>
            <div class="input-len">
                <label for="colour">颜色:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="colour" v-model="carInfo.colour"/>
                </div>
            </div>
            <div class="input-len">
                <label for="price">价格:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="price" v-model="carInfo.price"/>
                </div>
            </div>
            <div class="input-len">
                <label for="rent_price">租金:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="rent_price" v-model="carInfo.rentPrice"/>
                </div>
            </div>
            <div class="input-len">
                <label for="deposit">押金:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="deposit" v-model="carInfo.deposit"/>
                </div>
            </div>
            <div class="input-len" style="width: 200px">
                <label for="is_renting">是否出租:</label>
                <a-radio-group id="is_renting" name="radioGroup" v-model="carInfo.isRenting">
                    <a-radio :value="1">
                        是
                    </a-radio>
                    <a-radio :value="2">
                        否
                    </a-radio>

                </a-radio-group>
            </div>

        </div>
        <div class="description-input">
            <label for="description">添加描述:</label>
            <a-textarea
                    id="description"
                    v-model="carInfo.description"
                    placeholder="Controlled autosize"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
            />
        </div>
        <div class="btn">
            <a-button @click="carInfoAction">上传</a-button>
            <a-button>清空</a-button>
        </div>
    </div>
</template>

<script>
    import {addCar, updateCar, uploadFile} from '@/api/api'

    export default {
        name: "index",
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                fileList: [],
                isAdd: true,
                carInfo: {
                    brand: '',
                    type: '轿车',
                    name: '',
                    number: '',
                    colour: '',
                    price: '',
                    rentPrice: '',
                    deposit: '',
                    isRenting: 1,
                    description: ''
                }

            };
        },
        props: {
            isAddDto: {
                type: Boolean,
                default: true,
                // require: true // 必填
            },
            carInfoDto: {
                type: Object,
                default: '',
            },
            imgListDto: {
                default: '',
            }
        },
        mounted() {
            const tempData = JSON.stringify(this.carInfoDto)
            this.isAdd = this.isAddDto;
            const imgArray = this.imgListDto;
            console.log(this.isAdd)
            const tempList = [];
            imgArray.forEach((value, index, imgArray) => {
                const temp = {
                    url: imgArray[index],
                    uid: index,
                    name: 'image.png',
                    status: 'done'
                };
                tempList.push(temp)
            });
            if (!this.isAddDto) {
                this.carInfo = JSON.parse(tempData);
                this.fileList = tempList;
            }
        },
        methods: {
            getBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            },

            //上传前进行的一些操作，可以看作拦截器
            beforeUpload(file) {
                console.log(file);

                return true
            },

            // 上传文件改变时的状态
            handleChange(info) {
                console.log(info)
                if (info.file.status === 'uploading') {
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    this.getBase64(file, imageUrl => {
                        this.previewImage = imageUrl;
                        this.previewVisible = false;
                    });
                }
            },

            // 车辆类型选择更换
            selectChange(value) {
                console.log(`selected ${value}`)
                this.carInfo.type = value
            },

            // 图片预览
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await this.getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },

            // 模态框点击关闭
            handleCancel() {
                this.previewVisible = false;
            },

            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1)
                this.fileList = newFileList
            },

            // 自定义上传
            customUpload(data) {
                const formData = new FormData();
                formData.append("file", data.file);
                uploadFile(formData).then((res) => {
                    if (res.status === 200) {
                        let file = this.fileFormatter(res.data)
                        console.log(file)
                        this.fileList.push(file)
                        console.log(this.fileList)
                    }
                })
            },

            // 格式化数据
            fileFormatter(data) {
                return {
                    uid: data.uuid,
                    name: data.fileName,
                    url: data.filePath,
                    status: 'done'
                }
            },

            //汽车信息操作
            carInfoAction(){
              if (this.isAdd){
                  this.addCarInfo()
              }else{
                  this.updateCarInfo()
              }
            },

            //更新车辆信息
            updateCarInfo(){
                let imgList = this.splitPath(this.fileList);
                let data = this.carInfo;
                data.filePathList = imgList;
                updateCar(data).then(res => {
                    console.log(res);
                    this.$message.success(res.data);
                    this.$emit('childEvent');
                })

            },


            //添加车辆信息
            addCarInfo(){
                let imgList = this.splitPath(this.fileList);
                let data = this.carInfo;
                data.filePathList = imgList;
                addCar(data).then(res => {
                    this.$message.success(res.data);
                    this.$emit('childEvent');
                })

            },

            //分离图片地址
            splitPath(pathList){
                let imgPathList = [];
                pathList.forEach((value, index, pathList) => {
                    imgPathList.push(pathList[index].url)
                });
                return imgPathList
            }
        },

    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        font-size: 14px;
        width: 750px;

        .top {
            margin-top: 15px;
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 700px;

            .top-left {
                display: flex;
                flex-direction: column;
                margin-right: 105px;

                .input-len {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-end;
                    margin-bottom: 15px;
                    width: 230px;

                    .input {
                        width: 170px;
                    }

                    label {
                        text-align: center;
                        margin-right: 12px;
                    }
                }
            }

            .top-right {
                .ant-upload-picture-card-wrapper {
                    display: flex;
                    flex-wrap: wrap;
                    width: 650px;
                }

                .avatar-uploader > .ant-upload {
                    width: 128px;
                    height: 128px;
                }

                .ant-upload-select-picture-card i {
                    font-size: 32px;
                    color: #999;
                }

                .ant-upload-select-picture-card .ant-upload-text {
                    margin-top: 8px;
                    color: #666;
                }
            }
        }

        .down {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 700px;

            .input-len {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                margin-bottom: 15px;
                width: 230px;
                margin-right: 45px;

                .input {
                    width: 170px;
                }

                label {
                    text-align: center;
                    margin-right: 12px;
                }
            }
        }

        .description-input {
            display: flex;
            flex-direction: column;
            margin-top: 10px;

            #description {
                width: 700px;
                margin-top: 10px;
            }
        }

        .btn {
            display: flex;
            justify-content: space-around;
            width: 350px;
            margin-top: 20px;
        }
    }
</style>
