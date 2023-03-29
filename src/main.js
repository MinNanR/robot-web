import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import router from './router'
import request from './utils/request'
import App from './App.vue'
import { House, Flag, Warning, CirclePlus, Plus,QuestionFilled,Document,Edit,Search } from '@element-plus/icons-vue'

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
app.mount("#app")


export default app

// import { createApp } from 'vue'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import App from './App.vue'

// const app = createApp(App)

// app.use(ElementPlus)
// app.mount('#app')