import { defineStore } from "pinia"

export const globalCatalogue = defineStore("globalCatalogue", {
    state: () => {
        return {
            catalogue: [
                {
                    id: 1,
                    label: "首页",
                    ico: "/src/assets/img/home.png",
                    path: "/home",
                    
                },
                {
                    id: 2,
                    label: "数据分析表",
                    ico: "/src/assets/img/tubiao.png",
                    content: [
                        {
                            id: 2.1,
                            label: "分区分析",
                            ico: "/src/assets/img/plate.png",
                            path: "/analysis/zone"
                        },
                        {
                            id: 2.2,
                            label: "帖子分析",
                            ico: "/src/assets/img/post.png",
                            path: "/analysis/post"
                        },
                        {
                            id: 2.3,
                            label: "用户分析",
                            ico: "/src/assets/img/userchart.png",
                            path: "/analysis/user"
                        },
                        {
                            id: 2.4,
                            label: "流量分析",
                            ico: "/src/assets/img/liuliang.png",
                            path: "/analysis/flow"
                        },
                        {
                            id: 2.5,
                            label: "频道分析",
                            ico: "/src/assets/img/channel.png",
                            path: "/analysis/room"
                        }
                    ]
                },
                {
                    id: 3,
                    label: "管理员管理",
                    ico: "/src/assets/img/adminer.png",
                    content: [
                        {
                            id: 3.1,
                            label: "超级管理员",
                            path: "/superadminer"
                        },
                        {
                            id: 3.2,
                            label: "管理员"
                        },
                        {
                            id: 3.3,
                            label: "普通用户"
                        },
                    ]
                }
            ]
        }
    },
    actions: {
        // 设置目录
        setCatalogue(catalogue) {
            this.catalogue = catalogue
        },
        // 根据权限获取目录
        getCataLogueByRole(roleLevel) {
            if (roleLevel == 'superadminer') {
                return this.catalogue
            }
        },
        // 获取目录的某一分支
        getCataLogueBranch(id) {
            for (const branch of this.catalogue) {
                if (branch.id == id) {
                    return branch
                }
            }
        }
    }
})