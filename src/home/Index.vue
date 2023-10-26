<template>
    <div class="home">
        <SiderBar></SiderBar>
        <div class="main">
            <HeadBar></HeadBar>
            <Main></Main>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import HeadBar from "./components/HeadBar.vue";
import SiderBar from "./components/SiderBar.vue";
import Main from "./components/Main.vue";
</script>

<style lang="less" scoped>
.home {
    height: 100vh;
    width: 100%;
    display: flex;
    font-size: 16px;
    .main{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}
</style>