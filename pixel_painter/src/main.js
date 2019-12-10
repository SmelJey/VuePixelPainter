import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Ingress from './components/auth'
import Home from './components/home'
import Profile from './components/profile'
import VueCarousel from 'vue-carousel'

import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.css"
import './../node_modules/bulma/css/bulma.css'

Vue.use(VueCarousel)
Vue.use(VueRouter)
Vue.use(Vuex)

const store = () => new Vuex.Store({
  
})

const router = new VueRouter({
  routes: [
    { path: '/', name: 'Ingress', component: Ingress },
    { path: '/home', name: 'Home', component: Home },
    { path: '/profile', name: 'Profile', component: Profile }
  ], 
  mode: 'history'
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
