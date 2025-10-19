import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'amfe-flexible'
import { Button, Field, Uploader, Image as VanImage, Icon, NavBar, Cell, CellGroup, Tag, Toast } from 'vant'
import 'vant/lib/index.css'
import './assets/styles/index.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册Vant组件
app.use(Button)
app.use(Field)
app.use(Uploader)
app.use(VanImage)
app.use(Icon)
app.use(NavBar)
app.use(Cell)
app.use(CellGroup)
app.use(Tag)
app.use(Toast)

app.mount('#app')