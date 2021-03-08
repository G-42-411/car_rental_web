<template>
    <div class="container">
        <div class="line">留言列表</div>
        <a-table
                :columns="columns"
                :data-source="dataSource"
                size="small"
                :rowKey="(record,index)=>{return index}"
                :pagination="pagination"
                bordered>

            <span slot="content" slot-scope="content" @click="viewContent(content)" style="cursor: pointer">
                {{content}}
            </span>

            <div class="action-btn" slot="img" slot-scope="text,action,i">
                <a @click="viewImg(text,action,i)">查看</a>
            </div>
            <div class="action-btn" slot="status" slot-scope="status">
                <span v-if="status === -1">
                    已提交
                </span>
                <span v-else-if="status === 0">
                    已拒绝
                </span>
                <span v-if="status === 1">
                    已通过
                </span>
            </div>
            <div class="action-btn" slot="action" slot-scope="text,action,i">
                <div v-if="action.status === -1" class="action-btn">
                    <a @click="changeStatus(1,action)">通过</a>
                    <a @click="changeStatus(0,action)">拒绝</a>
                </div>
                <div v-else class="action-btn">
                    <a @click="delComment(action)">删除</a>
                </div>
            </div>

        </a-table>

        <a-modal v-model="contentVisible" title="内容详情" :footer="null" width="650px">
            <span>{{tempString}}</span>
        </a-modal>

        <a-modal v-model="imgVisible" title="图片预览" :footer="null">
            <div class="carousel_box">
                <a-carousel ref="conrousel" dot-position="bottom" style="width: 100%" dotsClass="point">
                    <div v-for="(img, index) in imgList" :key="index">
                        <img style="width: 100%;" :src="img">
                    </div>
                </a-carousel>
                <div v-if="imgList.length > 1" class="a-left" @click="handlePrev">
                    <a-icon type="left" style="font-size: 25px"/>
                </div>
                <div v-if="imgList.length > 1" class="a-right" @click="handleNext">
                    <a-icon type="right" style="font-size: 25px"/>
                </div>
            </div>
        </a-modal>
    </div>

</template>

<script>
    import {getCommentList, deleteComment, updateComment} from '@/api/api'

    const columns = [
        {
            title: '评论人',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
            width: 120
        },
        {
            title: '评论内容',
            dataIndex: 'content',
            key: 'content',
            align: 'center',
            ellipsis: true,
            scopedSlots: {customRender: "content"},
        },
        {
            title: '图片',
            key: 'img',
            dataIndex: 'img',
            align: 'center',
            width: 130,
            scopedSlots: {customRender: 'img'}
        },
        {
            title: '评论时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
            width: 180
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: "status"},
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
            username: '',
            imgList: [],
            content: '',
            status: '',
            createTime: '',
        }
    ];
    export default {
        name: "index",
        data() {
            return {
                dataSource,
                columns,
                contentVisible: false,
                imgVisible: false,
                imgList: [],
                tempString: '',
                pagination: {
                    pageSize: 7
                }
            }
        },
        methods: {
            viewContent(content) {
                this.tempString = content;
                this.contentVisible = true
            },
            handlePrev() {
                // 通过上边指定的ref 来操作
                this.$refs.conrousel.prev();
            },
            handleNext() {
                this.$refs.conrousel.next();
            },
            viewImg(text, action, index) {
                console.log(text, action, index);
                this.imgVisible = true;
                this.imgList = action.imgList;
            },

            changeStatus(status, action) {
                let params = {
                    id: action.id,
                    status: status,
                }
                updateComment(params).then(res => {
                    if (res.status === 200){
                        this.$message.success("留言请求已通过")
                        this.queryCommentList()
                    }
                })
            },
            delComment(action){
                let params = {
                    id: action.id
                }
                deleteComment(params).then(res => {
                    if (res.status === 200){
                        this.$message.success("删除成功")
                        this.queryCommentList()
                    }
                })
            },
            queryCommentList(){
                getCommentList().then(res => {
                    if (res.status === 200) {
                        this.dataSource = res.data;
                        console.log(this.dataSource.length)
                    }
                })
            }

        },
        mounted() {
            this.queryCommentList()
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

    .carousel_box {
        width: 100%;
        position: relative;
    }

    .a-left {
        position: absolute;
        left: 10px;
        top: 50%;

    }

    .a-right {
        position: absolute;
        right: 10px;
        top: 50%;
    }

    .action-btn {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }
</style>
