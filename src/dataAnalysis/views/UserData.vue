<template>
    <PicturePreview @close="closePreviewPicture" v-if="imgPath" :imgPath="imgPath"></PicturePreview>
    <div class="analysisData">
        <div class="title">用户管理</div>
        <div class="options">
            <div class="refresh">
                <img src="@/assets/img/userRefresh.png" alt="">
                <div>
                    <span>刷新</span>
                </div>
            </div>
        </div>
        <div class="table">
            <div class="table_head">
                <div class="head_item sort" @click="sort('id')">
                    ID
                    <img v-show="sortType == 'no' || sortKey != 'id'" src="@/assets/img/sort.png" alt="">
                    <img v-show="sortType == 'asc' && sortKey == 'id'" src="@/assets/img/sort-up.png" alt="">
                    <img v-show="sortType == 'desc' && sortKey == 'id'" src="@/assets/img/sort-down.png" alt="">
                </div>
                <div class="head_item">头像</div>
                <div class="head_item">昵称</div>
                <div class="head_item">邮箱</div>
                <div class="head_item sort" @click="sort('lv')">
                    等级
                    <img v-show="sortType == 'no' || sortKey != 'lv'" src="@/assets/img/sort.png" alt="">
                    <img v-show="sortType == 'asc' && sortKey == 'lv'" src="@/assets/img/sort-up.png" alt="">
                    <img v-show="sortType == 'desc' && sortKey == 'lv'" src="@/assets/img/sort-down.png" alt="">
                </div>
                <div class="head_item sort" @click="sort('fensi')">粉丝
                    <img v-show="sortType == 'no' || sortKey != 'fensi'" src="@/assets/img/sort.png" alt="">
                    <img v-show="sortType == 'asc' && sortKey == 'fensi'" src="@/assets/img/sort-up.png" alt="">
                    <img v-show="sortType == 'desc' && sortKey == 'fensi'" src="@/assets/img/sort-down.png" alt="">
                </div>
                <div class="head_item sort" @click="sort('date')">登录天数
                    <img v-show="sortType == 'no' || sortKey != 'date'" src="@/assets/img/sort.png" alt="">
                    <img v-show="sortType == 'asc' && sortKey == 'date'" src="@/assets/img/sort-up.png" alt="">
                    <img v-show="sortType == 'desc' && sortKey == 'date'" src="@/assets/img/sort-down.png" alt="">
                </div>
            </div>
            <div class="table_data scrollbar">
                <div class="table_item" v-for="(user) in users" :key="user['u_id']">
                    <div class="col">
                        <span>{{ user['u_id'] }}</span>
                    </div>
                    <div class="col">
                        <img @click="openPicturePreview(user['u_avatar'])" :src="gStore.getimgURL() + user['u_avatar']"
                            alt="">
                    </div>
                    <div class="col nick">
                        <span>{{ user['u_nick'] }}</span>
                    </div>
                    <div class="col email">
                        <span>{{ user['u_email'] }}</span>
                    </div>
                    <div class="col lv">
                        <span>{{ user['u_lv'] }}</span>
                    </div>
                    <div class="col">
                        <span>{{ user['u_fensi'] }}</span>
                    </div>
                    <div class="col">
                        <span>{{ user['u_signin_count'] }}</span>
                    </div>
                </div>
            </div>
            <Pagination v-if="paginationVisual" :total="total || 0" @changeCurrentPage="changeCurrentPage"></Pagination>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getUserReq } from "../api/index"
import { message, BubbleSort } from "@/tools/tFun"
import { globalStore } from "@/global/gStore"
import Pagination from "../components/Pagination.vue"
import PicturePreview from "../components/PicturePreview.vue"
const gStore = globalStore()
onMounted(() => {
    refreshUser()
})

const users = ref([])

// 获取用户（刷新）
function refreshUser() {
    getUserReq().then(res => {
        if (res.status == 200) {
            users.value = res.data.reverse()

            // 初始化分页组件
            initPagination()
        } else {
            message(2, "获取失败")
        }
    })
}

// 图片预览
let imgPath = ref("")
// 打开预览
function openPicturePreview(path) {
    imgPath.value = path
}
// 关闭预览
function closePreviewPicture() {
    imgPath.value = ""
}


// 排序
// 按什么排序：id/date/post/follow/no
let sortKey = ref("")
// 升序？降序？:asc/desc/no。默认为no不排序
let sortType = ref("no")
// 排序方法
function sort(sortKeyValue) {
    // 先切换排序类型
    switch (sortType.value) {
        case 'no':
            sortType.value = 'asc';
            break;
        case 'asc':
            sortType.value = 'desc';
            break;
        case 'desc':
            sortType.value = 'no';
            break;
    }
    // 切换排序字段
    sortKey.value = sortKeyValue

    // 排序
    switch (sortKey.value) {
        case 'id':
            users.value = BubbleSort(users.value, sortType.value, 'u_id');
            break;
        case 'lv':
            users.value = BubbleSort(users.value, sortType.value, 'u_lv');
            break;
        case 'fensi':
            users.value = BubbleSort(users.value, sortType.value, 'u_fensi');
            break;
        case 'date':
            users.value = BubbleSort(users.value, sortType.value, 'u_signin_count');
            break;
        default:
            break;
    }

}




// 分区组件
let paginationVisual = ref(false)
let total = ref(0)
let currentPage = ref(0)
// 初始化分页组件
function initPagination() {
    total.value = users.value.length
    paginationVisual.value = true
}
// 切换页数触发
function changeCurrentPage(value) {
    currentPage.value = value
}
</script>

<style lang="less" scoped>
.options {
    margin-top: 20px;
    height: 32px;
    padding: 20px 0px;

    .refresh {
        background-color: var(--elementui_bg);
        width: 70px;
        height: 100%;
        padding: 0px 5px;
        display: flex;
        border-radius: 5px;
        user-select: none;
        cursor: pointer;

        &:hover {
            background-color: var(--elementui_bg_hover);
        }

        >img {
            height: 20px;
            width: 20px;
            margin-top: 5px;
        }

        >div {
            flex: 1;
            line-height: 30px;
            text-align: center;
            color: white;
            font-size: 16px;
            font-family: "黑体";
        }
    }
}

.table {

    >.table_head {
        height: 40px;
        display: flex;

        >.sort {
            cursor: pointer;
            >img{
                vertical-align: middle;
                margin-top: -4px;
            }
        }

        >.head_item {
            line-height: 40px;
            flex: 1;
            text-align: center;
            color: #909399;
            font-size: 16px;
            font-family: "黑体";
            border-bottom: 1px solid #b3b3b3;
            user-select: none;
        }
    }

    .table_data {
        height: 600px;
        overflow: auto;

        >.table_item {
            display: flex;
            height: 40px;
            padding: 5px 0px;
            border-bottom: 0.5px solid #e6e6e6c8;

            &:nth-child(even) {
                background-color: #e6e6e6c8;
            }

            >.col {
                flex: 1;
                text-align: center;
                line-height: 40px;
                color: #909399;

                >img {
                    height: 30px;
                    width: 30px;
                    vertical-align: middle;
                    border-radius: 4px;
                    cursor: pointer;
                }

            }

            >.nick {
                color: var(--elementui_bg);
            }

            >.email {
                color: rgb(120, 71, 16);
            }

            >.lv {
                color: rgb(219, 147, 159);
            }
        }
    }
}
</style>