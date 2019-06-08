import Vue from 'vue'
import App from './App.vue'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueMask from 'v-mask'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPencilAlt, faTrashAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueMask)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
