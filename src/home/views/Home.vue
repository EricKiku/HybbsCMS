<template>
    <div class="home ">
        <ChartsBox></ChartsBox>
        <Admin></Admin>
        <ModelBox></ModelBox>
        <RoomDynamicMessage></RoomDynamicMessage>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import ChartsBox from "../components/Home/ChartsBox.vue"
import Admin from "../components/Home/Admin.vue";
import ModelBox from "../components/Home/ModelBox.vue"
import RoomDynamicMessage from "../components/Home/RoomDynamicMessage.vue";
import { useRouter, useRoute } from "vue-router"
import { globalStore } from "../../global/gStore"
const gStore = globalStore()
const route = useRoute()

onMounted(() => {
    gStore.setPagePath(route.meta.path)
})
</script>

<style lang="less" scoped>
.home {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 20px;


}
</style>