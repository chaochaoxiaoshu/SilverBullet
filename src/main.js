import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import dayjs from 'dayjs'
import ObjectSupport from 'dayjs/plugin/objectSupport'
import '@/assets/icons/index'

Vue.prototype.dayjs = dayjs
dayjs.extend(ObjectSupport)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
