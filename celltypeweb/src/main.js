import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './scss/styles.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)

// Add axios to app config
app.config.globalProperties.$axios = axios

app.use(router)
app.use(store)
app.mount('#app')
