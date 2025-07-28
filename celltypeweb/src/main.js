import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './scss/styles.scss'
import locale from 'element-ui/lib/locale/lang/en'
Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
const install = function (Vue) {
  Object.defineProperty(Vue.prototype, '$axios', { value: axios })
}
Vue.use(install)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
