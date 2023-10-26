<template>
    <div ref="outer" class="preview scrollbar" @mousewheel.prevent="rollImg">
        <div class="close" @mouseenter="mouseHover('enter')" @mouseleave="mouseHover('leave')">
            <img @click="closePreview" v-show="!close_style" src="../../assets/img/imgClose.png" alt="">
            <img @click="closePreview" v-show="close_style" src="../../assets/img/imgClose_hover.png" alt="">
        </div>
        <img ref="img" @mousedown="handleMousedown" :src="gStore.getimgURL() + imgPath">
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { globalStore } from "../../global/gStore"
const gStore = globalStore()

let props = defineProps(['imgPath']);
const emits = defineEmits(["close"])
let prePath = ""
onMounted(() => {
    console.log(props.imgPath);

    console.log("url:", gStore.getimgURL(), props.imgPath);

})


// 图片放大与移动
const outer = ref()
const img = ref()
const rollImg = (e) => {
    /* 获取当前页面的缩放比 若未设置zoom缩放比，则为默认100%，即1，原图大小 */
    var zoom = parseInt(img.value.style.zoom) || 100;
    /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动 */
    zoom += e.wheelDelta / 12;
    /* 最小范围 和 最大范围 的图片缩放尺度 */
    if (zoom >= 80 && zoom < 500) {
        img.value.style.zoom = zoom + "%";
    }
    return false;
}
// 图片拖动
function handleMousedown(e) {
    let prePic = img.value
    const disX = e.clientX - prePic.offsetLeft;
    const disY = e.clientY - prePic.offsetTop;
    prePic.onmousemove = e => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        const { offsetWidth, offsetHeight } = prePic;
        prePic.style.left = left + "px";
        prePic.style.top = top + "px";
    }
    // 鼠标点击释放 拖动结束
    prePic.onmouseup = () => {
        prePic.onmousemove = null;
        prePic.onmousedown = null;
        prePic.onmouseup = null;
    };
}
// 关闭按钮样式切换
let close_style = ref(false)
// 鼠标进入或移除方法
function mouseHover(stats) {
    if (stats == "enter") {
        close_style.value = true
    } else if (stats == "leave") {
        close_style.value = false
    }
}

// 关闭图片预览
function closePreview() {
    emits("close")
}
</script>

<style lang="less" scoped>
.preview {
    user-select: none;
    position: absolute;
    height: 871px;
    width: 1670px;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    z-index: 4;
    overflow: auto;

    .close {
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        z-index: 6;
    }

    >img {
        cursor: pointer;
        height: 800px;
        // width: 800px;
        position: absolute;
        left: 50%;

        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        z-index: 4;
        user-select: none;
        -webkit-user-drag: none;
        // >img {
        //     height: 100%;
        //     width: 100%;
        //     z-index: 3;
        //     -webkit-user-drag: none;
        // }
    }
}
</style>