<template>
    <div class="container">
        <h2>修改门店信息</h2>
        <div class="top">

            <div class="top-left">
                <div class="input-len">
                    <label for="name">店名:</label>
                    <div class="input">
                        <a-input placeholder="Basic usage" id="name" v-model="storefront.name"/>
                    </div>

                </div>
                <div class="input-len">
                    <label for="status">营业状态:</label>
                    <div class="input">
                        <a-select id="status" default-value="启用" style="width: 170px" @change="selectChange">
                            <a-select-option value="1">
                                启用
                            </a-select-option>
                            <a-select-option value="0">
                                关闭
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="input-len">
                    <label for="phone">固定电话:</label>
                    <div class="input">
                        <a-input placeholder="Basic usage" id="phone" v-model="storefront.phone"/>
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
                    <div v-if="fileList.length < 1">
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

            <div class="input-len" >
                <label for="address">门店地址:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="address" v-model="storefront.address" />
                </div>
            </div>

        </div>
        <div class="btn">
            <a-button @click="storefrontInfoAction">添加</a-button>
            <a-button @click="reset">清空</a-button>
        </div>
    </div>
</template>

<script>
    import {updateStorefront, addStorefront, uploadFile} from '@/api/api'

    export default {
        name: "index",
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                fileList: [],
                isAdd: true,
                storefront: {
                    name: '',
                    address: '',
                    phone: '',
                    img: '',
                    status: 1
                }
            };
        },
        props: {
            isAddDto: {
                type: Boolean,
                default: true
            },
            storefrontInfoDto: {
                type: Object,
                default: '',
            },
            imgListDto: {
                default: '',
            }
        },
        mounted() {
            this.isAdd = this.isAddDto;
            const temp = [{
                url: this.storefrontInfoDto.img,
                uid: 1,
                name: 'image.png',
                status: 'done'
            }];
            console.log(this.storefrontInfoDto);
            if (!this.isAddDto) {
                const tempData = JSON.stringify(this.storefrontInfoDto)
                this.storefront = JSON.parse(tempData);
                this.fileList = temp;
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
                    this.getBase64(info.file, imageUrl => {
                        this.previewImage = imageUrl;
                        this.previewVisible = false;
                    });
                }
            },

            // 用户性别选择更换
            selectChange(value) {
                console.log(`selected ${value}`)
                this.storefront.status = value
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
                        this.fileList.push(file)
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

            //用户信息操作
            storefrontInfoAction(){
                if (this.isAdd){
                    this.addStorefrontInfo()
                }else{
                    this.updateStorefrontInfo()
                }
            },

            // 清空
            reset(){
                this.storefront = {}
            },

            //更新车辆信息
            updateStorefrontInfo(){
                let imgList = this.splitPath(this.fileList);
                console.log(imgList)
                let data = this.storefront;
                data.img = imgList[0];
                updateStorefront(data).then(res => {
                    this.$message.success(res.data);
                    this.$emit('childEvent');
                })

            },


            //添加用户信息
            addStorefrontInfo(){
                let imgList = this.splitPath(this.fileList);
                let data = this.storefront;
                data.img = imgList[0];
                addStorefront(data).then(res => {
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
        margin-top: 15px;
        font-size: 14px;
        width: 550px;

        h2{
            text-align: center;
        }

        .top {
            margin-top: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 550px;

            .top-left {
                display: flex;
                flex-direction: column;
                margin-right: 75px;

                .input-len {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-end;
                    margin-bottom: 15px;
                    width: 260px;

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
                    width: 300px;
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
            width: 550px;

            .input-len {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                margin-bottom: 15px;
                width: 260px;
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
                width: 650px;
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
