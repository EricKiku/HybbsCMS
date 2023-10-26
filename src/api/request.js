import axios from "axios"



const request = axios.create({
    baseURL: "/api",
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use((config) => {
    // config配置对象，其中有headers等参数
    // 从localstorage中获取token
    const token = localStorage.getItem("token") || ""
    config.headers.Authorization = token
    return config;
})

// 响应拦截器
request.interceptors.response.use((res) => {
    // 成功的回调
    return res.data
}, (err) => {
    // 失败的回调
    return Promise.reject(new Error('fail'));
})

export default request;