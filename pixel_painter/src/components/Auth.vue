<template>
	<div id="auth">
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
			<div id="carousel" class="column is-two-thirds is-hidden-mobile is-widescreen">
				<carousel :autoplay="true" :perPage="1" :paginationEnabled="true" :paginationPosition="'bottom-overlay'" :loop="true">
					<slide>
						<figure class="image is-640x640">
							<img class="carousel_item" src='https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/134161196/original/f3c5bca081b9a7413c4e2e187c854a8046923e36/make-a-16x16-pixel-art.png'>
						</figure>
					</slide>
					<slide>
						<figure class="image is-640x640">
							<img class="carousel_item" src='http://www.photonstorm.com/wp-content/uploads/2011/09/step4.gif'>
						</figure>
					</slide>
				</carousel>
			</div>
			<div id="register" class="column">
				<div id="logoback" class="field">
					<figure id="logo" class="image is-1980x1080">
						<router-link to="/"><img src='../assets/main_logo.png'></router-link>
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

	import { Carousel, Slide } from 'vue-carousel'
	export default {
		name: 'Auth',
		Carousel,
		Slide,
		props: {
			cb: String
		},
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
				this.inputUsername = '';
				this.inputPassword = '';
				this.inputEmail = '';
				this.haveError = false;
			},
			closeModal: function() {
				this.showModal = false;
				this.inputUsername = '';
				this.inputPassword = '';
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
					this.errorMessage = 'Password length must be more that 6 characters';
					this.haveError = true;
				} else {
					this.haveError = false;
					let req = '/account/register?login=' + this.inputUsername
							+ '&password=' + this.inputPassword
							+ '&email=' + this.inputEmail;
					Axios.post(req)
						.then((response) => {
							if (response.data["status"] === "OK") {
								this.showModal = false;
							} else {
								this.haveError = true;
								this.errorMessage = 'Incorrect input';
							}
						})
						.catch(() => {
							this.haveError = true;
							this.errorMessage = 'Incorrect input';
						});
				}
			},
			login: function() {
				if (this.inputUsername === '') {
					this.errorMessage = 'Input username';
					this.haveError = true;
				} else if (this.inputPassword.length < 6) {
					this.errorMessage = 'Password length must be more that 6 characters';
					this.haveError = true;
				} else {
					this.haveError = false;

					let req = '/account/login?login=' + this.inputUsername
							+ '&password=' + this.inputPassword;

					Axios.get(req)
						.then((response) => {
							if (response.data["status"] === "OK"){
								this.$cookies.set('token', response.data['token'], 3600);
								this.$cookies.set('login', this.inputUsername, 3600);
								if (this.cb != null) {
									let route = this.cb;
									if (this.cb === '/profile') {
										route = '/profile?id=' + this.inputUsername
									}
									this.$router.push(route);
								} else {
									this.$router.push({name: 'Home'});
								}
							} else {
								this.haveError = true;
								this.errorMessage = 'Incorrect login or password';
							}
						})
						.catch(() => {
							this.haveError = true;
							this.errorMessage = 'Incorrect login or password';
						});
				}
			},
		}
	}
</script>

<style scoped>

#logo {
	padding: 20px 15px 20px 20px;
}

.button {
	margin-top: 10px;
}

.carousel_item{
	min-height: 100vh;
	max-height: 100vh;
}

.field {
	margin-left: 10px;
	margin-top: 10px;
	margin-right: 20px;
}

#carousel {
	padding-right: 0;
	padding-bottom: 0;
	margin-bottom: 0;
}

#logoback {
	margin: 0 0 0 0;
	background-color: #fe6e4b;
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.45);
}

#register{
	padding: 0 0 0 0;
	height: 100%;
}
</style>