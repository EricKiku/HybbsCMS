<template>
    <div class="admin">
        <div class="adminebox super">
            <div class="title"><span>超级管理员</span></div>
            <div style="height: 30px;line-height: 30px;">
                <img class="roleIcon" src="/src/assets/img/superadminer.png" alt="">
                <img class="moreOption" title="点击查看更多数据" src="/src/assets/img/superOption.png">
            </div>
            <div class="loading" v-show="loading">
                <img src="/src/assets/img/adminerBoxLoading.gif">
            </div>
            <div class="table" v-show="!loading">
                <div class="title">
                    <div>编号</div>
                    <div>昵称</div>
                    <div>权限</div>
                </div>
                <div class="list scrollbar">
                    <div class="item" v-for="(adminer) in superadminers" :key="adminer['u_id']">
                        <div class="code">{{ adminer['u_code'] }}</div>
                        <div class="nick">{{ adminer['u_name'] }}</div>
                        <div class="role"><el-tag class="ml-2" type="warning">{{ adminer['u_permissions'] }}</el-tag></div>
                    </div>
                </div>

            </div>
        </div>
        <div class="adminebox adminer">
            <div class="title">管理员</div>
            <div style="height: 30px;line-height: 30px;">
                <img class="roleIcon" src="/src/assets/img/adminerico.png" alt="">
                <img class="moreOption" title="点击查看更多数据" src="/src/assets/img/adminOption.png" alt="">
            </div>
            <div class="loading" v-show="loading">
                <img src="/src/assets/img/adminerBoxLoading.gif">
            </div>
            <div class="table" v-show="!loading">
                <div class="title">
                    <div>编号</div>
                    <div>昵称</div>
                    <div>权限</div>
                </div>
                <div class="list scrollbar">
                    <div class="item" v-for="(adminer) in adminers" :key="adminer['u_id']">
                        <div class="code">{{ adminer['u_code'] }}</div>
                        <div class="nick">{{ adminer['u_name'] }}</div>
                        <div class="role"><el-tag>{{ adminer['u_permissions'] }}</el-tag></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="adminebox visitor">
            <div class="title">用户</div>
            <div style="height: 30px;line-height: 30px;">
                <img class="roleIcon" src="/src/assets/img/visitor.png" alt="">
                <img class="moreOption" title="点击查看更多数据" src="/src/assets/img/visitorOption.png" alt="">
            </div>
            <div class="loading" v-show="loading">
                <img src="/src/assets/img/adminerBoxLoading.gif">
            </div>
            <div class="table" v-show="!loading">
                <div class="title">
                    <div>编号</div>
                    <div>昵称</div>
                    <div>权限</div>
                </div>
                <div class="list scrollbar">
                    <div class="item" v-for="(adminer) in visitors" :key="adminer['u_id']">
                        <div class="code">{{ adminer['u_code'] }}</div>
                        <div class="nick">{{ adminer['u_name'] }}</div>
                        <div class="role"> <el-tag class="ml-2" type="success">{{ adminer['u_permissions'] }}</el-tag></div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getAdminersReq } from "../../api/index"

onMounted(() => {
    getAdminers()
})
let superadminers = ref<any>([])
let adminers = ref<any>([])
let visitors = ref<any>([])
// 加载
let loading = ref(false)
// 获取所有用户
function getAdminers() {
    loading.value = true
    superadminers.value = []
    adminers.value = []
    visitors.value = []
    getAdminersReq().then(res => {
        superadminers.value = []
        adminers.value = []
        visitors.value = []
        console.log(res);
        // 处理数据
        for (const user of res.data) {
            switch (user['u_permissions']) {
                case "superadmin":
                    superadminers.value.push(user)
                    break;
                case "admin":
                    adminers.value.push(user)
                    break;
                case "visitor":
                    visitors.value.push(user)
                    break;
                default:
                    console.log("不能识别的role");
                    break;
            }
        }
    }).finally(() => { loading.value = false })
}
</script>

<style lang="less" scoped>
.admin {
    display: flex;
    width: 100%;
    height: 200px;
    margin-top: 30px;
    user-select: none;

    .adminebox {
        flex: 1;
        margin: 10px 30px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 10px;
        padding: 20px;
        position: relative;

        >.title {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
            font-family: "黑体";
            position: absolute;
            font-weight: bold;
            margin-left: 30px;

            &::before {
                content: '';
                display: block;
                height: 8px;
                position: absolute;
                bottom: 20%;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                z-index: -1;
                border-radius: 5px;
            }
        }

        .roleIcon {
            height: 20px;
            width: 20px;
            margin-top: 5px;
        }

        .moreOption {
            position: absolute;
            right: 20px;
            margin-top: 5px;
            cursor: pointer;
            z-index: 1;
        }

        .loading {
            height: 110px;
            text-align: center;
            line-height: 110px;

            >img {
                height: 30px;
                // width: 20px;
                vertical-align: middle;
            }
        }

        .table {
            box-sizing: border-box;
            height: 110px;

            .title {
                display: flex;
                text-align: center;
                height: 18px;
                line-height: 18px;
                box-sizing: border-box;

                div {
                    flex: 1;
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                }

                >div:nth-child(1) {
                    &::after {
                        content: "";
                        height: 2px;
                        width: 50%;
                        position: absolute;
                        top: 50%;
                        // left: 50%;
                        transform: translateY(-50%);
                        z-index: -1;
                        background-color: var(--import_more);
                    }
                }

                >div:nth-child(2) {
                    &::before {
                        content: "";
                        height: 2px;
                        width: 39%;
                        position: absolute;
                        top: 50%;
                        left: 0%;
                        transform: translateY(-50%);
                        z-index: -1;
                        background-color: var(--import);
                    }

                    &::after {
                        content: "";
                        height: 2px;
                        width: 50%;
                        position: absolute;
                        top: 50%;

                        transform: translateY(-50%);
                        z-index: -1;
                        background-color: var(--import);
                    }
                }

                >div:nth-child(3) {
                    &::before {
                        content: "";
                        height: 2px;
                        width: 39%;
                        position: absolute;
                        top: 50%;
                        left: 0%;
                        transform: translateY(-50%);
                        z-index: -1;
                        background-color: var(--import_less);
                    }
                }
            }

            .list {
                box-sizing: border-box;
                height: 92px;
                overflow: auto;
                font-family: "黑体";

                .item {
                    display: flex;
                    height: 20px;
                    padding: 5px;
                    border: 5px;
                    line-height: 20px;
                    border-radius: 5px;

                    >div {
                        flex: 1;
                        text-align: center;
                    }

                    &:hover {
                        background-color: rgb(223, 239, 253);
                    }
                }
            }

        }
    }

    .super {
        >.title {
            &::before {
                background-color: var(--import_more);
            }
        }
    }

    .adminer {
        >.title {
            &::before {
                background-color: var(--import);
            }
        }
    }

    .visitor {
        >.title {
            &::before {
                background-color: var(--import_less);
            }
        }
    }
}
</style>