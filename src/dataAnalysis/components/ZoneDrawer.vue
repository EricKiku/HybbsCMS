<template>
    <div class="drawer scrollbar">
        <div class="zoneMsg">
            <div class="img">
                <img :src="zoneImgPath" alt="">
            </div>
            <div class="zone">
                <div class="name">
                    {{ zone['z_name'] }}
                </div>
                <div class="introduce" :title="zone['z_introduce']">
                    {{ zone['z_introduce'] }}
                </div>
            </div>
            <div class="lottie">
                <div ref="zoneLottie" class="img"></div>
            </div>
        </div>
        <div class="posts">
            <div class="title">
                <div>
                    <div class="content">帖子</div>
                    <div class="img">
                        <img @click="changePostsExtend"
                            :style="{ transform: !postsExtend ? 'rotate(180deg)' : 'rotate(0deg)' }"
                            src="@/assets/img/draw_posts.png" alt="">
                    </div>
                </div>

            </div>
            <div class="bottomLine"></div>
            <div class="posts_list scrollbar"
                :class="{ posts_list_unextend: !postsExtend, posts_list_extend: postsExtend }">
                <div class="table_head">
                    <div class="col">ID</div>
                    <div class="col">标题</div>
                    <div class="col">内容</div>
                    <div class="col">创建时间</div>
                    <div class="col">回复数</div>
                </div>
                <div v-show="postLoading" class="status postLoading">
                    <div ref="postLoadingDom"></div>
                </div>
                <div v-show="postEmpty" class="status empty">
                    <div ref="emptyDom"></div>
                    <div class="text">
                        空空如也
                    </div>
                </div>
                <div class="posts_item" v-for="(post) in posts.slice((currentPage - 1) * 10, currentPage * 10)"
                    :key="post['p_id']" @click="toPostDetail(post)">
                    <div>{{ post['p_id'] }}</div>
                    <div :title="post['p_title']">{{ post['p_title'] }}</div>
                    <div class="content" :title="post['p_content']">{{ post['p_content'] }}</div>
                    <div class="date">{{ post['p_date'] }}</div>
                    <div class="date">{{ post['p_reply'] }}</div>
                </div>
                <!-- 分页组件 -->
                <Pagination v-if="paginationVisual" :pageSize="pageSize" @changeCurrentPage="changeCurrentPage"
                    :total="total"></Pagination>
            </div>
        </div>

        <!-- 扇形图 * 2 -->
        <div class="fanDiagram">

            <!-- 分区占全部分区帖子总数百分比 -->
            <div>
                <div class="title">
                    ({{ zone['z_name'] }})占全部分区帖子数量图
                </div>
                <div class="percentcharts postPercent" ref="postPercent"></div>
            </div>
            <!-- 分区关注数占全部分区关注数百分比 -->
            <div>
                <div class="title">
                    ({{ zone['z_name'] }})占全部分区关注数量图
                </div>
                <div class="percentcharts followPerceng" ref="followPerceng"></div>
            </div>
        </div>

        <!-- 折线图 -->
        <div class="postPublish">
            <div class="title">
                ({{ zone['z_name'] }})帖子发布频率图
            </div>
            <div ref="postMessageChart" class="chart"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect, onUpdated } from "vue"
import { getPostsReq, getzonesPostsAndFollowsReq, getPostMessageReq } from "../api/index"
import { useRouter, useRoute } from "vue-router"
import { globalStore } from "@/global/gStore"
import lottie from "lottie-web";
import zoneJson from "@/assets/json/zone"
import postLoadJson from "@/assets/json/loading"
import emptyJson from "@/assets/json/empty"
import Pagination from "./Pagination.vue";
import * as echarts from 'echarts';
const props = defineProps(['zone'])
const gStore = globalStore()
const zoneLottie = ref()
const router = useRouter()
const route = useRoute()

// 接收的分区对象
let zone = ref(props.zone)
// 图片路径
let zoneImgPath = ref("")

// 图片渲染dom对象
const postLoadingDom = ref()
const emptyDom = ref()
const postMessageChart = ref()
onMounted(() => {
    if (!zone.value['z_id']) {
        console.log("接收失败");
    } else {
        zoneImgPath.value = gStore.getimgURL() + zone.value['z_icon']
    }

    // 渲染lottie图片
    lottie.loadAnimation({
        container: zoneLottie.value,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: zoneJson
    })
    lottie.loadAnimation({
        container: postLoadingDom.value,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: postLoadJson
    })
    lottie.loadAnimation({
        container: emptyDom.value,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: emptyJson
    })
    // 获取分区的帖子
    regreshPosts()
    // 获取帖子发布频率
    getPostsMessage()
})

// 分区帖子s

// 分页数据
let paginationVisual = ref(false)
let total = ref(0)
// 每页多少条
let pageSize = ref(10)
let currentPage = ref(1)
function changeCurrentPage(value) {
    currentPage.value = value
}


// 是否展开
let postsExtend = ref(false)
// 切换展开
function changePostsExtend() {
    postsExtend.value = !postsExtend.value
}
// 帖子
let posts = ref([])
// 展示的10条内容
let showPosts = ref()
// 加载状态
let postLoading = ref(false)
// 是否为空post
let postEmpty = ref(false)
// 获取帖子(刷新)
function regreshPosts() {
    // 加载
    postLoading.value = true
    getPostsReq(props.zone['z_id']).then(res => {
        if (!res.data) {
            posts.value = []
            postEmpty.value = true
            return;
        }
        if (res.status == 200) {
            posts.value = res.data.reverse()
            // 展示10条
            showPosts.value = posts.value.slice(0 * 10, 1 * 10)
            // 
            total.value = res.data.length
            console.log("total:", total.value);
            paginationVisual.value = true
            // 调用方法以给接下来的图表提供数据
            getzonesPostsAndFollows()
        }
    }).finally(() => {
        postLoading.value = false;
    })
}
// 点击帖子跳转到帖子管理，并且携带参数
function toPostDetail(post) {
    router.push({
        name: "/analysis/post",
        query: {
            post: JSON.stringify(post)
        }
    })
}

// 该分区占全部分区的帖子数百分比和关注百分比
const postPercent = ref()
const followPerceng = ref()
// 获取 全部分区的帖子数和关注数
function getzonesPostsAndFollows() {
    getzonesPostsAndFollowsReq().then(res => {
        if (res.status == 200) {
            // 处理数据
            const zonePosts = zone.value['z_posts']
            const allZonesPosts = res.data['posts']
            const zoneFollows = zone.value['z_follows']
            const allZonesFollows = res.data['follows']
            const zoneName = zone.value['z_name']
            // 基于准备好的dom，初始化echarts实例
            var leftChart = echarts.init(postPercent.value);
            var rightChart = echarts.init(followPerceng.value);
            // 配置
            let leftOption = {
                legend: {
                    left: "left",
                    orient: "vertical"
                },
                tooltip: {
                    show: true
                },
                series: [
                    {
                        type: 'pie',
                        label: {
                            show: false
                        },
                        itemStyle: {
                            color: function (params) {
                                let color = ['#FFaa50', '#79dc7e']
                                return color[params.dataIndex]
                            }
                        },
                        // radius: ["40%", "75%"],
                        data: [
                            {
                                value: zonePosts,
                                name: zoneName + `[${zonePosts}](${parseInt((zonePosts / allZonesPosts) * 100 + '')}%)`
                            },
                            {
                                value: allZonesPosts - zonePosts,
                                name: '其他分区'
                            }
                        ]
                    }
                ]
            };
            let rightOption = {
                legend: {
                    left: "left",
                    orient: "vertical"
                },
                tooltip: {
                    show: true
                },
                series: [
                    {
                        type: 'pie',
                        label: {
                            show: false
                        },
                        itemStyle: {
                            color: function (params) {
                                let color = ['#FFaa50', '#79dc7e']
                                return color[params.dataIndex]
                            }
                        },
                        data: [
                            {
                                value: zoneFollows,
                                name: zoneName + `[${zoneFollows}](${parseInt((zoneFollows / allZonesFollows) * 100 + '')}%)`
                            },
                            {
                                value: allZonesFollows - zoneFollows,
                                name: '其他分区'
                            }
                        ]
                    }
                ]
            };
            // 绘制图表
            leftChart.setOption(leftOption);
            rightChart.setOption(rightOption);
        }
    })
}



// 帖子发布频率图表
// 获取分区的帖子发布频率数据
function getPostsMessage() {
    console.log("zone:", zone.value);
    getPostMessageReq(zone.value['z_id']).then(res => {
        console.log("postMessage:", res);
        if (res.status == 200) {
            // 处理数据
            let dates = <any>[]
            let values = <any>[]
            for (const msg of res.data) {
                console.log(msg);
                dates.push(msg['p_date'].split(" ")[0])
                values.push(msg['count'])
            }
            console.log("dates:", dates);
            console.log("values:", values);

            let postChart = echarts.init(postMessageChart.value)
            let option = {
                xAxis: {
                    type: 'category',
                    data: dates
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: values,
                        type: 'line',
                        label: {
                            show: true
                        },
                        tooltip: {
                            show: true
                        },
                        itemStyle: {
                            color: "#23aa27"
                        },
                        markPoint: {
                            data: [
                                { type: "max", name: "最大值" },
                                { type: "min", name: "最小值" }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: "average", name: "平均值" }
                            ]
                        }
                    }
                ]
            };
            postChart.setOption(option);
        }
    })
}
</script>

<style lang="less" scoped>
.drawer {

    // height: 100%;
    .zoneMsg {
        display: flex;
        position: relative;

        .img {
            >img {
                height: 80px;
                width: 80px;
                border-radius: 5px;
            }
        }

        >.zone {
            height: 80px;
            width: 200px;
            display: flex;
            flex-direction: column;
            text-align: center;

            .name {
                flex: 1;
                line-height: 40px;
                color: var(--import_more);
                font-weight: bold;

                &::before {
                    content: '';
                    display: block;
                    position: relative;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 150px;
                    height: 1px;
                    background-color: var(--import_more_dark);
                }
            }

            .introduce {
                flex: 1;
                line-height: 40px;
                color: #656565;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;
            }
        }

        .lottie {
            flex: 1;
            display: flex;
            justify-content: right;

            >.img {
                height: 80px;
                width: 80px;
            }
        }

        // &::before {
        //     content: '';
        //     display: block;
        //     position: absolute;
        //     top: 100%;
        //     // left: 50%;
        //     // transform: translateX(-50%);
        //     width: 100%;
        //     height: 2px;
        //     background-color: rgb(100, 113, 254);
        // }
    }

    .posts {
        margin-top: 20px;

        >.title {
            position: relative;
            height: 30px;

            // box-sizing: border-box;
            >div {
                display: flex;

                .content {
                    box-sizing: border-box;
                    line-height: 20px;
                    height: 30px;
                    padding-top: 5px;
                    padding-left: 5px;
                    padding-right: 5px;
                    border-radius: 5px;
                    border-bottom-left-radius: 0px;
                    border-bottom-right-radius: 0px;
                    border-top-right-radius: 0px;
                    background-color: rgb(32, 170, 39);
                    color: white;
                }

                >.img {
                    box-sizing: border-box;
                    height: 30px;
                    padding-top: 5px;
                    padding-left: 5px;
                    padding-right: 5px;
                    padding-right: 10px;
                    background-color: rgb(32, 170, 39);
                    border-top-right-radius: 5px;

                    >img {
                        height: 20px;
                        width: 20px;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                }
            }
        }

        .bottomLine {
            height: 2px;
            background-color: rgb(32, 170, 39);
        }

        .posts_list_unextend {
            height: 0px;
        }

        .posts_list_extend {
            height: 500px;
        }

        .posts_list {
            transition: all 0.3s;
            overflow: hidden;
            box-sizing: border-box;
            border-left: 3px dotted rgb(32, 170, 39);
            position: relative;

            &::before {
                content: "";
                display: block;
                position: absolute;
                height: 10px;
                width: 10px;
                border-radius: 50%;
                background-color: rgb(32, 170, 39);
                left: 0px;
                transform: translateX(-50%);
                bottom: 0px;
            }

            .table_head {
                height: 20px;
                display: flex;
                justify-content: left;
                background-color: rgb(32, 170, 39);
                color: white;
                box-sizing: border-box;
                border-left: 3px solid rgb(32, 170, 39);

                >div {
                    flex: 1;
                    line-height: 20px;
                    text-align: center;
                }
            }

            .status {
                height: 420px;

                >div {
                    height: 300px;
                    width: 300px;
                    position: relative;
                    left: 50%;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%);
                }
            }

            .empty {
                .text {
                    text-align: center;
                    margin-top: -30px;
                    color: #656565;
                }
            }

            .posts_item {
                height: 40px;
                /* 强制不换行 */
                // white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;
                display: flex;
                box-sizing: border-box;
                user-select: none;
                cursor: pointer;
                transition: all 0.2s;

                &:nth-child(even) {
                    background-color: aliceblue;
                }

                &:hover {
                    background-color: rgb(164, 252, 169);
                }

                >div {
                    flex: 1;
                    line-height: 40px;
                    text-align: center;
                }

                .content {
                    color: #656565;
                    overflow: hidden;
                }

                .date {
                    color: #656565;
                }
            }
        }
    }

    .fanDiagram {
        margin-top: 30px;
        display: flex;
        height: 300px;

        >div {
            flex: 1;
            position: relative;

            >.title {
                box-sizing: border-box;
                border: 3px solid #5865f5;
                position: absolute;
                padding: 5px;
                border-radius: 5px;
                font-weight: bold;
                color: #656565;
                margin-bottom: 20px;
            }

            >.percentcharts {
                margin-top: 40px;
                height: 100%;
                width: 100%;
            }
        }
    }

    .postPublish {
        margin-top: 30px;
        height: 300px;
        position: relative;

        >.title {
            box-sizing: border-box;
            border: 3px solid #5865f5;
            position: absolute;
            padding: 5px;
            border-radius: 5px;
            font-weight: bold;
            color: #656565;

        }

        >.chart {
            margin-top: 30px;
            height: 100%;
        }
    }
}
</style>