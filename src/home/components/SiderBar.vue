<template>
    <div class="siderbar">
        <div ref="head" class="head">
            <div class="logo"></div>
            <div class="online">
                <div></div>当前APP在线：{{ 9 }}
            </div>
        </div>
        <div class="options">
            <img ref="activeIco" class="activeIco" src="../../assets/img/active.png" alt="">


            <div class="op_item" :class="{ active: activeOp == opi.id }" v-for="(opi) in ops" :key="opi.id">
                <div ref="label" class="label" :class="{ green: route.path.indexOf(opi.path) != -1 }"
                    @click="selectOp(opi.id, opi, opi.path)" @mouseleave="mouseOuter" @mouseenter="mouseHover(opi.id)">
                    <div class="icon">
                        <img :src="opi.ico">
                    </div>
                    <div class="title">{{ opi.label }}</div>
                    <div class="extend">
                        <img :style="{ transform: `rotate(${activeOp == opi.id ? '180deg' : '0deg'})` }"
                            v-show="opi.content" src="../../assets/img/extend.png">
                    </div>
                </div>
                <div class="content" :style="{ height: activeOp == opi.id ? height + 'px' : '0px' }">
                    <div class="content_item" v-for="(opiChild) in opi.content" :key="opiChild.id">
                        <div @click="routerSelect(opiChild.path)" ref="content_label" class="label"
                            :class="{ green: route.path.indexOf(opiChild.path) != -1 }">
                            <span>{{ opiChild.label }}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { globalCatalogue } from "../../global/gCatalogue"
const router = useRouter()
const route = useRoute()
const gCatalogue = globalCatalogue()
// 按钮列表
let ops = <any>ref([]);
// dom 元素
// 活动 图标
let activeIco = <any>ref();
let head = <any>ref()
let content_label = <any>ref()
let label = <any>ref()
// 选择按钮
let activeOp = ref(0)
// 子项高度
let height = ref(0)
function selectOp(id, item, path) {
    // 没有content该方法无效，只会跳转路由
    if (!item.content) {
        router.push({
            name: path
        })
        return;
    }
    if (activeOp.value == id) {
        activeOp.value = 0
        return;
    }
    // 计算子项单个高度
    let itemHeight = content_label.value[0].offsetHeight
    height.value = item.content.length * itemHeight
    activeOp.value = id
    // 如果点的是最后一个，则说明上面的扩展都收起来了，让活动图标往上移动
    if (ops.value[ops.value.length - 1].id == id) {
        mouseHover(id)
    }
}
// 鼠标悬浮在某个item时 活动图标 移动
function mouseHover(value) {


    // 计算 top
    let headHeight = head.value.offsetHeight;
    let labelHeight = label.value[0].offsetHeight
    let top = value * labelHeight / 2 + ((value - 1) * (labelHeight / 2));

    // 如果有选项是展开，则计算子项的高度
    let contentItem = content_label.value[0]
    if (activeOp.value != 0) {
        let arrLength;
        for (const op of ops.value) {
            if (op.id == activeOp.value) {
                arrLength = op.content.length;
                break;
            }
        }
        if (value > activeOp.value) {
            top += (contentItem.offsetHeight + 1) * arrLength
        }
    }
    activeIco.value.style.top = headHeight + top + "px";
}
// 鼠标移出 时，回到选中的那个
function mouseOuter() {
    if (activeOp.value == 0) {
        mouseHover(1);
        return;
    }
    mouseHover(activeOp.value);
}
// 根据用户权限获取可操作模块
onMounted(() => {
    let result = [
        {
            id: 1,
            label: "首页",
            ico: "/src/assets/img/home.png",
            path: "/home"
        },
        {
            id: 2,
            label: "数据分析图",
            ico: "/src/assets/img/tubiao.png",
            content: [
                {
                    id: '2.1',
                    label: "分区分析图",
                },
                {
                    id: '2.2',
                    label: "帖子分析图"
                },
                {
                    id: '2.3',
                    label: "用户分析图"
                },
                {
                    id: '2.4',
                    label: "热度分析图",
                },
                {
                    id: '2.5',
                    label: "频道分析图"
                }
            ]
        },
        {
            id: 3,
            label: "管理员管理",
            ico: "/src/assets/img/adminer.png",
            content: [
                {
                    id: '3.1',
                    label: "超级管理员",
                    path: "/superadminer"
                },
                {
                    id: '3.2',
                    label: "管理员"
                },
                {
                    id: '3.3',
                    label: "普通用户"
                },
            ]
        },
        {
            id: 4,
            label: "分区管理",
            ico: "/src/assets/img/zone.png",
            content: [
                {
                    id: "4.1",
                    label: "分区管理"
                }
            ]
        }
    ]
    ops.value = gCatalogue.getCataLogueByRole('superadminer')
})
// 子模块路由跳转
function routerSelect(pathName) {
    console.log(pathName);

    router.push({
        name: pathName
    })
}
</script>

<style lang="less" scoped>
.siderbar {
    width: 250px;
    height: 100%;
    background-color: var(--first);

    .head {
        height: 70px;
        background-color: var(--second);

        .logo {
            height: 50px;
        }

        .online {
            height: 20px;
            display: flex;
            color: white;
            font-size: 16px;
            font-family: "黑体";
            justify-content: center;

            div {
                height: 15px;
                width: 15px;
                background-color: greenyellow;
                border-radius: 50%;
                box-shadow: rgba(172, 255, 47, 0.77) 0px 2px 4px 0px, rgba(172, 255, 47, 0.77) 0px 2px 16px 0px;
            }
        }
    }

    .options {
        width: 100%;
        user-select: none;
        font-size: 16px;
        font-family: "黑体";

        .activeIco {
            height: 30px;
            width: 30px;
            position: absolute;
            z-index: 1;
            top: 100px;
            transform: translateY(-50%);
            transition: all 0.3s;
        }

        .op_item {
            border-bottom: 1px solid var(--second);
            position: relative;

            .label {
                position: relative;
                // text-align-last: justify;
                padding: 0px 40px;

            }

            // 此label是标题label
            >.label {
                height: 60px;
                line-height: 60px;
                text-align: center;
                background-color: var(--first);
                color: white;
                cursor: pointer;
                display: flex;
                justify-content: center;
                padding-right: 10px;
                font-size: 18px;

                &:hover {
                    color: var(--import);
                }

                .icon {
                    width: 20px;

                    img {
                        height: 20px;
                        width: 20px;
                        vertical-align: middle;
                        margin-top: -2px;
                    }
                }

                .title {
                    width: 100px;
                    // text-align-last: justify;
                    text-align: center;

                }

                .extend {
                    flex: 1;
                    text-align: right;

                    img {
                        height: 20px;
                        width: 20px;
                        vertical-align: middle;
                        margin-top: -2px;
                        transition: all 0.3s;
                    }

                    .rotate {
                        transform: rotate(180deg);
                    }
                }
            }

            .content {
                overflow: hidden;
                height: 0;
                transition: 0.3s;
                position: relative;

                .content_item {
                    >.label {
                        // background-color: rgb(130, 130, 130);
                        height: 60px;
                        line-height: 60px;
                        text-align: left;
                        color: white;
                        background-color: var(--second);
                        cursor: pointer;
                        transition: all 0.1s;
                        padding-left: 80px;
                        font-size: 14px;

                        &:hover {
                            background-color: rgb(78, 78, 78);
                        }
                    }
                }
            }


        }
    }

}
</style>