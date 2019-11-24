<template>
  <div id="app">
		<div class="level navbar">
			<div class="level-item">
				<div class="subtitle">
					<router-link to="/">Home</router-link>
				</div>
			</div>
			<div class="level-item">
				<div class="subtitle">
					<router-link to="gallery">Gallery</router-link>
				</div>
			</div>
			<div class="level-item">
				<router-link to="/" class="title">
					<div class="title">
						PixelPainter
					</div>
				</router-link>
			</div>
			<div class="level-item">
				<div class="subtitle">
					<router-link to="paint">Paint!</router-link>
				</div>
			</div>
			<div class="level-item">
				<div class="subtitle">
					<router-link to="auth">Sigh in</router-link>
				</div>
			</div>
		</div>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
import "bulma/css/bulma.css"

import MainPage from './components/MainPage.vue'
import Painter from './components/Painter.vue'
import Gallery from './components/Gallery.vue'
import Auth from './components/Auth.vue'

Vue.use(VueRouter)

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
  margin-top: 60px;
}
</style>
