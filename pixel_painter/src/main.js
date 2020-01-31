import Vue from 'vue'
import App from './App'
import VueCookies from 'vue-cookies'
import VueRouter from 'vue-router'
import VueCarousel from 'vue-carousel'
import Axios from 'axios'

import Auth from './components/Auth'
import Home from './components/Home'
import Profile from './components/Profile'
import Painter from './components/Painter'

import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.css"
import './../node_modules/bulma/css/bulma.css'


Axios.defaults.baseURL = "http://5.63.159.185:8080";

Vue.use(VueCarousel);
Vue.use(VueRouter);
Vue.use(VueCookies);

const router = new VueRouter({
  routes: [
    { path: '/auth', name: 'Auth', component: Auth, props: (route) => ({ cb: route.query.cb }) },
    { path: '/', name: 'Home', component: Home },
    { path: '/profile', name: 'Profile', component: Profile, props: (route) => ({ id: route.query.id }) },
    { path: '/painter', name: 'Painter', component: Painter}
  ], 
  mode: 'history'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app');
