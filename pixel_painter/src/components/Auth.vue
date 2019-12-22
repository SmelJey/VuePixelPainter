<template>
	<div>
		<div v-if="showModal" class="modal is-active">
			<div v-on:click="closeModal()" class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title"></p>
					<button v-on:click="closeModal()" class="delete" aria-label="close"></button>
				</header>
				<section class="modal-card-body">
					<div class="field">
						<p class="control has-icons-left">
							<input v-model="inputEmail" class="input is-rounded" type="text" placeholder="Email">
							<span class="icon is-small is-left">
								<i class="fas fa-at"></i>
							</span>
						</p>
					</div>
					<div class="field">
						<p class="control has-icons-left">
							<input v-model="inputUsername" class="input is-rounded" type="text" placeholder="Username">
							<span class="icon is-small is-left">
								<i class="fas fa-user"></i>
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
					<p v-if="haveError && showModal" class="help is-danger">{{ errorMessage }}</p>
					</section>
					<footer class="modal-card-foot">
						<button v-on:click="register()" class="button is-fullwidth is-rounded">
							Register
						</button>
						
					</footer>
			</div>
		</div>

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
							<i class="fas fa-user"></i>
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

					<button v-on:click="openModal()" class="button is-fullwidth is-rounded">
						Register
					</button>
				</div>
				<div v-if="haveError && !showModal" class="field">
					<p id="errorLoginMessage" class="help is-danger">{{ errorMessage }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Axios from 'axios'
	const axios = Axios.create({
		baseURL: 'http://localhost:8080/account',
		timeout: 1000,
		headers: {
			'Access-Control-Allow-Origin': 'http://localhost:8080/',
			'allow_origins' : 'http://localhost:8080/'
		}
	});

	import { Carousel, Slide } from 'vue-carousel'
	export default {
		name: 'Auth',
		Carousel,
		Slide,
		data: function() {
			return {
				inputEmail: '',
				inputUsername: '',
				inputPassword: '',
				errorMessage: '',
				showModal: false,
				haveError: false
			}
		},
		methods: {
			openModal: function() {
				this.showModal = true;
				this.haveError = false;
			},
			closeModal: function() {
				this.showModal = false;
				this.haveError = false;
			},
			register: function() {
				if (this.inputUsername === '') {
					this.errorMessage = 'Input username';
					this.haveError = true;
				} else if (this.inputEmail === '') {
					this.errorMessage = 'Input email';
					this.haveError = true;
				} else if (this.inputPassword.length < 6) {
					this.errorMessage = 'Password length must be more that 6 symbols';
					this.haveError = true;
				} else {
					this.haveError = false;
					axios.post('/register?login=' + this.inputUsername
							+ '&password=' + this.inputPassword
							+ '&email=' + this.inputEmail)
							.then((response) => {
								if (response.data["status"] === "OK"){
									this.$store.commit('setToken', response.data['token']);
									this.showModal = false;
								} else {
									this.haveError = true;
									this.errorMessage = 'Choose another login';
								}

								console.log(response.data);
							})
							.catch((error) => {
								this.haveError = true;
								this.errorMessage = 'Something odd happened';
								console.log(error);
							});
				}
			},
			login: function() {
				if (this.inputUsername === '') {
					this.errorMessage = 'Input username';
					this.haveError = true;
				} else if (this.inputPassword.length < 6) {
					this.errorMessage = 'Password length must be more that 6 symbols';
					this.haveError = true;
				} else {
					this.haveError = false;

					axios.post('/login?login=' + this.inputUsername
							+ '&password=' + this.inputPassword)
						.then((response) => {
							if (response.data["status"] === "OK"){
								this.$store.commit('setToken', response.data['token']);
								this.$router.push({name: 'Home'});
							} else {
								this.haveError = true;
								this.errorMessage = 'Incorrect login or password';
							}

							console.log(response.data);
						})
						.catch((error) => {
							this.haveError = true;
							this.errorMessage = 'Something odd happened';
							console.log(error);
						});
				}
			},
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
	max-height: 100vh;
}
</style>