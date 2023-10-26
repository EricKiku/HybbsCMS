<template>
    <div class="pagination">
        <el-pagination background v-model:page-size="pageSize" v-model:current-page="currentPage" layout="prev, pager, next"
            :total="total" @current-change="handleCurrentPage" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
const props = defineProps(['total', 'pageSize'])
const emits = defineEmits(['changeCurrentPage'])
const pageSize = ref(props.pageSize ? props.pageSize : 15)
let currentPage = ref(1)
const total = ref(0)
onMounted(() => {
    total.value = props.total
})
// 切换页面触发
function handleCurrentPage(e) {
    emits("changeCurrentPage", e)
}
</script>

<style lang="less" scoped>
.pagination {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    position: absolute;
    bottom: 10px;
}
</style>