<template>
	<div class="main">
		<Navbar/>
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
					<p class=" names">Имя</p>
					<input id="fname" class="input not-lvl" type="text" placeholder="First Name"  v-model="newMeta['first_name']"/>
					<p class=" names">Фамилия</p>
					<input id="sname" class="input not-lvl" type="text" placeholder="Second Name" v-model="newMeta['second_name']"/>
					<p class=" names">Возвраст</p>
					<input id="age" class="input not-lvl" type="text" placeholder="Age" v-model="newMeta['age']"/>
					<p class=" names">Страна</p>
					<input id="country" class="input not-lvl" type="text" placeholder="Country" v-model="newMeta['country']"/>
					<p class=" names">VK</p>
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
					<h1 class="title is-1"> Profile </h1>
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
			<div id="Gallery" class="content-tab">
				<Cards :request="'/get?token=' + this.$cookies.get('token') + '&login=' + this.id" v-on:like="requestMeta()" />
			</div>
			<div id="About" style="display:none;" class="content-tab">
				<p class="subtitle mobile-text is-5">{{ [accountMeta['first_name'], accountMeta['second_name']].filter(Boolean).join(" ") }}</p>
				<p class="subtitle mobile-text">{{ accountMeta['age'] ? 'Age: ' + accountMeta['age'] : ''}}</p>
				<p class="subtitle mobile-text">{{ accountMeta['email'] ? 'Email: ' + accountMeta['email'] : ''}}</p>
				<p class="subtitle mobile-text">{{ accountMeta['country'] ? 'Country: ' + accountMeta['country'] : ''}}</p>
				<p class="subtitle mobile-text"><a v-bind:href="accountMeta['vk_profile']">{{ accountMeta['vk_profile'] ? 'VK: ' + accountMeta['vk_profile'] : ''}}</a></p>
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
	const axios = Axios.create({
		baseURL: 'http://localhost:8080/gallery',
		timeout: 1000,
		headers: {
			'Access-Control-Allow-Origin': 'http://localhost:8080/',
			'allow_origins' : 'http://localhost:8080/'
		}
	});

	import Cards from './Cards.vue'
	import Navbar from './Navbar.vue'
	export default {
		name: 'Profile',
		components: {
			Navbar,
			Cards
		},
		props: ['id'],
		data: function(){
			return {
				accountPic: 'https://bulma.io/images/placeholders/128x128.png',
				accountName: '',
				isSelf: false,
				isInvalid: false,
				accountMeta: '',
				isRequired: false,
				currentTab: 'Gallery',
				likesCount: 0,
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
		computed: {
			getImages() {
				if (!this.isRequired) {
					this.requestImages();
				}
				return this.imageList
			}
		},
		methods: {
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
			requestImages() {
				axios.post(
					'/get?'+'offset=' + this.offset + '&count=' + this.numberOfPic
						+ '&login=' + this.id + '&token=' + this.$cookies.get('token'))
								.then((response) => {
									console.log(response.data);
									let list = [];
									if (response.data["status"] === "OK") {
										for (let i = 0; i < response.data["items"].length; ++i) {
											list.push({id: i + this.offset, url: response.data["items"][i].data});
										}
										this.loadedPic = response.data["items"].length;
										this.offset += this.loadedPic;
										this.imageList.push.apply(this.imageList, list);
										this.drawImageOnCanvas();
									} else {
										this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
									}
								})
								.catch((error) => {
									this.isRequired = false;
									console.log(error);
								});
				this.isRequired = true;
			},
			drawImageOnCanvas() {
				for (let i = 0; i < this.imageList.length; ++i) {
					let item = this.imageList[i];
					let canvas = document.getElementById(item.id).getContext('2d');
					let image = new Image(16, 16);
					image.src = item.url;
					image.onload = function() {
						canvas.drawImage(image, 0, 0)
					}
				}
			},
			requestMeta() {
				console.log("requested");

				Axios.get('http://localhost:8080/account/check_token?token=' + this.$cookies.get('token'))
					.then((response) => {
						let req = 'token=' + this.$cookies.get('token');
						if (response.data['status'] !== 'OK' || this.$cookies.get('login') !== this.id) {
							this.isSelf = false;
							req = 'login=' + this.id;
						}
						Axios.get('http://localhost:8080/account/get?' + req)
								.then((response) => {
									console.log(response.data);
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
										console.log(this.newMeta);
									} else if (response.data['status'] === 'INVALID_TOKEN') {
										this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
									} else if (response.data['status'] === 'INVALID_LOGIN') {
										this.isInvalid = true;
									}
								}).catch((error) => {
									console.log(error);
								})
					})
					.catch((error) => {
						console.log(error);
					});


			},
			saveMeta() {
				console.log(this.newMeta);
				let updatedMeta = [];
				for (let item in this.newMeta) {
					if (Object.prototype.hasOwnProperty.call(this.newMeta, item)) {
						if (this.newMeta[item] === undefined ||  item === 'password' || item === 'likes'
								|| item === 'email' || item === 'login' || this.newMeta[item] === "" || this.newMeta[item] === 0)
							continue;

						updatedMeta.push(item);
					}

				}

				if (updatedMeta.length > 0) {
					let req = 'http://localhost:8080/account/edit?&field=';
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
							console.log(response.data);
							if (response.data['status'] === 'INVALID_TOKEN') {
								if (this.$router.currentRoute.name !== 'Auth')
									this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
							}
							this.requestMeta();
							if (response.data['status'] === 'OK') {
								this.showModal = false;
							} else {
								this.error = "Not all information was processed"
							}

						}).catch((error) => {
							console.log(error);
						});
				}
			},
			changePass() {
				if (this.newMeta['password'] == null || this.newMeta['password'].length < 6) {
					this.error = "Incorrect pass";
				} else {
					Axios.post('http://localhost:8080/account/edit?&field=' + 'password' + '&value='
							+ this.newMeta['password'] + '&token=' + this.$cookies.get('token'))
							.then((response) => {
								console.log(response.data);
								if (response.data['status'] === 'FAIL') {
									this.error = "Incorrect pass"
								} else {
									this.error = "";
									if (this.$router.currentRoute.name !== 'Auth')
										this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
								}
							}).catch((error) => {
						console.log(error);
					})
				}
			},
			changeEmail() {
				if (this.newMeta['email'] == null) {
					this.error = "Incorrect pass";
				} else {
					Axios.post('http://localhost:8080/account/edit?&field=' + 'email' + '&value='
							+ this.newMeta['email'] + '&token=' + this.$cookies.get('token'))
							.then((response) => {
								console.log(response.data);
								if (response.data['status'] === 'FAIL') {
									this.error = "Incorrect email"
								} else {
									this.error = "";
									if (this.$router.currentRoute.name !== 'Auth')
										this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
								}
							}).catch((error) => {
						console.log(error);
					})
				}
			},
			closeModal() {
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

@font-face {
	font-family: 'PixelFont';
	src: url('../assets/font/pixelfont.woff') format('woff'), /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
		url('../assets/font/pixelfont.ttf') format('truetype');

}

.title {
  margin-top: 10px;
}

.container {
	margin: 5px 5px 5px 5px;
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
	font-family: "PixelFont";
	font-weight: bold;
	font-size: 30px;
}

.subtitle {
	font-family: "PixelFont";
	font-weight: bold;
	font-size: 30px;
}

.tab {
	font-family: "PixelFont";
	font-weight: bold;
	font-size: 30px;
}

.title {
  margin-top: 10px;
  font-family: "PixelFont";
  font-weight: bold;
  font-size: 30px;
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

.container {
	margin: 5px 5px 5px 5px;
}

.shadow {
	height: 25px;
}

.likebutton {
	padding: 0;
	border: none;
	background: none;
	outline: none;
	margin-left: 5px;
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
		font-family: "PixelFont";
		font-weight: bold;
		font-size: large;
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
