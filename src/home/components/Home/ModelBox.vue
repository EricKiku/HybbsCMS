<template>
    <div class="modelBox">
        <div class="title">
            功能模块
        </div>
        <!-- 模块盒子 -->
        <div class="boxItem zone" @click="toRouter('/analysis/zone')">
            <div class="boxName">
                <span>分区管理</span>
            </div>
            <div class="boxIcon">
                <img src="/src/assets/img/zoneModelBox.png" alt="">
            </div>
        </div>
        <div class="boxItem post" @click="toRouter('/analysis/post')">
            <div class="boxName">
                <span>帖子管理</span>
            </div>
            <div class="boxIcon">
                <img src="/src/assets/img/postModelBox.png" alt="">
            </div>
        </div>
        <div class="boxItem user">
            <div class="boxName">
                <span>用户管理</span>
            </div>
            <div class="boxIcon">
                <img src="/src/assets/img/userModelBox.png" alt="">
            </div>
        </div>
        <div class="boxItem reply">
            <div class="boxName">
                <span>回复管理</span>
            </div>
            <div class="boxIcon">
                <img src="/src/assets/img/replyModelBox.png" alt="">
            </div>
        </div>
        <div class="boxItem adminer">
            <div class="boxName">
                <span>管理员管理</span>
            </div>
            <div class="boxIcon">
                <img src="/src/assets/img/adminerModelBox.png" alt="">
            </div>
        </div>
        <div class="boxItem room">
            <div class="boxName">
                <span>频道管理</span>
            </div>
            <div class="boxIcon">
                <img src="/src/assets/img/roomModelBox.png" alt="">
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { test } from "../../api/index"
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

function toRouter(path) {
    router.push({
        name: path
    })
}
</script>

<style lang="less" scoped>
.modelBox {
    margin: 30px;
    padding: 5px;
    border-radius: 10px;
    // height: 100px;
    display: flex;
    justify-content: space-around;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
    padding-top: 30px;
    position: relative;
    user-select: none;

    >.title {
        position: absolute;
        top: 20px;
        left: 25px;
        font-size: 18px;
        font-family: "黑体";
        color: rgb(74, 144, 226);
    }

    .boxItem {
        height: 150px;
        width: 150px;
        box-sizing: border-box;
        border-radius: 10px;
        cursor: pointer;
        margin: 15px;
        // display: flex;
        transition: all 0.2s;
        position: relative;

        &:hover {
            // background-color: var(--import_more);
            // color: white;
        }

        .boxName {
            // flex: 1;
            height: 20px;
            width: 100%;
            line-height: 20px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            position: absolute;
            bottom: 10px;
            text-align: center;
            z-index: 1;
        }

        .boxIcon {
            // flex: 1;
            text-align: center;
            position: relative;
            height: 150px;
            width: 150px;

            >img {
                // position: relative;
                // top: 50%;
                // flex: 1;
                height: 150px;
                width: 150px;
                // margin-right: 10px;
            }
        }
    }

    .zone {
        // border: 1px solid rgb(171, 196, 255);
        color: rgb(45, 114, 138);

        &:hover {
            background-color: rgb(154, 226, 252);
        }
    }


    .post {
        // border: 1px solid rgb(171, 196, 255);
        color: #9c662c;

        &:hover {
            background-color: #f0cba2;
        }
    }

    .user {
        // border: 1px solid rgb(171, 196, 255);
        color: #638e4f;

        &:hover {
            background-color: #a7f085;
        }
    }

    .reply {
        // border: 1px solid rgb(171, 196, 255);
        color: #8c8f2d;

        &:hover {
            background-color: #ecf085;
        }
    }

    .adminer {
        // border: 1px solid rgb(171, 196, 255);
        color: #0b06ab;

        &:hover {
            background-color: #91bfff;
        }
    }

    .room {
        // border: 1px solid rgb(171, 196, 255);
        color: #95019f;

        &:hover {
            background-color: #f99eff;
        }
    }
}
</style>