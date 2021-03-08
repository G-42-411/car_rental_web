<template>
    <div class="container">
        <div class="top">
        </div>
        <div class="line">用户分布信息</div>
        <div class="bottom">
            <div class="content">
                <h3 style="margin-bottom: 10px">总人数为{{getTotalUser()}}人，详细分布情况如下</h3>
                <span v-for="item in source">
                    {{item.name}} : {{item.value}}人
                </span>
            </div>
            <div class="chart" id="chart" style="width: 75%;height:450px;"/>
        </div>
    </div>
</template>

<script>
    import china from '@/assets/json/china.json'
    import {getUserDistribution} from '@/api/api'
    export default {
        name: "index",
        data(){
            return {
                source: [],
                total: ''
            }
        },
        methods:{
            drawChart() {
                function randomData () {
                    return Math.round(Math.random() * 500);
                }
                this.$echarts.registerMap('china', china)
                let myChart = this.$echarts.init(document.getElementById('chart'));
                // 绘制图表
                myChart.setOption(  {
                    tooltip: {},
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['']
                    },
                    selectedMode: 'single',
                    series: [
                        {
                            name: '',
                            type: 'map',
                            mapType: 'china',
                            zoom: 1.3,
                            center:[115.97, 29.71],
                            layoutCenter: ['100%', '100%'],
                            itemStyle: {
                                normal: {
                                    borderColor: 'rgba(0, 0, 0, 0.2)'
                                },
                                emphasis: {
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                    shadowBlur: 20,
                                    borderWidth: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            showLegendSymbol: true,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: this.source
                        }
                    ]
                })
            },
            getDateSource(){
                getUserDistribution().then(res => {
                    if (res.status === 200){
                        this.source = res.data;
                        this.drawChart()
                    }
                })
            },
            getTotalUser(){
                let total = 0
                this.source.forEach( s => {
                    total += s.value
                });
                return total;
            }
        },
        mounted(){
            this.getDateSource()
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
            justify-content: space-around;
            padding: 0 20px;
            .content{
                flex: 3;
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                border: solid 1px #E8E8E8;
                box-shadow: -1px 1px 4px #7e8c8d;
                span{
                    font-size: 14px;
                    display: inline-block;
                    margin-bottom: 10px;
                }
            }
            .chart{
            flex: 7;
            }
        }
    }

</style>
