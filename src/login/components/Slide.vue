<template>
    <div class="outer">
        <div class="tip">
            <span>请拖动下方滑块控制左侧拼图与右侧拼图重合</span>
        </div>
        <div class="slide">
            <div class="img">
                <div ref="movePintu" class="pintu">
                    <img src="../../assets/img/pintu-area.png">
                </div>
                <div ref="targetPintu" class="pintu pintu-area">
                    <img src="../../assets/img/pintu.png">
                </div>
                <img :src="url">
            </div>
            <div ref="area" class="area" :class="{ success: verifyStatus == 'success', fail: verifyStatus == 'fail' }">
                <div ref="btn" @mousedown="moveBtn" class="btn green">{{ ">>" }}</div>
            </div>
        </div>
        <div class="message">
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { globalStore } from "../../global/gStore"
const gStore = globalStore()
let emits = defineEmits(['success'])
// 随机背景图片
let rand = Math.floor(Math.random() * 5 + 1)
let url = "/src/assets/img/" + rand + ".jpg"

// 拖动方块方法
const area = ref<HTMLElement>()
const btn = ref<HTMLElement>()
const movePintu = ref<HTMLElement>()
const targetPintu = ref<HTMLElement>()
// 失败或成功状态码：
let verifyStatus = ref("")
// 消息提示
let message = ref("")
// 把随机的left放在外面，需要用到
let settingleft;
onMounted(() => {
    refresh()
})
// 重置滑块
function refresh() {
    settingleft = Math.floor(Math.random() * 51 + 200) + "px";
    let settingtop = Math.floor(Math.random() * 41 + 10) + "%";
    // 设置目标拼图和移动拼图的坐标
    let target = <HTMLElement>targetPintu.value;
    target.style.left = settingleft;
    target.style.top = settingtop;
    let move = <HTMLElement>movePintu.value;
    move.style.top = settingtop;
}
// 计时器，计时用户拖动的时间
let begin;
let end;
function moveBtn(e) {
    // 开始计时
    begin = Date.now()
    let dragDiv = <HTMLElement>btn.value;
    let father = <HTMLElement>area.value;
    let move = <HTMLElement>movePintu.value
    // 获取浏览器窗口文档显示区域的宽度和高度,不包括滚动条。
    const { clientWidth } = father;
    // 获取鼠标相对于当前元素的位置
    const disX = e.clientX - dragDiv.offsetLeft;
    // 鼠标点击不释放 进行拖动
    document.onmousemove = e => {
        //鼠标位置减去鼠标相对于当前元素的位置 获取此时此刻元素应该处于的位置
        let left = e.clientX - disX;
        // 获取元素的宽高
        const { offsetWidth, offsetHeight } = dragDiv;
        // 设置当前元素的位置 不能超出可视区域
        if (left < 0) {
            left = 0;
        }
        if (left > clientWidth - offsetWidth) {
            left = clientWidth - offsetWidth;
        }
        dragDiv.style.left = left + "px";
        move.style.left = left + "px"
    };

    // 鼠标点击释放 拖动结束
    document.onmouseup = () => {
        // 鼠标释放后，获取移动pintu的left，看是否移动到指定位置了
        console.log(move.offsetLeft);
        if (move.offsetLeft > parseInt(settingleft) - 5 && move.offsetLeft < parseInt(settingleft) + 5) {
            end = Date.now()
            let nanosecond = end - begin;
            console.log("所需时间:", nanosecond, "ms");
            message.value = `使用了${nanosecond / 1000}秒。${nanosecond / 1000 > 1 ? '不太行啊' : '真是太快了'}`
            // 2s 后跳回去
            verifyStatus.value = "success"
            setTimeout(() => {
                gStore.setMaskStatus(false)
                emits("success")
            }, 1000);
        } else {
            // 失败了重置滑块
            refresh()
            dragDiv.style.left = 1 + "px";
            move.style.left = 1 + "px"
            // 状态码为fail
            verifyStatus.value = "fail"
            setTimeout(() => {
                verifyStatus.value = ""
            }, 400);
            console.log("验证失败");
        }
        document.onmousemove = null;
        document.onmousedown = null;
        document.onmouseup = null;
    };
}


</script>

<style lang="less" scoped>
.outer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 500px;
    height: 340px;
    background-color: white;
    z-index: 1;

    .tip {
        height: 30px;
        line-height: 30px;
        font-family: "黑体";
        text-align: center;
        font-size: 18px;
    }
}

.slide {
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: 270px;
    width: 470px;
    // padding: 15px;
    background-color: white;
    z-index: 2;
    text-align: center;

    .img {
        margin: 0 auto;
        width: fit-content;
        width: 470px;
        height: 200px;

        .pintu {
            height: 45px;
            width: 45px;
            position: absolute;
            z-index: 2;

            img {
                height: 45px;
                width: 45px;
            }
        }

        .pintu-area {
            z-index: 1;
            left: 50%;
        }

        img {
            height: 200px;
            width: 470px;
        }
    }

    .success {
        background-color: #00d99c !important;
    }

    .fail {
        background-color: red !important;
    }

    .area {
        width: 468px;
        height: 48px;
        border: 1px solid #ccc;
        background-color: #ccc;
        margin: 0 auto;
        margin-top: 10px;
        border-radius: 5px;

        .btn {
            height: 45px;
            width: 45px;
            background-color: white;
            font-size: 24px;
            line-height: 45px;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            text-align: center;
            border-radius: 5px;
        }
    }
}

.message {
    font-family: "黑体";
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
}
</style>