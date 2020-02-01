<template>
	<div class="main" :id="accountName">
		<Navbar v-on:redirect="redirect" />
		<div class="shadow"></div>
		<div class="modal is-active" v-if="showModal">
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title mobile-text">Change personal information</p>
					<button class="delete" aria-label="close" v-on:click="closeModal"></button>
				</header>
				<section class="modal-card-body">
					<div class="level">
						<input id="email" class="input is-fullwidth lvl-input" type="text" placeholder="Email" v-model="newMeta['email']"/>
						<button class="button is-success is-fullwidth-mobile lvl-input" v-on:click="changeEmail">Change Email</button>
					</div>

					<div class="level">
						<input id="pswd" class="input is-fullwidth lvl-input" type="password" placeholder="Password" v-model="newMeta['password']"/>
						<button class="button is-success is-fullwidth-mobile lvl-input" v-on:click="changePass">Change password</button>
					</div>
					<p class="names">First name</p>
					<input id="fname" class="input not-lvl" type="text" placeholder="First Name"  v-model="newMeta['first_name']"/>
					<p class="names">Second name</p>
					<input id="sname" class="input not-lvl" type="text" placeholder="Second Name" v-model="newMeta['second_name']"/>
					<p class="names">Age</p>
					<input id="age" class="input not-lvl" type="text" placeholder="Age" v-model="newMeta['age']"/>
					<p class="names">Country</p>
					<input id="country" class="input not-lvl" type="text" placeholder="Country" v-model="newMeta['country']"/>
					<p class="names">VK</p>
					<input id="vk" class="input not-lvl" type="text" placeholder="VK" v-model="newMeta['vk_profile']"/>
				</section>
				<footer class="modal-card-foot">
					<button class="button is-success is-fullwidth-mobile" v-on:click="saveMeta">Save</button>
					<label class="notification is-danger" v-if="this.error.length > 0">{{this.error}}</label>
				</footer>
			</div>
		</div>

		<section class="hero" v-if="!isInvalid">
			<div class="hero-body">
				<div class="has-text-centered">
					<h1 class="title specialFont is-1"> Profile </h1>
					<h2 class="subtitle is-2">
						{{"@" + accountName}}
					</h2>
					<h2 id="likes" class="subtitle is-4"><img src="../assets/icons/fill_like.png" height="25px" width="25px"/>{{ '   ' + this.likesCount }}</h2>
				</div>
			</div>
			<div class="hero-foot">
				<nav class="tabs is-boxed is-fullwidth">
					<ul>
						<li class="tab mobile-text is-active" v-on:click="openTab('Gallery')"><a>Gallery</a></li>
						<li class="tab mobile-text" v-on:click="openTab('About')"><a>About</a></li>
					</ul>
				</nav>
			</div>
		</section>
		<div class="box section" v-if="!isInvalid">
			<div id="Gallery" :key="galleryReq" class="content-tab">
				<Cards :request="this.galleryReq" v-on:like="requestMeta()" />
			</div>
			<div id="About" style="display:none;" class="content-tab">
				<p class="subtitle mobile-text is-5">{{ [accountMeta['first_name'], accountMeta['second_name']].filter(Boolean).join(" ") }}</p>
				<p class="subtitle mobile-text">{{ accountMeta['age'] ? 'Age: ' + accountMeta['age'] : ''}}</p>
				<p class="subtitle mobile-text"><i class="fas fa-map-marker-alt"></i>{{ accountMeta['country'] ? accountMeta['country'] : 'Alien'}}</p>
				<p class="subtitle specialFont mobile-text">Contact:</p>
				<p class="subtitle mobile-text"><i class="fas fa-envelope"></i> {{ accountMeta['email'] ? accountMeta['email'] : 'Outerspace'}}</p>
				<p class="subtitle mobile-text" v-show="accountMeta['vk_profile'] != ''"><i class="fab fa-vk"></i><a v-bind:href="accountMeta['vk_profile']">{{ accountMeta['vk_profile'] ? accountMeta['vk_profile'] : ''}}</a></p>
				<button class="button changeProfileButton mobile-text is-success" v-if="isSelf" v-on:click="showModal = true"> Change your personal information </button>
			</div>
		</div>
		<div class="section box" v-if="isInvalid">
			<h1 class="subtitle"> Error: there is no such profile</h1>
		</div>
	</div>
</template>

<script>
	import Axios from 'axios'

	import Cards from './Cards.vue'
	import Navbar from './Navbar.vue'
	export default {
		name: 'Profile',
		components: {
			Navbar,
			Cards
		},
		props: ['id'],
		data: function() {
			return {
				accountPic: 'https://bulma.io/images/placeholders/128x128.png',
				accountName: '',
				isSelf: false,
				isInvalid: false,
				accountMeta: '',
				isRequired: false,
				currentTab: 'Gallery',
				likesCount: 0,
				galleryReq: '/get?token=' + this.$cookies.get('token') + '&login=' + this.id,
				newMeta: {
					first_name: '',
					second_name: '',
					age: 0,
					country: '',
					vk_profile: ''
				},
				imageList: [],
				offset: 0,
				numberOfPic: 50,
				showModal: false,
				error: "",
				reqCount: 0,
				loadedPic: 0
			}
		},
		methods: {
			redirect() {
				this.$nextTick(() => {
					this.requestMeta();
					this.galleryReq = '/get?token=' + this.$cookies.get('token') + '&login=' + this.id;
					this.$forceUpdate();
				});

			},
			openTab(tabName) {
				let i, x, tablinks;
				x = document.getElementsByClassName("content-tab");
				for (i = 0; i < x.length; i++) {
					x[i].style.display = "none";
				}
				tablinks = document.getElementsByClassName("tab");
				if (tabName !== this.currentTab) {
					for (i = 0; i < x.length; i++) {
						if (tablinks[i].className.includes("is-active")) {
							tablinks[i].className = tablinks[i].className.replace(" is-active", "");
						} else {
							tablinks[i].className += " is-active";
						}
					}
				}
				this.currentTab = tabName;

				document.getElementById(tabName).style.display = "block";
			},
			requestMeta() {
				let req = '/account/check_token?token=' + this.$cookies.get('token');
				Axios.get(req)
					.then((response) => {
						let req = 'token=' + this.$cookies.get('token');
						if (response.data['status'] !== 'OK' || this.$cookies.get('login') !== this.id) {
							this.isSelf = false;
							req = 'login=' + this.id;
						}
						req = '/account/get?' + req;
						Axios.get(req)
							.then((response) => {
								if (response.data['status'] === 'OK') {
									this.accountName = response.data['login'];
									this.accountMeta = response.data;

									for (let i in response.data) {
										if (i === 'status')
											continue;
										if (Object.prototype.hasOwnProperty.call(response.data, i)) {
											this.accountMeta[i] = response.data[i];
											this.newMeta[i] = this.accountMeta[i];
										}
									}
									this.likesCount = this.newMeta['likes'];
									if (this.$cookies.get('login') != null
											&& this.accountName === this.$cookies.get('login')){
										this.isSelf = true;
									}
								} else if (response.data['status'] === 'INVALID_TOKEN') {
									this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
								} else if (response.data['status'] === 'INVALID_LOGIN') {
									this.isInvalid = true;
								}
							})
					})

			},
			saveMeta() {
				let updatedMeta = [];
				for (let item in this.newMeta) {
					if (Object.prototype.hasOwnProperty.call(this.newMeta, item)) {
						if (this.newMeta[item] === undefined ||  item === 'password' || item === 'likes' || item === 'status'
								|| item === 'email' || item === 'login' || this.newMeta[item] === "" || this.newMeta[item] === 0)
							continue;

						if (item !== 'age' && this.newMeta[item].includes(',')) {
							this.error = "Incorrect information";
							return;
						}

						updatedMeta.push(item);
					}

				}

				if (updatedMeta.length > 0) {
					let req = '/account/edit?&field=';
					for (let i in updatedMeta) {
						req += updatedMeta[i];
						req += ',';
					}
					req = req.slice(0, -1);
					req += '&value=';
					for (let i in updatedMeta) {
						req += this.newMeta[updatedMeta[i]];
						req += ',';
					}
					req = req.slice(0, -1);
					req += "&token=" + this.$cookies.get('token');

					Axios.post(req)
						.then((response) => {
							if (response.data['status'] === 'INVALID_TOKEN') {
								if (this.$router.currentRoute.name !== 'Auth')
									this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
							}
							this.requestMeta();
							if (response.data['status'] === 'OK') {
								this.error = "";
								this.showModal = false;
							} else {
								this.error = "Incorrect information"
							}

						}).catch(() => {
							this.error = "Incorrect information"
						});
				}
			},
			changePass() {
				if (this.newMeta['password'] == null || this.newMeta['password'].length < 6) {
					this.error = "Incorrect pass";
				} else {
					let req = '/account/edit?&field=' + 'password' + '&value='
							+ this.newMeta['password'] + '&token=' + this.$cookies.get('token');
					Axios.post(req)
						.then((response) => {
							if (response.data['status'] === 'FAIL') {
								this.error = "Incorrect pass"
							} else {
								this.error = "";
								if (this.$router.currentRoute.name !== 'Auth')
									this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
							}
						}).catch(() => {
							this.error = "Incorrect pass"
						})
				}
			},
			changeEmail() {
				if (this.newMeta['email'] == null) {
					this.error = "Incorrect pass";
				} else {
					let req = '/account/edit?&field=' + 'email' + '&value='
							+ this.newMeta['email'] + '&token=' + this.$cookies.get('token');
					Axios.post(req)
						.then((response) => {
							if (response.data['status'] === 'FAIL') {
								this.error = "Incorrect email"
							} else {
								this.error = "";
								if (this.$router.currentRoute.name !== 'Auth')
									this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
							}
						}).catch(() => {
							this.error = "Incorrect email"
						})
				}
			},
			closeModal() {
				this.error = "";
				this.showModal = false;
				for (let i in this.accountMeta) {
					if (Object.prototype.hasOwnProperty.call(this.accountMeta, i)) {
						this.newMeta[i] = this.accountMeta[i];
					}
				}
			}
		},
		mounted() {
			this.requestMeta();
		}
	}
</script>

<style scoped>
@import '../styles/Main.css';

.title {
  margin-top: 10px;
}

.shadow {
	height: 25px;
}

.changeProfileButton {
	font-family: "PixelFont";
	font-size: 20px;
}

#likes {
	font-size: 30px;
}

.not-lvl {
	margin-top: 15px;
}

.modal-card-title {
	font-family: "PixelFont";
	font-weight: bold;
	font-size: 30px;
}

.subtitle.is-5 {
	font-family: "Bookman";
	font-weight: bold;
	font-size: 30px;
}

.subtitle.is-2 {
	font-family: "Bookman";
	font-weight: bold;
	font-size: 30px;
}

.fab {
	margin-right: 10px;
}

.fas {
	margin-right: 10px;
}

.subtitle.specialFont {
	font-family: "PixelFont";
	font-weight: bold;
	font-size: 30px;
}

.subtitle {
	font-family: "Bookman";
	font-weight: bold;
	font-size: 25px;
}

.tab {
	font-family: "PixelFont";
	font-weight: bold;
	font-size: 30px;
}

.title.specialFont {
  margin-top: 10px;
  font-family: "PixelFont";
  font-weight: bold;
  font-size: 40px;
}

.names {
	font-size: medium;
	text-align: left;
	margin-top: 15px;
	margin-left: 2px;	
}

.section {
	background-color: #f7efed;
}

.shadow {
	height: 25px;
}

a {
	color: inherit;
}

a:visited {
	color: inherit; /* Цвет посещенных ссылок */
}

a:active {
	color: inherit; /* Цвет активных ссылок */
}

@media screen and (max-width: 768px), print {
	.button.is-fullwidth-mobile {
		display: flex;
		width: 100%;
	}
	.button.lvl-input {
		margin-top: 10px;
	}

	.subtitle.mobile-text {
		font-weight: bold;
		font-size: large;
	}
	.subtitle.specialFont.mobile-text{
		font-weight: bold;
		font-size: 25px;
	}

	.changeProfileButton.mobile-text {
		font-size: large;
	}

	.tab.mobile-text {
		font-size: large;
	}
	.modal-card-title.mobile-text {
		font-size: large;
	}
}
</style>
