<template>
    <div class="preview">
        <div class="loading" v-show="loading">
            <img src="/src/assets/img/zoneLoading.gif" alt="">
            <div>
                <span>数据请求中</span>
            </div>
        </div>
        <div class="error" v-show="error">
            <span @click="handleChartById(id)">{{ error }}</span>
        </div>
        <div ref="chart" id="chart" class="chart"></div>
        <div class="chartName">
            {{ chartName }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue"
import { getZoneCreateMessageGroupByDateReq, getPostsBestFive, getUserSigninMessageForFive, getReplyMessageForZoneBestReplyRes, getRoomBestChatReq } from "../../api/index"
import { getDate } from "../../../tools/tFun"
import * as echarts from 'echarts';

let props = defineProps(['id'])

// 图表DOM节点
let chart = ref()
// 加载
let loading = ref(false)
// 是否发生错误
let error = ref('')
// 图表名称
let chartName = ref("")
onMounted(() => {
    console.log("初始化id:", props.id);

    setTimeout(() => {
        handleChartById(props.id)
    }, 500);

})
// 处理获取哪个图表数据
function handleChartById(id) {
    loading.value = false
    error.value = ''
    switch (id) {
        case '2.1':
            chartName.value = "近期创建过分区的五个日期："
            initZoneChart()
            break;
        case '2.2':
            console.log("初始化帖子图");
            chartName.value = "拥有最多帖子的五个分区："
            initPostChart()
            break;
        case '2.3':
            console.log("初始化用户图");
            chartName.value = "近期用户签到人数数据："
            initUserSignin()
            break;
        case '2.4':
            console.log("初始化流量图");
            chartName.value = "热门分区的近十天评论数据"
            initHotZoneReplyMessage()
            break;
        case '2.5':
            console.log("初始化频道图");
            chartName.value = "活跃度较高的三个频道："
            initRoomChart()
            break;
        default:
            break;
    }
}



let currentChart;
// 初始化分区分析图
function initZoneChart() {
    // 加载
    loading.value = true
    // 发送请求
    getZoneCreateMessageGroupByDateReq().then(res => {
        if (res.status == 200) {
            if (res.data.length == 0) {
                return;
            }
            // 处理图表
            let xData = <Array<String>>[]
            let yData = <Array<Number>>[]
            for (const zone of res.data.reverse()) {
                console.log(zone);
                xData.push(zone['z_createDate'])
                yData.push(zone['count'])
            }
            loading.value = false
            currentChart = echarts.init(chart.value);
            // 绘制图表
            currentChart.setOption({
                xAxis: {
                    name: "日期",
                    type: 'category',
                    data: xData
                },
                yAxis: {
                    name: "创建个数",
                    type: 'value'
                },
                series: [
                    {
                        data: yData,
                        type: 'line',
                        label: {
                            show: true
                        }
                    }
                ]
            });
        } else {
            error.value = "数据请求失败，点击重试"
        }
    }).finally(() => { loading.value = false })
}
// 初始化帖子分析图(列出前五个帖子最多的分区)
function initPostChart() {
    loading.value = true
    // 发起请求
    getPostsBestFive().then(res => {
        console.log(res);
        if (res.status == 200) {
            if (res.data.length == 0) {
                return;
            }
            // 处理数据
            let resourceData = <any>[]
            for (const post of res.data.reverse()) {
                resourceData.push({ name: post['z_name'], value: post['z_posts'] })
            }

            currentChart = echarts.init(chart.value);
            // 绘制图表
            currentChart.setOption({
                series: [
                    {
                        type: 'pie',
                        data: resourceData
                    }
                ]
            });
        } else {
            error.value = "数据请求失败，点击重试"
        }
    }).finally(() => { loading.value = false })
}
// 初始化用户签到分析图
function initUserSignin() {
    loading.value = true
    // 发送请求
    getUserSigninMessageForFive().then(res => {
        console.log(res);
        // 处理数据
        let xData = <any>[]
        let yData = <any>[]
        for (const user of res.data) {
            xData.push(user['u_signin_date'].split(" ")[0])
            yData.push(user['count'])
        }
        currentChart = echarts.init(chart.value);
        // 绘制图表
        currentChart.setOption({
            xAxis: {
                data: xData
            },
            yAxis: {},
            series: [
                {
                    type: 'bar',
                    data: yData,
                    barWidth: '20%',
                    label: {
                        show: true
                    }
                }
            ]
        });
    }).finally(() => { loading.value = false })
}
// 初始化热门分区的近期评论情况
function initHotZoneReplyMessage() {
    loading.value = true
    // 发送请求
    getReplyMessageForZoneBestReplyRes().then(res => {
        console.log(res);
        // 处理数据
        let sourceData = {}
        for (const msg of res.data) {
            if (!sourceData[msg['z_name']]) {
                sourceData[msg['z_name']] = [{ date: msg['r_date'].split(' ')[0], count: msg['count'] }]
            } else {
                sourceData[msg['z_name']].push({ date: msg['r_date'].split(' ')[0], count: msg['count'] })
            }
        }
        console.log('第一次处理的数据', sourceData);

        // 再次处理数据，保证每个分区都统计到10天内，如果当天没有评论，就是 0
        // 获取近十天的日期字符串
        let tenDate = getDate(10)
        let secondHandleData = {}
        // 每个分区循环10次，如果该分区有当天的评论数，就采用分区当天的评论数，没有就是0
        let index = 0
        for (const key in sourceData) {
            console.log(key, sourceData[key]);
            // 判断二次处理数据中没有买该键名
            if (!secondHandleData[index + '']) {
                secondHandleData[index + ''] = []

            }
            console.log(secondHandleData);

            for (let i = 0; i < 10; i++) {
                // 判断有没有这个日期的评论数
                for (let j = 0; j < sourceData[key].length; j++) {
                    if (sourceData[key][j]['date'].indexOf(tenDate[i]) != -1) {
                        // secondHandleData[key].push({ date: tenDate[i], count: sourceData[key][j]['count'] })
                        secondHandleData[index + ''].push(sourceData[key][j]['count'])
                        break;
                    } else {
                        secondHandleData[index + ''].push(0)
                        break;
                    }
                }

            }
            console.log("------------------");
            index += 1
        }
        console.log("二次处理数据：", secondHandleData);
        currentChart = echarts.init(chart.value);
        // 绘制图表
        currentChart.setOption({
            legend: {
                show: true,
                icon: "circle",
                textStyle: {

                }
            },
            xAxis: {
                data: tenDate
            },
            yAxis: {},
            series: [
                {
                    data: secondHandleData[0],
                    type: 'line',
                    stack: 'x'
                },
                {
                    data: secondHandleData[1],
                    type: 'line',
                    stack: 'x'
                },
                {
                    data: secondHandleData[2],
                    type: 'line',
                    stack: 'x'
                }
            ]
        });
    }).finally(() => { loading.value = false })
}
// 初始化频道分析图
function initRoomChart() {
    loading.value = true
    // 发起请求
    getRoomBestChatReq().then(res => {
        console.log(res);
        if (res.status == 200) {
            if (res.data.length == 0) {
                return;
            }
            // 处理数据
            console.log(res.data);
            let names = <any>[]
            let data = <any>[]
            for (const room of res.data) {
                names.push(room['r_name'])
                data.push(room['count'])
            }
            currentChart = echarts.init(chart.value);
            // // 绘制图表
            var option = {
                tooltip: {},
                legend: {
                    data: ['聊天次数']
                },
                xAxis: {},
                yAxis: {
                    type: "category",
                    data: names
                },
                series: [{
                    name: '聊天次数',
                    type: 'bar',
                    data: data
                }]
            };



            currentChart.setOption(option);
        } else {
            error.value = "数据请求失败，点击重试"
        }
    }).finally(() => { loading.value = false })
}
onUnmounted(() => {
    console.log("卸载了");
})
</script>

<style lang="less" scoped>
.preview {
    height: 100%;
    width: 100%;
    position: relative;

    .loading {
        height: 100px;
        width: 100px;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        text-align: center;

        img {
            height: 60px;
            width: 60px;
        }

        >div {
            margin: 0 auto;
            text-align: center;
        }
    }

    .error {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        cursor: pointer;
        text-align: center;
        user-select: none;
    }

    .chart {
        height: 100%;
        width: 100%;
    }

    .chartName {
        position: absolute;
        top: 5px;
        left: 25px;
        font-family: "黑体";
        font-size: 16px;
        
    }
}
</style>