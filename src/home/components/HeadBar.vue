<template>
    <div class="headbar">
        <div class="nav">
            <el-breadcrumb :separator-icon="Link">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="route.path.indexOf('analysis') != -1">数据分析</el-breadcrumb-item>
                <el-breadcrumb-item v-if="route.path.indexOf('analysis/zone') != -1"
                    :to="{ path: '/analysis/zone' }">分区</el-breadcrumb-item>
                <el-breadcrumb-item v-if="route.path.indexOf('analysis/post') != -1"
                    :to="{ path: '/analysis/post' }">帖子</el-breadcrumb-item>
                <el-breadcrumb-item v-if="route.path.indexOf('analysis/user') != -1"
                    :to="{ path: '/analysis/user' }">用户</el-breadcrumb-item>
                <el-breadcrumb-item v-if="route.path.indexOf('analysis/flow') != -1"
                    :to="{ path: '/analysis/flow' }">流量</el-breadcrumb-item>
                <el-breadcrumb-item v-if="route.path.indexOf('analysis/room') != -1"
                    :to="{ path: '/analysis/room' }">频道</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted } from "vue"
import { globalStore } from "../../global/gStore"
import { Link, DArrowRight } from '@element-plus/icons-vue'
import { useRoute } from "vue-router"
const gStore = globalStore()
const route = useRoute()
onMounted(() => {
    console.log(route);

})
// let path = ref()
// watchEffect(() => {
//     path.value = gStore.getimgURL()
// })
</script>

<style lang="less" scoped>
.headbar {
    height: 70px;
    line-height: 70px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px !important;
    z-index: 5;

    .nav {
        height: 70px;
        line-height: 70px;
        padding-left: 30px;
        cursor: default;

        >div {
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
        }
    }
}
</style>