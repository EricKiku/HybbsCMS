<template>
    <div class="content scrollbar">
        <router-view></router-view>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

</script>

<style lang="less" scoped>
.content {
    flex: 1;
    height: 100%;
    overflow: auto;
}
</style>