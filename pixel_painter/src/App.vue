<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCarousel from 'vue-carousel'
import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.css"

import MainPage from './components/MainPage.vue'
import Painter from './components/Painter.vue'
import Gallery from './components/Gallery.vue'
import Auth from './components/Auth.vue'

Vue.use(VueRouter)
Vue.use(VueCarousel)

const router = new VueRouter({
	routes: [
		{ path: '', component: MainPage },
		{ path: '/auth', component: Auth },
		{ path: '/gallery', component: Gallery },
		{ path: '/paint', component: Painter}
	]
})

export default {
  name: 'app',
  router
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
html, body {
	height: 100vh;
	min-height: 100vh;
}
</style>
