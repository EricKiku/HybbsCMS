import { defineStore } from "pinia"

export const globalStore = defineStore("globalStore", {
    state: () => {
        return {
            // 滑块验证组件遮罩层状态
            maskStatus: false,
            imgURL: "http://localhost:1234",
            // 当前面包屑路径
            currentPagePath: "首页"
        }
    },
    actions: {
        // 修改遮罩层状态
        setMaskStatus(value) {
            this.maskStatus = value
        },
        // 获取遮罩层状态
        getMaskStatus() {
            return this.maskStatus
        },
        // 获取url
        getimgURL() {
            return this.imgURL
        },
        //设置路径
        setPagePath(path) {
            // 设置路径
            console.log("设置路径", path);
            this.currentPagePath = path
        },
        // 获取路径
        getPagePath() {
            return this.currentPagePath

        }
    }
})