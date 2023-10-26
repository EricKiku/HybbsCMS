<template>
    <PicturePreview @close="closePreviewPicture" v-if="imgPath" :imgPath="imgPath"></PicturePreview>

    <el-dialog v-model="newZoneDiaVisual">

    </el-dialog>
    <el-drawer v-model="drawerVisual" :with-header="false" direction="rtl" size="35%">
        <PostDrawer v-if="drawerVisual" :post="post"></PostDrawer>
    </el-drawer>
    <!-- 删除对话框 -->
    <el-dialog width="30%" class="deleteDia" v-model="deleteDiaVisual" title="删除警告">
        <div class="content">
            <img src="/src/assets/img/warn.png" alt="">
            <span>确定要删除该数据吗？操作不可逆(将会删除涉及该数据的其他数据)</span>

        </div>
        <div class="buttons">
            <button @click="deletePost">确定</button>
        </div>
    </el-dialog>
    <div class="zoneData analysisData">
        <div class="title">
            帖子管理
        </div>
        <div class="options">
            <el-button type="primary" @click="getPosts" :icon="Refresh">刷新</el-button>
            <div class="line"></div>
            <input class="searchInput" v-model="keyWords" @keydown.enter="searchZones" type="text"
                placeholder="Please enter the search keyword">
            <div class="searchBtn" @click="searchZones" title="点击搜索">
                <img src="/src/assets/img/search.png" alt="">
            </div>
            <!-- <div class="sort">
                <div>
                    <img src="@/assets/img/sort.png" alt="">
                    <span>排序:</span>
                </div>
                <select>
                    <option value="no" label="默认"></option>
                    <option value="id" label="分区ID"></option>
                    <option value="date" label="创建时间"></option>
                    <option value="post" label="帖子数量"></option>
                    <option value="follow" label="关注数量"></option>
                </select>
            </div> -->
            <!-- <div class="line"></div> -->
            <el-tag type="info" class="mx-1" effect="plain" round>
                点击表格某行可以查看更多数据
            </el-tag>
            <el-tag @click="cancelEditStatusing" v-show="editStatusing" class="statusTag mx-1" effect="plain" round
                title="取消编辑状态">
                正在编辑(点击取消)
            </el-tag>
            <el-tag @click="cancelDeleteStatusing" v-show="deleteStatusing" type="danger" class="statusTag mx-1"
                effect="plain" round title="取消删除状态">
                正在删除(点击取消)
            </el-tag>
        </div>
        <div class="message">
            <div class="table ">
                <div class="table_head">
                    <div style="width: 40px;"></div>
                    <!-- <div class="headItem">分区图标</div> -->
                    <div class="sort headItem" @click="sort('id')">
                        ID
                        <img v-show="sortType == 'no' || sortKey != 'id'" src="@/assets/img/sort.png" alt="">
                        <img v-show="sortType == 'asc' && sortKey == 'id'" src="@/assets/img/sort-up.png" alt="">
                        <img v-show="sortType == 'desc' && sortKey == 'id'" src="@/assets/img/sort-down.png" alt="">
                    </div>
                    <div class="headItem">title</div>
                    <div class="headItem">内容</div>
                    <div class="sort headItem" @click="sort('date')">创建时间
                        <img v-show="sortType == 'no' || sortKey != 'date'" src="@/assets/img/sort.png" alt="">
                        <img v-show="sortType == 'asc' && sortKey == 'date'" src="@/assets/img/sort-up.png" alt="">
                        <img v-show="sortType == 'desc' && sortKey == 'date'" src="@/assets/img/sort-down.png" alt="">
                    </div>
                    <div class="sort headItem" @click="sort('reply')">回复数
                        <img v-show="sortType == 'no' || sortKey != 'reply'" src="@/assets/img/sort.png" alt="">
                        <img v-show="sortType == 'asc' && sortKey == 'reply'" src="@/assets/img/sort-up.png" alt="">
                        <img v-show="sortType == 'desc' && sortKey == 'reply'" src="@/assets/img/sort-down.png" alt="">
                    </div>
                    <div class="headItem">楼主</div>
                    <div class="headItem">所属分区</div>
                    <div class="sort headItem" @click="sort('z_id')">
                        分区ID
                        <img v-show="sortType == 'no' || sortKey != 'z_id'" src="@/assets/img/sort.png" alt="">
                        <img v-show="sortType == 'asc' && sortKey == 'z_id'" src="@/assets/img/sort-up.png" alt="">
                        <img v-show="sortType == 'desc' && sortKey == 'z_id'" src="@/assets/img/sort-down.png" alt="">
                    </div>
                    <div class="headItem">分区图标</div>
                    <div class="headItem">操作</div>
                </div>
                <div class="loadingStyle">
                    <div ref="animation" class="animation" v-show="tableLoading">
                    </div>
                    <div class="msg" v-show="tableLoading">
                        正在努力获取数据...
                    </div>
                </div>
                <div class="loadingStyle">
                    <div ref="emptyAnimation" class="animation" v-show="(!tableLoading) && tableData.length == 0">
                    </div>
                    <div class="msg" v-show="(!tableLoading) && tableData.length == 0">
                        哦，竟然没有数据，会不会是搜索关键字有错误..
                    </div>
                </div>
                <div class="table_data scrollbar" v-show="(!tableLoading) && tableData.length != 0">

                    <div class="table_item" @click="showDrawer(post)"
                        v-for="(post) in tableData.slice((currentPage - 1) * 15, currentPage * 15)" :key="post['p_id']"
                        :class="{ editing: editStatusing && editedzId == post['p_id'], deleteing: deleteStatusing && deletedPId == post['p_id'] }"
                        @mouseenter="showTopIco(post['p_id'])">
                        <div class="top">
                            <img @click.stop="toTop(post['p_id'], true)"
                                v-show="topIcoVisualPId == post['p_id'] && post['p_top'] == 0" src="@/assets/img/top.png"
                                alt="" title="让该帖子在该分区置顶">
                            <img @click.stop="toTop(post['p_id'], false)"
                                v-show="topIcoVisualPId == post['p_id'] && post['p_top'] == 1" src="@/assets/img/notop.png"
                                alt="" title="取消置顶">
                            <img class="isTop" v-show="post['p_top'] == 1 && topIcoVisualPId != post['p_id']"
                                src="@/assets/img/postToTop.png" alt="">
                        </div>
                        <div class="col">{{ post['p_id'] }}</div>
                        <div class="col hidden ptitle">{{ post['p_title'] }}</div>
                        <div class="col hidden content">{{ post['p_content'] }}</div>
                        <div class="col hidden">{{ post['p_date'] }}</div>
                        <div class="col">{{ post['p_reply'] }}</div>
                        <div class="col nick">{{ post['u_nick'] }}</div>
                        <div class="col zname">{{ post['z_name'] }}</div>
                        <div class="col">{{ post['z_id'] }}</div>
                        <div class="col">
                            <img class="zoneImg" @click.stop="setPriviewPictureImgPath(post['z_icon'])"
                                :src="gStore.getimgURL() + post['z_icon']" alt="">
                        </div>
                        <div class="col op">
                            <button v-show="!(editStatusing && editedzId == post['p_id'])" class="deleteBtn"
                                @click.stop="openDeleteDia(post['p_id'])">删除</button>
                        </div>
                    </div>

                </div>
                <Pagination v-if="paginationVisual" :total="total || 0" @changeCurrentPage="changeCurrentPage"></Pagination>
            </div>
            <!-- <div class="zoneDetailData">
                <div class="head">
                    <el-tag v-if="!selectedZone" class="ml-2" size="large" type="info">从表格点击一个分区查看详细信息</el-tag>
                    <el-tag v-if="selectedZone" class="ml-2" size="large" type="success">分区:{{ selectedZoneName }}</el-tag>
                </div>
                <img src="../../assets/img/rightDetail.png" alt="">
            </div> -->
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { deletePostReq, deleteZoneReq, updateZone, toTopZoneReq, canceltoTopZoneReq, getAllPost, getPostsLikeReq, topOrNoTopReq } from "../api/index"
import { globalStore } from "../../global/gStore"
import { Refresh, CirclePlus } from '@element-plus/icons-vue'
import { useRouter, useRoute } from "vue-router"
import PicturePreview from "../components/PicturePreview.vue"
import Pagination from "../components/Pagination.vue"
import { message, BubbleSort } from "../../tools/tFun"
import lottie from "lottie-web";
import loadingJson from "@/assets/mp4/loading"
import emptyJson from "../../assets/mp4/empty.json"
import ZoneDrawer from "../components/ZoneDrawer.vue"
import { ElDrawer, ElMessageBox } from 'element-plus'
import PostDrawer from "../components/PostDrawer.vue"
const gStore = globalStore()
const router = useRouter()
const route = useRoute()
const animation = ref()
const emptyAnimation = ref()

onMounted(() => {
    gStore.setPagePath(route.meta.path)
    getPosts()
    lottie.loadAnimation({
        container: animation.value,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: loadingJson
    })

    lottie.loadAnimation({
        container: emptyAnimation.value,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: emptyJson
    })

    // 判断路由跳转过来有无参数
    if (route.query.post) {
        let post = JSON.parse(route.query.post + '')
        // 展开抽屉
        console.log("drawer:", post);

        showDrawer(post)
    }

})
// 加载方法
let tableLoading = ref(false)
// 获取所有帖子(刷新)
function getPosts() {
    tableLoading.value = true
    // 分页组件隐藏
    paginationVisual.value = false
    getAllPost().then(res => {
        if (res.status = 200) {
            // 初始化表格
            // initTableData(res.data.reverse())
            initTableData(res.data.reverse())
            // 初始化分页组件
            initPagination(res.data)
        }
    }).finally(() => { tableLoading.value = false })
}
// 表格数据
let tableData = ref([])
// 初始化表格数据
function initTableData(sourceData) {
    tableData.value = sourceData;
}

// 搜索功能
let keyWords = ref("")
function searchZones() {
    tableLoading.value = true
    // 分页组件隐藏
    paginationVisual.value = false
    getPostsLikeReq(keyWords.value).then(res => {
        if (res.data == null) {
            initTableData([])
            // 初始化分页组件
            initPagination([])
            return;
        }
        if (res.status = 200) {
            // // 初始化表格
            initTableData(res.data.reverse())
            // 初始化分页组件
            initPagination(res.data)
        }
    }).finally(() => { tableLoading.value = false })
}




// 表格图标预览
let imgPath = ref("")
function setPriviewPictureImgPath(path) {
    imgPath.value = path
}
// 图标预览管理，关闭预览
function closePreviewPicture() {
    imgPath.value = ""
}

// 分页数据
let paginationVisual = ref(false)
let total = ref(0)
let currentPage = ref(1)
// 初始化分页组件
function initPagination(data) {
    // 计算数据
    total = data.length
    paginationVisual.value = true
}
// 切换页面方法
function changeCurrentPage(value) {
    currentPage.value = value
}



// 新建分区对话框
let newZoneDiaVisual = ref(false)
// 打开
function showNewZoneDia() {
    newZoneDiaVisual.value = true
}



// 操作
// 更新的数据
let zName = ref("")
let zIntroduce = ref("")
// 编辑
// 是否在编辑状态
let editStatusing = ref(false)
// 正在对哪一行编辑
let editedzId = ref()
function enterEditStatus(z_id, z_name, z_introduce) {
    editStatusing.value = true
    editedzId.value = z_id
    zName.value = z_name;
    zIntroduce.value = z_introduce
}
// 取消编辑状态
function cancelEditStatusing() {
    editStatusing.value = false
}
// 发送更新请求
function update(z_id) {
    updateZone(z_id, zName.value, zIntroduce.value).then(res => {
        if (res.status == 200) {
            message(1, "修改成功")
            // 刷新
            getPosts()
        } else {
            message(2, "修改失败")
        }
    }, rej => {
        message(3, "服务器错误，请稍后重试")
    }).finally(() => { editStatusing.value = false })

    console.log("更新:", z_id, zName.value, zIntroduce.value);
}

// 显示置顶图标
let topIcoVisualPId = ref(0)
// 设置那个表格项显示置顶图标
function showTopIco(p_id) {
    topIcoVisualPId.value = p_id
}
// 发送置顶请求
function toTop(p_id, value) {
    topOrNoTopReq(p_id, value).then(res => {
        console.log(res);
        if (res.status == 200) {
            message(1, "操作成功")
            // 刷新 
            getPosts()
        } else {
            message(2, "操作失败")
        }
    }, rej => { message(3, "服务器错误，请稍后重试") })
}
// 取消置顶
function canceltoTopZone(z_id) {
    canceltoTopZoneReq(z_id).then(res => {
        console.log(res);
        if (res.status == 200) {
            message(1, "操作成功")
            // 刷新
            getPosts()
        } else {
            message(2, "操作失败")
        }
    }, rej => { message(3, "服务器错误，请稍后重试") })
}


// 删除
let deleteDiaVisual = ref(false)
// 删除状态
let deleteStatusing = ref(false)
// 要删除的zid
let deletedPId
// 打开删除对话框
function openDeleteDia(p_id) {
    // 
    deleteStatusing.value = true
    deletedPId = p_id
    deleteDiaVisual.value = true
}
// 取消删除状态
function cancelDeleteStatusing() {
    deleteStatusing.value = false
    deletedPId = 0
}
// 发送删除请求
function deletePost() {
    deletePostReq(deletedPId).then(res => {
        if (res.status == 200) {
            message(1, "删除成功")
            // 刷新表格
            getPosts()
        } else {
            message(2, "操作失败，请稍后重试")
        }
    }, rej => {
        message(3, "服务器错误")
    }).finally(() => { deleteDiaVisual.value = false, deleteStatusing.value = false })

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
    console.log(sortType.value);

    // 切换排序字段
    sortKey.value = sortKeyValue

    // 排序
    switch (sortKey.value) {
        case 'id':
            tableData.value = BubbleSort(tableData.value, sortType.value, 'p_id');
            break;
        case 'date':
            tableData.value = BubbleSort(tableData.value, sortType.value, 'p_date');
            break;
        case 'reply':
            tableData.value = BubbleSort(tableData.value, sortType.value, 'p_reply');
            break;
        case 'z_id':
            tableData.value = BubbleSort(tableData.value, sortType.value, 'z_id');
            break;
        default:
            break;
    }

}





// 抽屉
let drawerVisual = ref(false)
// 点击的分区
let post = ref()
// 显示抽屉
function showDrawer(value) {
    post.value = value
    drawerVisual.value = true
}
</script>

<style lang="less" scoped>
.el-drawer__body {}

.deleteDia {
    .content {
        height: 50px;
        line-height: 50px;

        >img {
            vertical-align: middle;
        }

        >span {
            padding-left: 10px;

        }
    }

    .buttons {
        height: 40px;
        text-align: right;

        button {
            cursor: pointer;
            height: 40px;
            width: 80px;
            border: none;
            outline: none;
            background-color: var(--import_more);
            color: white;
            border-radius: 5px;

            &:hover {
                background-color: var(--import_more_dark);
            }
        }
    }
}

.zoneData {
    .options {
        height: auto;
        padding: 20px 0px;
        display: flex;
        margin-top: 30px;
        box-sizing: border-box;

        >button,
        >input {
            height: 32px !important;
        }

        .line {
            width: 1px;
            height: 25px;
            position: relative;
            margin-top: 4px;
            margin-left: 5px;
            margin-right: 5px;
            background-color: rgb(64, 158, 255);
        }

        .searchInput {
            border: none;
            outline: none;
            height: auto;
            width: 200px;
            padding: 5px;
            box-sizing: border-box;
            border: 1px solid rgb(64, 158, 255);
            border-radius: 5px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }

        .searchBtn {
            background-color: rgb(64, 158, 255);
            text-align: center;
            position: relative;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            padding-left: 5px;
            padding-right: 5px;
            cursor: pointer;
            box-sizing: border-box;
            border: 2px solid rgb(64, 158, 255);
            transition: all 0.2s;

            &:hover {
                border: 2px solid rgb(48, 112, 177);
            }

            >img {
                user-select: none;
                -webkit-user-drag: none;
                height: 20px;
                width: 20px;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .el-tag {
            margin-top: 5px;
            margin-left: 50px;
        }

        .statusTag {
            user-select: none;
            cursor: pointer;
        }
    }

    .message {
        display: flex;
        user-select: none;

        // overflow: auto;
        video {
            height: 300px;
            width: 300px;
        }

        .table {
            // max-height: 600px;
            overflow: auto;
            width: 1600px;

            .table_head {
                display: flex;
                justify-content: space-between;
                height: 40px;
                line-height: 40px;
                box-sizing: border-box;
                border-bottom: 1px solid #e0e0e0;

                >.sort {
                    cursor: pointer;
                }

                >.headItem {
                    flex: 1;
                    text-align: center;
                    color: #909399;
                    font-size: 14px;
                    font-weight: bold;


                    >img {
                        vertical-align: middle;
                        margin-top: -4px;
                    }

                }
            }

            .loadingStyle {
                // height: 600px;

                .animation {
                    transition: all 0.3s;
                    height: 600px;
                }

                .msg {
                    text-align: center;
                    position: relative;
                    // left: 50%;
                    top: -20%;
                    color: #656565;
                    font-weight: bold;

                }
            }

            .table_data {
                width: 100%;
                height: 600px;
                overflow: auto;

                .table_item {
                    height: 40px;
                    line-height: 40px;
                    display: flex;
                    justify-content: space-between;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #e6e6e6c8;
                    transition: all 0.3s;

                    >.top {
                        height: 40px;
                        width: 40px;
                        // float: left;
                        text-align: center;
                        line-height: 40px;
                        transition: all 0.2s;

                        >img {
                            height: 20px;
                            widows: 20px;
                            vertical-align: middle;
                            cursor: pointer;
                        }

                        >.isTop {
                            height: 40px;
                            width: 40px;
                        }
                    }

                    >.col {
                        flex: 1;
                        text-align: center;
                        color: #656565;

                        .editInput {
                            width: 70%;
                            border: none;
                            outline: none;
                            padding: 5px;
                            border-radius: 5px;
                            outline: 2px solid #656565;

                            &:focus {
                                outline: 2px solid #0281ff;
                            }
                        }
                    }

                    .ptitle {
                        color: var(--import);
                    }

                    .nick {
                        color: #67b3ff;
                    }

                    .zname {
                        color: var(--import_more);
                    }

                    .content {
                        color: #909399;
                    }

                    .hidden {
                        /* 强制不换行 */
                        white-space: nowrap;
                        /* 文字用省略号代替超出的部分 */
                        text-overflow: ellipsis;
                        /* 匀速溢出内容，隐藏 */
                        overflow: hidden;
                    }



                    .op {
                        display: flex;
                        justify-content: center;
                    }

                    &:nth-child(even) {
                        background-color: rgb(248, 245, 245);
                    }

                    &:hover {
                        background-color: rgb(249, 252, 255);
                    }
                }

                .editing {
                    background: rgb(0, 212, 255);
                    background: linear-gradient(25deg, rgba(0, 212, 255, 1) 0%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 255%);
                }

                .deleteing {
                    background: rgb(254, 127, 144);
                    background: linear-gradient(25deg, rgba(254, 127, 144, 1) 0%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 255%);
                }
            }

            .zoneImg {
                height: 40px;
                width: 40px;
                border-radius: 5px;
                cursor: pointer;
            }
        }

        .editBtn {
            background-color: #67b3ff;
            border: none;
            color: white;
            padding: 5px;
            cursor: pointer;
            margin-right: 5px;
            border-radius: 5px;
            box-sizing: border-box;

            &:hover {
                background-color: #0281ff;
            }
        }

        .deleteBtn {
            background-color: rgb(254, 93, 93);
            border: none;
            color: white;
            padding: 5px;
            cursor: pointer;
            margin-left: 5px;
            border-radius: 5px;

            &:hover {
                background-color: red;
            }
        }

        .sureBtn {
            background-color: rgb(11, 225, 0);
            border: none;
            color: white;
            // width: 50%;
            cursor: pointer;
            margin-left: 5px;
            border-radius: 5px;

            &:hover {
                background-color: rgb(53, 151, 47);
            }
        }

        .toTop {
            background-color: #0281ff;
        }

        .zoneDetailData {
            width: 20%;
            height: auto;

            >.head {
                height: 30px;
                line-height: 30px;
                text-align: center;
                transition: all 0.2s;
                overflow: hidden;
            }

            img {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

}
</style>