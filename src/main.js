import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import router from './router'
import request from './utils/request'
import App from './App.vue'
import { House, Flag, Warning, CirclePlus, Plus, QuestionFilled, Document, Edit, Search, Histogram, Collection, Odometer, SetUp, Lock, User, Top, Bottom } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const app = createApp(App)

app.use(ElementPlus, { locale })
app.use(router)
app.config.globalProperties.request = request
app.component('House', House)
app.component('Flag', Flag)
app.component('Warning', Warning)
app.component('CirclePlus', CirclePlus)
app.component('Plus', Plus)
app.component('QuestionFilled', QuestionFilled)
app.component("Document", Document)
app.component("Edit", Edit)
app.component("Search", Search)
app.component("Histogram", Histogram)
app.component("Collection", Collection)
app.component("Odometer", Odometer)
app.component("SetUp", SetUp)
app.component("Lock", Lock)
app.component("User", User)
app.component("Top", Top)
app.component("Bottom", Bottom)
app.mount("#app")
app.config.globalProperties.$echarts = echarts


export default app

// import { createApp } from 'vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import App from './App.vue'

// const app = createApp(App)

// app.use(ElementPlus)
// app.mount('#app')