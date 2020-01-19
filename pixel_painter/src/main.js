import Vue from 'vue'
import App from './App'
import VueCookies from 'vue-cookies'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueCarousel from 'vue-carousel'

import Auth from './components/Auth'
import Home from './components/Home'
import Profile from './components/Profile'
import Painter from './components/Painter'

import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.css"
import './../node_modules/bulma/css/bulma.css'

Vue.use(VueCarousel);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueCookies);

const store = () => new Vuex.Store({
  state: {
    username: 'guest',
    cards: [
      {description: '1'},
      {description: '2'},
      {description: '3'},
      {description: '4'},
      {description: '5'},
      {description: '6'},
      {description: '7'},
      {description: '8'},
      {description: '9'},
      {description: '10'},
      {description: '11'},
      {description: '12'},
      {description: '13'},
      {description: '14'},
      {description: '15'},
      {description: '16'},
      {description: '17'},
    ]
  },
  getters: {
    getUsername: state => {
      return state.username;
    },
    DATA: state => {
      return state.cards
    }
  },
  mutations: {
    setUsername (state, username) {
      state.username = username
    } 
  }
});

const router = new VueRouter({
  routes: [
    { path: '/auth', name: 'Auth', component: Auth },
    { path: '/', name: 'Home', component: Home },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/painter', name: 'Painter', component: Painter}
  ], 
  mode: 'history'
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app');
