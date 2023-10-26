<template>
    <div ref="room" class="room">
        <div ref="chartDynamic" class="chartDynamic"></div>

        <div class="message scrollbar">
            <div class="item" v-for="(user) in chatUsers" :key="user['ctg_id']">
                <div>
                    <span>用户:{{ user['u_nick'] }}在{{ user['ctg_date'] }}发送了一个消息</span>
                </div>
            </div>
        </div>

        <div class="right">
            <div class="feedback">
                <img src="/src/assets/img/feedback.png" alt="">
                <div class="title">
                    <span>用户反馈</span>
                </div>
            </div>
            <div class="systemInfo">
                <span>备案号:冀ICP备2022008962</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getRoomChatMessageReq, getChatToGroup } from "../../api/index"
import * as echarts from 'echarts';


let chartDynamic = ref()


// 基于准备好的dom，初始化echarts实例

onMounted(() => {
    setTimeout(() => {
        initRoomDynamic()
    }, 300)
    getChatUser()
})

// 初始化图表
let roomChart;
let isFirst = true
function initRoomDynamic() {
    // 发送请求
    getRoomChatMessageReq().then(res => {

        if (res.data.length == 0) {
            return;
        }
        let yData = <any>[]
        let seriesData = <any>[]
        // 处理数据
        for (const room of res.data) {
            yData.push(room['r_name'])
            seriesData.push(room['count'])
        }
        let option = {
            tooltip: {},
            xAxis: {
                max: 'dataMax'
            },
            yAxis: {
                type: 'category',
                data: yData,
                inverse: true,
                animationDuration: 300,
                animationDurationUpdate: 300,
                // max: 2 // only the largest 3 bars will be displayed
            },
            series: [
                {
                    realtimeSort: true,
                    name: '近期热度',
                    type: 'bar',
                    data: seriesData,
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true
                    }
                }
            ],
            legend: {
                show: true
            },
            animationDuration: 3000,
            animationDurationUpdate: 3000,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear'
        }
        roomChart = echarts.init(chartDynamic.value);
        // 绘制图表
        function update() {
            getRoomChatMessageReq().then(res => {
                // 查出来的数据，根据初始化的数据位置修改data
                let data = option.series[0].data
                for (const room of res.data) {
                    if (yData.indexOf(room['r_name'] != -1)) {
                        data[yData.indexOf(room['r_name'])] = room['count']
                    } else {
                        data.push(room['count'])
                    }
                }
                roomChart.setOption(option);
            })
        }
        if (isFirst) {
            update()
            isFirst = false
        }
        setInterval(function () {
            update();
        }, 10000);
    })

}




// 获取近期聊天的用户
// 近期聊天的用户
let chatUsers = ref([])
function getChatUser() {
    getChatToGroup().then(res => {
        chatUsers.value = res.data
    })
}
setInterval(() => {
    getChatUser()
}, 5000)
</script>

<style lang="less" scoped>
.room {
    // height: 300px;
    padding: 30px;
    display: flex;

    >div {
        flex: 1;
    }

    .chartDynamic {
        height: 500px;
    }

    .message {
        height: 450px;
        box-sizing: border-box;
        overflow: auto;

        .item {
            text-align: center;
            margin: 10px;
            border-radius: 5px;
            cursor: default;
            padding: 5px;
            color: var(--import_more);

            &:hover {
                background-color: rgb(191, 198, 205);

            }
        }
    }

    .right {
        height: 500px;

        .feedback {
            margin: 0 auto;
            height: 200px;
            width: 200px;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
            text-align: center;
            border-radius: 10px;
            cursor: pointer;

            >img {
                height: 150px;
                width: 150px;
            }

            .title {
                height: 50px;
                font-size: 18px;
                line-height: 50px;
                text-align: center;
            }
        }

        .systemInfo {
            margin: 0 auto;
            height: 200px;
            line-height: 200px;
            width: 200px;
            text-align: center;
        }

    }
}
</style>