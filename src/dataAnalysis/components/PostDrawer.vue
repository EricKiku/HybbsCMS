<template>
    <div class="post">
        <div class="title">
            <img src="@/assets/img/titleBg.png" alt="">
            <div>{{ post['p_title'] }}</div>
        </div>
        <div class="content">
            <div class="user">
                <img class="uavatar" :src="gStore.getimgURL() + post['u_avatar']" alt="">
                <div class="nick">
                    {{ post['u_nick'] }}
                </div>
                <div class="floorLord">楼主</div>
                <img class="more" src="@/assets/img/userMoreInfo.png" alt="">
                <div class="date">
                    {{ post['p_date'] }}
                </div>
            </div>
            <div class="message">
                {{ post['p_content'] }}
            </div>
        </div>
    </div>
    <div class="replys">
        <div class="replyItem" v-for="(reply) in replysData" :key="reply['r_id']">
            <div class="user">
                <img class="uavatar" :src="gStore.getimgURL() + reply['u_avatar']" alt="">
                <div class="nick">
                    {{ reply['u_nick'] }}
                </div>
                <div class="floorLord" v-show="reply['u_id'] == post['p_lz']">楼主</div>
                <img class="more" src="@/assets/img/userMoreInfo.png" alt="">
                <div class="reply_date">
                    <span>{{ reply['r_date'] }}</span>
                </div>
            </div>
            <div class="message">
                {{ reply['r_content'] }}
                <div class="replyToreply" v-show="reply['lowerReply'].length != 0">
                    <div class="btn"
                        :style="{ backgroundColor: toReplyShow.indexOf(reply['r_id']) == -1 ? '#909399' : '#23a559' }"
                        @click="showToReply(reply['r_id'], reply['lowerReply'].length)">
                        <span v-show="toReplyShow.indexOf(reply['r_id']) == -1">显示回复</span>
                        <span v-show="toReplyShow.indexOf(reply['r_id']) != -1">隐藏回复</span>
                    </div>
                    <div class="replyContent"
                        :style="{ height: toReplyShow.indexOf(reply['r_id']) == -1 ? '0px' : toReplyItemHeight[reply['r_id']] + 'px' }">
                        <div ref="item" class="item" v-for="(toreply) in reply['lowerReply']" :key="toreply['r_id']">
                            <div class="toreply_user">
                                <img :src="gStore.getimgURL() + toreply['u_avatar']" alt="">
                                <span>{{ toreply['u_nick'] }}</span>
                                <span class="toreply_date">{{ toreply['r_date'] }}</span>
                            </div>
                            <div class="toreply_content">
                                {{ toreply['r_content'] }}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { globalStore } from "@/global/gStore"
import { getReplysReq } from "../api/index"
import { replyHandle } from "@/tools/tFun"
let props = defineProps(["post"])
const gStore = globalStore()
onMounted(() => {
    console.log("post:", props.post);
    // 获取回复方法
    getReply(props.post['p_id'])
})

// 回复数据
let replysData = ref<any>([])
// 获取回复
function getReply(p_id) {
    getReplysReq(p_id).then(res => {
        if (res.status == 200) {
            let handleReplys = replyHandle(res.data)
            console.log(handleReplys);

            replysData.value = handleReplys
        }
    })
}


// 显示回复的回复
let toReplyShow = ref<any>([])
// 整体toReplyItemDOM高度
let toReplyItemHeight = ref<any>({})
// 获取dom
const item = ref()
// 显示回复方法
function showToReply(id, length) {
    // 计算高度
    let itemHeight = item.value[0].offsetHeight;
    toReplyItemHeight.value[id] = itemHeight * length
    // 判断显示数组中有没有id
    if (toReplyShow.value.indexOf(id) == -1) {
        toReplyShow.value.push(id)
    } else {
        toReplyShow.value = [...toReplyShow.value.slice(0, toReplyShow.value.indexOf(id)), ...toReplyShow.value.slice(toReplyShow.value.indexOf(id) + 1, toReplyShow.value.length)]
    }
    console.log(toReplyShow.value);

}
</script>

<style lang="less" scoped>
.post {
    >.title {
        width: 100%;
        height: 30px;

        >img {
            width: 300px;
            position: absolute;
            z-index: 0;
            height: 30px;
            left: 50%;
            transform: translateX(-50%);
        }

        >div {
            height: 30px;
            width: 300px;
            text-align: center;
            color: #23a559;
            line-height: 30px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            /* 强制不换行 */
            white-space: nowrap;
            /* 文字用省略号代替超出的部分 */
            text-overflow: ellipsis;
            /* 匀速溢出内容，隐藏 */
            overflow: hidden;
            z-index: 1;
        }
    }

    .content {
        margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dotted #ccc;

        >.user {
            height: 40px;
            // line-height: 40px;
            display: flex;

            >.uavatar {
                height: 40px;
                width: 40px;
                border-radius: 3px;
                margin-right: 20px;
            }

            .nick {
                font-weight: bold;
                line-height: 40px;
            }

            .floorLord {
                margin: 0px 5px;
                color: white;
                height: 20px;
                line-height: 20px;
                padding: 0px 5px;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 4px;
                font-size: 14px;
                background-color: var(--elementui_bg);
            }

            .more {
                height: 20px;
                width: 20px;
                // position: relative;
                // top: 50%;
                // transform: translateY(-50%);
                margin-top: 10px;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    transform: rotate(180deg);
                }
            }

            .date {
                line-height: 40px;
                margin-left: 10px;
                font-size: 14px;
                color: #909399;
            }
        }

        .message {
            padding: 10px;
            line-height: 20px;
            border: 2px solid #23a559;
            letter-spacing: 2px;
            margin-top: 5px;
            font-family: "黑体";
        }
    }
}

.replys {
    >.replyItem {
        margin: 10px 0px;
        border: 1px dotted #23a559;
        transition: all 0.3s;

        &:hover {
            background-color: #f8f5f5;
        }

        >.user {
            height: 30px;
            // line-height: 40px;
            display: flex;
            padding-left: 10px;
            padding-top: 5px;

            >.uavatar {
                height: 30px;
                width: 30px;
                border-radius: 3px;
                margin-right: 20px;
            }

            .nick {
                line-height: 30px;
                color: #909399;
            }

            .floorLord {
                margin: 0px 5px;
                color: white;
                height: 20px;
                line-height: 20px;
                padding: 0px 5px;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 4px;
                font-size: 14px;
                background-color: var(--elementui_bg);
            }

            .more {
                height: 20px;
                width: 20px;
                margin-left: 10px;
                margin-top: 5px;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    transform: rotate(180deg);
                }
            }

            .reply_date {
                flex: 1;
                color: #909399;
                font-size: 14px;
                line-height: 30px;
                text-align: right;
                padding-right: 15px;
            }
        }

        >.message {
            padding: 10px;
            line-height: 20px;

            letter-spacing: 2px;
            margin-top: 5px;
            font-family: "黑体";

            .replyToreply {
                margin-top: 10px;
                user-select: none;

                .btn {
                    display: inline;
                    background-color: #909399;
                    padding: 5px;
                    color: white;
                    font-size: 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    position: relative;
                    left: 90%;

                    transition: all 0.3s;

                    &:hover {
                        background-color: #23a559;
                    }
                }

                .replyContent {
                    padding-left: 10px;
                    transition: all 0.3s;
                    overflow: hidden;

                    >.item {
                        padding-top: 5px;
                        padding-bottom: 5px;
                        padding: 5px 0px;
                        border-bottom: 1px dotted #ccc;
                        transition: all 0.3s;

                        &:hover {
                            background-color: #e0ebe4;
                        }

                        >.toreply_user {
                            height: 20px;
                            display: flex;

                            >img {
                                height: 20px;
                                width: 20px;
                                border-radius: 3px;
                            }

                            >span {
                                line-height: 20px;
                                font-size: 12px;
                                color: #909399;
                                padding-left: 10px;
                            }

                            >.toreply_date {
                                flex: 1;
                                text-align: right;
                            }
                        }

                        >.toreply_content {
                            color: #474747;
                            font-size: 12px;
                        }


                    }
                }
            }
        }
    }

}
</style>