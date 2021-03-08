<template>
    <div class="container">
        <h2>添加客户信息</h2>
        <div class="top">

            <div class="top-left">
                <div class="input-len">
                    <label for="name">姓名:</label>
                    <div class="input">
                        <a-input placeholder="Basic usage" id="name" v-model="userInfo.name"/>
                    </div>

                </div>
                <div class="input-len">
                    <label for="sex">性别:</label>
                    <div class="input">
                        <a-select id="sex" default-value="男" style="width: 170px" @change="selectChange">
                            <a-select-option value="男">
                                男
                            </a-select-option>
                            <a-select-option value="女">
                                女
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="input-len">
                    <label for="age">年龄:</label>
                    <div class="input">
                        <a-input placeholder="Basic usage" id="age" v-model="userInfo.age"/>
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
            <div class="input-len">
                <label for="phone">手机号:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="phone" v-model="userInfo.phone"/>
                </div>
            </div>
            <div class="input-len">
                <label for="idNumber">身份证号:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="idNumber" v-model="userInfo.idNumber"/>
                </div>
            </div>
            <div class="input-len">
                <label for="email">邮箱:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="email" v-model="userInfo.email"/>
                </div>
            </div>
            <div class="input-len">
                <label for="address">家庭住址:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="address" v-model="userInfo.address"/>
                </div>
            </div>
            <div class="input-len">
                <label for="password">密码:</label>
                <div class="input">
                    <a-input placeholder="Basic usage" id="password" v-model="userInfo.password"/>
                </div>
            </div>
        </div>
        <div class="btn">
            <a-button @click="userInfoAction">添加</a-button>
            <a-button @click="reset">清空</a-button>
        </div>
    </div>
</template>

<script>
    import {addUser, updateUser, uploadFile} from '@/api/api'

    export default {
        name: "index",
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                fileList: [],
                isAdd: true,
                userInfo: {
                    name: '',
                    age: '',
                    sex: '',
                    address: '',
                    phone: '',
                    email: '',
                    idNumber: '',
                    password: ''
                }

            };
        },
        props: {
            isAddDto: {
                type: Boolean,
                default: true,
                // require: true // 必填
            },
            userInfoDto: {
                type: Object,
                default: '',
            },
            imgListDto: {
                default: '',
            }
        },
        mounted() {
            const tempData = JSON.stringify(this.userInfoDto)
            this.isAdd = this.isAddDto;
                const temp = [{
                    url: this.userInfoDto.avatar,
                    uid: 1,
                    name: 'image.png',
                    status: 'done'
                }];
                console.log(this.userInfoDto)
            if (!this.isAddDto) {
                this.userInfo = JSON.parse(tempData);
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
                this.userInfo.sex = value
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
            userInfoAction(){
                if (this.isAdd){
                    this.addUserInfo()
                }else{
                    this.updateUserInfo()
                }
            },

            // 清空
            reset(){
                this.userInfo = {
                    name: '',
                    age: '',
                    sex: '',
                    address: '',
                    phone: '',
                    email: '',
                    idNumber: '',
                    password: ''
                }
            },

            //更新车辆信息
            updateUserInfo(){
                let imgList = this.splitPath(this.fileList);
                console.log(imgList)
                let data = this.userInfo;
                data.avatar = imgList[0];
                updateUser(data).then(res => {
                    this.$message.success(res.data);
                    this.$emit('childEvent');
                })

            },


            //添加用户信息
            addUserInfo(){
                let imgList = this.splitPath(this.fileList);
                let data = this.userInfo
                data.avatar = imgList[0]
                let params = {
                    user: data,
                    roleId: 2
                }
                addUser(params).then(res => {
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
