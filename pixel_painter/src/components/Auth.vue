<template>
	<div id="auth">
		<div class="columns">
			<div class="column is-two-thirds is-hidden-mobile is-widescreen">
				<carousel :autoplay="true" :perPage="1" :paginationEnabled="true" :paginationPosition="'bottom-overlay'" :loop="true">
					<slide>
						<figure class="image is-640x640">
							<img class="carousel_item" src='../assets/main_logo.png'>
						</figure>
					</slide>
					<slide>
						<figure class="image is-640x640">
							<img class="carousel_item" src='../assets/main_logo.png'>
						</figure>
					</slide>
				</carousel>
			</div>
			<div id="register" class="column">
				<div class="field">
					<figure class="image is-1980x1080">
						<img src='../assets/main_logo.png'>
					</figure>
				</div>
				<div class="field">
					<p class="control has-icons-left">
						<input v-model="inputUsername" class="input is-rounded" type="text" placeholder="Username">
						<span class="icon is-small is-left">
							<i class="fas fa-user"></i	>
						</span>
					</p>
				</div>
				<div class="field">
					<p class="control has-icons-left">
						<input v-model="inputPassword" class="input is-rounded" type="password" placeholder="Password">
						<span class="icon is-small is-left">
							<i class="fas fa-lock"></i>
						</span>
					</p>
				</div>
				<div class="field">
					<button v-on:click="login()" class="button is-fullwidth is-rounded">
						Login
					</button>

					<button v-on:click="register()" class="button is-fullwidth is-rounded">
						Register
					</button>
				</div>
				<div id="errorMes" class="field is-hidden">
					{{ ErrorMessage }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Carousel, Slide } from 'vue-carousel'
;	export default {
		name: 'Auth',
		Carousel,
		Slide,
		data: function() {
			return {
				inputUsername: '',
				inputPassword: '',
				ErrorMessage: 'error'
			}
		},
		methods: {
			register: function() {

			},
			login: function() {

				this.$router.push({name: 'Home'})
			}
		}
	}
</script>

<style scoped>
.button {
	margin-top: 10px
}
.carousel_item{
	min-height: 100vh;
	max-height: 100vh;
}
.columns{
	min-height: 100vh;
	max-height: 100vh;
}

#auth{
	min-height: 100vh;
	max-height: 100vh;
}
#register{
	margin-top: 10px;
	max-height: 100vh - 10px;
}
</style>