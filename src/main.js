import { createApp } from 'vue'
import './global.css'
import './assets/reset.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import "amfe-flexible/index.js"
import 'element-plus/dist/index.css'
import { createPinia } from "pinia"
import dragscroll from "./tools/tFun"
const pinia = createPinia()
import router from "./router/index"


const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.directive('dragscroll', dragscroll)
app.mount('#app')