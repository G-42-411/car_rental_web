<template>
    <div class="container">
        <div class="top">
            <div class="date-component">
                <label for="time">查询年份:</label>
                <div class="timeSelect" id="time">
                    <a-input placeholder="2021" v-model="year"/>
                </div>
            </div>
            <a-button type="primary" @click="query">查询</a-button>
        </div>
        <div class="line">营业收益信息</div>
        <div class="bottom">
            <div id="chart" style="width: 90%;height:400px;"/>
            <div class="content">
                <span>每月最大收入:{{max}}元</span>
                <span>每月最少收入:{{min}}元</span>
                <span>月平均收入:{{age}}元</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {getRevenue} from '@/api/api'

    export default {
        name: "index",
        data() {
            return {
                year: '',
                dataSource: [],
                max: '',
                min: '',
                age: ''
            }
        },
        methods: {
            drawChart() {
                let myChart = this.$echarts.init(document.getElementById('chart'));
                console.log(myChart);
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: this.dateFormat()
                };
                myChart.setOption(option)
            },
            startTimeChange(date, dateString) {

            },
            endTimeChange(date, dateString) {

            },
            getRevenueData() {
                let params = {
                    year: this.year !== '' ? this.year : '2021'
                };
                getRevenue(params).then(res => {
                    if (res.status === 200) {
                        this.dataSource = res.data;
                        this.drawChart();
                        this.baseSort()
                    }
                })
            },
            dateFormat() {
                let params = {
                    name: '收益',
                    data: [],
                    type: 'line',
                    smooth: true
                };
                let result = [];
                this.dataSource.forEach(s => {
                    let temp = {};
                    let item = Object.assign(temp, params);
                    item.data = s.money;
                    item.name = s.name;
                    result.push(item)
                });
                return result
            },
            query(){
                this.getRevenueData();
            },
            baseSort(){
                let temp = JSON.stringify(this.dataSource);
                temp = JSON.parse(temp);
                let list = [];
                temp.forEach(s => {
                    list = list.concat(s.money)
                });
                console.log(list)
                list.sort((a,b)=>{return a-b});

                this.min = list[0];
                this.max = list[list.length - 1];
                let total = 0;
                for (let i = 0; i < list.length; i++){
                 total += list[i]
                }
                let age = total / list.length
                this.age = age.toFixed(2)
            }
        },
        mounted() {
            this.getRevenueData();
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
        width: 44%;
        left: 1%;
        height: 1px;
    }

    .line:after {
        content: '';
        position: absolute;
        background: #E8E8E8;
        top: 50%;
        width: 44%;
        right: 1%;
        height: 1px;
    }

    .container {
        display: flex;
        flex-direction: column;

        .top {
            display: flex;
            justify-content: center;
            margin: 10px 0;

            .date-component {
                display: flex;
                align-items: center;
                margin-right: 20px;

                label {
                    display: inline-block;
                    margin-right: 10px;
                }
            }
        }
        .bottom{
            display: flex;
            align-items: center;
            flex-direction: column;
            .content{
                width: 500px;
                display: flex;
                justify-content: space-around;
                span{
                    display: inline-block;
                }
            }
        }
    }

</style>
