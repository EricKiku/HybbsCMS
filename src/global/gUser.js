import { defineStore } from "pinia"

export const userStore = defineStore("userStore", {
    state: () => {
        return {
            user: null
        }
    },
    actions: {
        // 设置当前用户
        setUser(user) {
            this.user = user
        },
        // 获取当前用户
        getUser() {
            return this.user
        },
        // 获取当前用户的某个属性
        getUserStats(stats) {
            return this.user[stats]
        },
        // 修改当前用户的某个属性
        setUserStats(stats, value) {
            this.user[stats] = value
        }
    }
})