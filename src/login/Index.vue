<template>
    <div class="mask" @click="verifyVisual(false)" v-if="gStore.getMaskStatus()"></div>
    <Slide @success="verifySuccessCallback" v-if="gStore.getMaskStatus()"></Slide>
    <div class="login">
        <div class="main">
            <div class="left">
                <!-- <div class="left_bottom"></div>
                <div class="right_top"></div> -->
                <div class="bg bg1 green">
                    管理系统
                </div>
                <div class="front f1 green">
                    <div class="text">
                        此管理系统的前台为：Hybbs。此系统旨在显示前台活跃数据与管理各类数据
                        <br>
                        <!-- <div>联系方式：13613200891</div> -->
                    </div>
                </div>
                <div class="bg bg2 green">
                    注意事项
                </div>
                <div class="front f2 green">
                    <div class="text">
                        登录账号只可被管理员创建，不可注册。如需使用系统，请联系管理员。
                        <br>
                        <div>联系方式：13613200891</div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="title green">
                    <span>系统登录</span>
                </div>
                <div class="form">
                    <div class="row">
                        <div>编号</div>
                        <!-- <input @change="codeChange" v-model="userCode" type="text" placeholder="9位用户编码"> -->
                        <el-select v-model="userCode" filterable class="m-2" placeholder="请输入编号" size="large">
                            <el-option v-for="code in codes" :key="code.u_code"
                                :label="'(' + code.u_name + ')' + code.u_code" :value="code.u_code" />
                        </el-select>
                        <span v-show="loading" class="loading">
                            <img src="../assets/img/loading.gif" alt="">
                        </span>
                    </div>
                    <div class="row">
                        <div>身份证号</div>
                        <input v-model="idCard" type="text" placeholder="有效身份证号码">
                        <span></span>
                    </div>
                    <div class="row">
                        <div>
                            密码
                            <img v-show="!passwordVisual" @click="passwordVisual = true" class="eye" src="./ico/noSee.png">
                            <img v-show="passwordVisual" @click="passwordVisual = false" class="eye" src="./ico/see.png">
                        </div>
                        <input v-model="password" :type="passwordVisual ? 'text' : 'password'" placeholder="密码">
                        <span></span>
                    </div>
                    <div class="beginVerify" :class="{ verifySuccessCss: verifySuccess }" @click="verifyVisual(true)">
                        <span v-show="!verifySuccess">点击验证</span>
                        <div v-show="verifySuccess">
                            <img src="../assets/img/verifysuccess.png">
                            验证成功
                        </div>
                    </div>
                    <div class="row">
                        <button @click="login">登录</button>
                    </div>
                </div>
                <div class="bottom">
                    <el-checkbox v-model="isSaved" label="是否保存信息" size="small" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { loginReq, getCodesReq } from "./api/index"
// 滑块组件
import Slide from "./components/Slide.vue"
import { globalStore } from "../global/gStore.js"
import { userStore } from "../global/gUser.js"
import { message } from "../tools/tFun"
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
const gStore = globalStore()
const uStore = userStore()

// 所有编号
const codes = <any>ref([])
let loading = ref(false)
// 获取编号
onMounted(() => {
    getCodes()
    // 获取localStorage中的数据
    userCode.value = localStorage.getItem("code") || ""
    idCard.value = localStorage.getItem("card") || ""
    password.value = localStorage.getItem("password") || ""
    isSaved.value = localStorage.getItem("isSaved") == "1" ? true : false
})

// 获取编号
function getCodes() {
    loading.value = true
    getCodesReq().then(res => {
        console.log(res.data);
        for (const code of res.data) {
            codes.value.push(code)
        }
        console.log(codes.value);
    }).finally(() => { loading.value = false })
}


let userCode = ref("")
let idCard = ref("")
let password = ref("")
let passwordVisual = ref(false)
function login() {
    if (!verifySuccess.value) {
        message(2, "请点击“点击验证”进行验证")
        return;
    }
    loginReq(userCode.value, idCard.value, password.value).then(res => {
        if (res.status == 200) {
            message(1, "登录成功")
            // 保存token到本地
            uStore.setUser(res.data[0])
            localStorage.setItem("token", res['Token'])
            // 如果勾选了是否保存信息，则把输入框内的信息保存到localStorage中
            if (isSaved.value) {
                localStorage.setItem("code", userCode.value)
                localStorage.setItem("card", idCard.value)
                localStorage.setItem("password", password.value)
                localStorage.setItem("isSaved", "1")
            } else {
                localStorage.setItem("isSaved", "0")
                localStorage.setItem("code", "")
                localStorage.setItem("card", "")
                localStorage.setItem("password", "")
            }
            router.replace({
                name: "home"
            })
        } else {
            message(2, "填写的信息有误")
        }
    })
}

// 点击开始验证
function verifyVisual(value: boolean) {
    if (verifySuccess.value) {
        return;
    }
    // 设置遮罩层是否
    gStore.setMaskStatus(value);
}
// 是否验证成功
let verifySuccess = ref(false)
// 设置验证结果
function verifySuccessCallback() {
    verifySuccess.value = true
}
// 编号修改，重新验证
function codeChange() {
    verifySuccess.value = false
}



// 底部组件
let isSaved = ref(false)
</script>

<style lang="less" scoped>
.login {
    height: 100vh;
    background-image: url("../assets/img/login_bg.jpg");
    /* 背景图垂直、水平均居中 */
    background-position: center center;
    /* 背景图不平铺 */
    background-repeat: no-repeat;
    /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
    background-attachment: fixed;
    /* 让背景图基于容器大小伸缩 */
    background-size: cover;
    /* 设置背景颜色，背景图加载过程中会显示背景色 */
    background-color: #464646;

    .main {
        height: 60%;
        width: 50%;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border-radius: 10px;
        padding: 30px;
        display: flex;

        .left {
            flex: 1;
            padding: 10px;

            .left_bottom {
                height: 100px;
                width: 5px;
                background-color: #00d99c;
                position: absolute;
                bottom: 20px;
                left: 20px;
                border-top-left-radius: 100%;
                border-top-right-radius: 100%;
            }

            .right_top {
                height: 100px;
                width: 5px;
                position: relative;
                left: calc(100% - 25px);
                top: -20px;
                background-color: #00d99c;
                border-bottom-left-radius: 100%;
                border-bottom-right-radius: 100%;
            }

            .bg {
                height: 100px;
                width: 100px;
                border: 10px solid #32fcc3;
                border-radius: 100%;
                line-height: 100px;
                text-align: center;
                font-size: 20px;
                font-family: "黑体";
                position: absolute;

            }

            .bg1 {
                top: 10%;
                left: 5%;
            }

            .bg2 {
                top: 40%;
                left: 5%;
            }

            .front {
                // height: 200px;
                width: 300px;
                background: rgba(255, 255, 255);
                border-radius: 15px;
                border-top-left-radius: 0px;
                box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);
                box-shadow:
                    0px 0px 10px rgba(0, 0, 0, 0.075),
                    0px 0px 80px rgba(0, 0, 0, 0.15);

                position: absolute;
                padding: 20px;
                font-size: 16px;
                letter-spacing: 1px;
                line-height: 20px;
            }

            .f1 {
                top: calc(10% + 70px);
                left: calc(5% + 50px);
            }

            .f2 {
                top: calc(40% + 70px);
                left: calc(5% + 50px);
            }
        }

        .right {
            flex: 1;
            padding: 10px;
            border-radius: 10px;
            height: auto;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            box-shadow:
                0px 0px 55px rgba(0, 0, 0, 0.17);

            .title {
                height: 40px;
                line-height: 40px;
                font-size: 30px;
                font-family: "黑体";
                letter-spacing: 2px;
                text-align: center;
            }

            .form {
                padding: 10px;
                padding-top: 0px;

                .loading {
                    height: 25px;

                    img {
                        height: 25px;
                        width: 25px;
                    }
                }

                .row {
                    padding-top: 5px;
                    padding-bottom: 5px;
                    margin-top: 15px;
                    text-align: center;

                    .eye {
                        cursor: pointer;
                        vertical-align: middle;
                    }

                    >div {
                        width: 290px;
                        text-align: left;
                        font-size: 14px;
                        font-family: "黑体";
                        padding: 5px;
                        margin: 0 auto;
                        color: rgb(77, 77, 77);
                    }

                    input {
                        border: none;
                        outline: none;
                        padding: 10px;
                        background-color: #f0f0f0;
                        border-radius: 5px;
                        font-size: 16px;
                        width: 280px;
                        letter-spacing: 1px;
                    }

                    button {
                        height: 40px;
                        width: 300px;
                        border-radius: 5px;
                        border: none;
                        outline: none;
                        background-color: #00d99c;
                        color: white;
                        letter-spacing: 10px;
                        text-align: center;
                        font-size: 16px;
                        cursor: pointer;

                        &:hover {
                            background-color: #00ac7b;
                        }
                    }
                }

                .beginVerify {
                    height: 25px;
                    width: 300px;
                    outline: 1px solid #e0e0e0;
                    margin: 0 auto;
                    border-radius: 5px;
                    line-height: 25px;
                    text-align: center;
                    cursor: pointer;
                    font-family: "黑体";
                    transition: all 0.2s;
                    font-size: 14px;
                    margin-top: 15px;
                    &:hover {
                        outline: 1px solid #00ac7b;
                    }
                }

                .verifySuccessCss {
                    background-color: #00ac7b !important;
                    color: white;
                    height: 25px;
                    line-height: 25px;
                    text-align: center;

                    img {
                        height: 25px;
                        width: 25px;
                        vertical-align: middle;
                    }
                }
            }

            .bottom {
                margin-left: 16%;

            }
        }
    }
}
</style>