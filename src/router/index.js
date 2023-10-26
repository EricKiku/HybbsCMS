import { createRouter, createWebHistory } from "vue-router";
const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../home/Index.vue"),
        redirect: '/home',
        meta: {
            path: "首页",
            title: "首页"
        },
        children: [
            {
                path: "/home",
                name: "/home",
                component: () => import("../home/views/Home.vue"),
                meta: {
                    path: "首页"
                },
            },
            {
                path: "/analysis",
                name: "/analysis",
                redirect: "/analysis/zone",
                children: [
                    {
                        path: "/analysis/zone",
                        name: "/analysis/zone",
                        meta: {
                            path: "首页/分析/分区分析",
                            title: "数据分析 | 分区"
                        },
                        component: () => import("../dataAnalysis/views/ZoneData.vue")
                    },
                    {
                        path: "/analysis/post",
                        name: "/analysis/post",
                        meta: {
                            title: "数据分析 | 帖子",
                            path: "首页/分析/帖子分析"
                        },
                        component: () => import("../dataAnalysis/views/PostData.vue")
                    },
                    {
                        path: "/analysis/user",
                        name: "/analysis/user",
                        meta: {
                            title: "数据分析 | 用户",
                            path: "首页/分析/用户分析"
                        },
                        component: () => import("../dataAnalysis/views/UserData.vue")
                    },
                    {
                        path: "/analysis/flow",
                        name: "/analysis/flow",
                        meta: {
                            title: "数据分析 | 流量",
                            path: "首页/分析/流量分析"
                        },
                        component: () => import("../dataAnalysis/views/FlowData.vue")
                    },
                    {
                        path: "/analysis/room",
                        name: "/analysis/room",
                        meta: {
                            title: "数据分析 | 频道",
                            path: "首页/分析/频道分析"
                        },
                        component: () => import("../dataAnalysis/views/RoomData.vue")
                    },
                ]
            },
            {
                path: "/superadminer",
                name: "/superadminer",
                meta: {
                    title: "管理员 | 超级管理员",
                    path: "首页/超级管理员"
                },
                component: () => import("../home/views/SuperAdminer.vue")
            }
        ]
    },

    {
        path: "/login",
        name: "login",
        component: () => import("../login/Index.vue"),
        meta: {
            title: "登录"
        }
    }
]



const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title
    next()
})

export default router