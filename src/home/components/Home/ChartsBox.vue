<template>
    <div class="charts">
        <div class="chartBox" :class="{ selected_box: selectedBox ? selectedBox == chart.id ? true : false : false }"
            :style="{ flex: selectedBox ? selectedBox == chart.id ? '1' : 'none' : '1' }" v-for="(chart) in charts"
            :key="chart['id']" :title="selectedBox == chart.id ? '' : '点击查看简略图表'">
            <div style="display: flex;">
                <div class="chartImg" @click="selectBox(chart.id)" :title="chart.label"
                    :class="{ chartImg_unselected: selectedBox ? selectedBox == chart.id ? false : true : false, chartImg_selected: selectedBox ? selectedBox == chart.id ? true : false : false }">
                    <img :src="chart.ico">
                </div>
                <div class="chartName" @click="selectBox(chart.id)"
                    :class="{ chartName_selected: selectedBox ? selectedBox == chart.id ? true : false : false }"
                    :style="{ display: selectedBox ? selectedBox == chart.id ? 'block' : 'none' : 'block' }">
                    {{
                        chart['label'] }}</div>
            </div>
            <PreviewChart :id="selectedBox" v-if="selectedBox == chart.id"></PreviewChart>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { globalCatalogue } from "../../../global/gCatalogue"
import PreviewChart from "./PreviewChart.vue";
const gCatalogut = globalCatalogue()

// 分析图列表
let charts = <any>ref([])

// 点击其中一个box时，其他的box缩小，选中的展开
let selectedBox = ref('')
function selectBox(value) {
    // 如果再次被选中，则取消选中
    if (selectedBox.value == value) {
        selectedBox.value = '';
        return;
    }
    // 先设置选中的box
    selectedBox.value = value;
}

onMounted(() => {
    // 2 是分析图分支
    let branch = <any>gCatalogut.getCataLogueBranch(2)
    charts.value = branch['content']
})
</script>

<style lang="less" scoped>
.charts {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    height: auto;

    .selected_box {
        height: 300px !important;
        display: flex;
        flex-flow: column;
    }

    .chartBox {
        box-sizing: border-box;
        // flex: 1;
        height: 100px;
        min-width: 100px;
        margin: 10px 30px;
        background-color: white;
        border-radius: 10px;

        transition: all 0.3s;
        position: relative;
        box-shadow:
            0px 0px 10px rgba(0, 0, 0, 0.095),
            0px 0px 80px rgba(0, 0, 0, 0.19);

        &:hover {
            .chartImg {
                background-color: var(--import_less);
            }
        }

        .chartImg {
            height: 60px;
            width: 60px;
            line-height: 60px;
            margin-left: 20px;
            position: absolute;
            top: 50%;
            // left: 10%;
            transform: translateY(-50%);
            border-radius: 5px;
            transition: all 0.3s;
            cursor: pointer;

            // text-align: center;
            >img {
                height: 50px;
                width: 50px;
                margin: 5px;
                border-radius: 5px;
            }
        }

        .chartImg_unselected {
            flex: 1;
            text-align: center;
            // margin-left: 10px;
            // margin-right: 10px;
        }

        .chartImg_selected {
            top: 5px;
            left: 5px;
            transform: translateY(10%) translateX(10%);
            margin-left: 0px;
        }

        .chartName {
            flex: 1;
            line-height: 100px;
            text-align: center;
            font-size: 16px;
            overflow: hidden;
            cursor: pointer;
        }

        // .chartName_selected {}
    }
}
</style>