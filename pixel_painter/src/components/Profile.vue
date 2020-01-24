<template>
	<div class="main">
		<Navbar/>
		<div class="shadow"></div>
		<div class="modal is-active" v-if="showModal">
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">Change personal information</p>
					<button class="delete" aria-label="close" v-on:click="closeModal"></button>
				</header>
				<section class="modal-card-body">
					<div class="level">
						<input id="email" class="input" type="text" placeholder="Email" v-model="newMeta['email']"/>
						<button class="button is-success" v-on:click="changeEmail">Change Email</button>
					</div>

					<div class="level">
						<input id="pswd" class="input" type="password" placeholder="Password" v-model="newMeta['password']"/>
						<button class="button is-success" v-on:click="changePass">Change password</button>
					</div>

					<input id="fname" class="input" type="text" placeholder="First Name"  v-model="newMeta['first_name']"/>
					<input id="sname" class="input" type="text" placeholder="Second Name" v-model="newMeta['second_name']"/>
					<input id="age" class="input" type="text" placeholder="Age" v-model="newMeta['age']"/>
					<input id="country" class="input" type="text" placeholder="Country" v-model="newMeta['country']"/>
					<input id="vk" class="input" type="text" placeholder="VK" v-model="newMeta['vk_profile']"/>
				</section>
				<footer class="modal-card-foot">
					<button class="button is-success" v-on:click="saveMeta">Save</button>
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
				</div>
			</div>
			<div class="hero-foot">
				<nav class="tabs is-boxed is-fullwidth is-large">
					<ul>
						<li class="tab is-active" v-on:click="openTab('Gallery')"><a>Gallery</a></li>
						<li class="tab" v-on:click="openTab('About')"><a>About</a></li>
					</ul>
				</nav>
			</div>
		</section>
		<div class="box section" v-if="!isInvalid">
			<div id="Gallery" class="content-tab">
				<span class="container" v-for="image in getImages" v-bind:key="image.id">
					<canvas :id="image.id" width="16" height="16"></canvas>
				</span>
				<div>
					<button v-if="loadedPic === 50" v-on:click="isRequired = false" class="button">Load More</button>
				</div>
			</div>
			<div id="About" style="display:none;" class="content-tab">
				<p class="subtitle is-5">{{ [accountMeta['first_name'], accountMeta['second_name']].filter(Boolean).join(" ") }}</p>
				<p class="subtitle">{{ accountMeta['age'] ? 'Age: ' + accountMeta['age'] : ''}}</p>
				<p class="subtitle">{{ accountMeta['email'] ? 'Email: ' + accountMeta['email'] : ''}}</p>
				<p class="subtitle">{{ accountMeta['country'] ? 'Country: ' + accountMeta['country'] : ''}}</p>
				<p class="subtitle">{{ accountMeta['vk_profile'] ? 'Vk: ' + accountMeta['vk_profile'] : ''}}</p>
				<button class="button is-success" v-if="isSelf" v-on:click="showModal = true"> Change your personal information </button>
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

import Navbar from './Navbar.vue'
export default {
	name: 'Profile',
	components: {
		Navbar
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
			var i, x, tablinks;
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
				'/get?'+'offset=' + this.offset + '&count=' + this.numberOfPic + '&login=' + this.id)
							.then((response) => {
								console.log(response.data);
								let list = [];
								if (response.data["status"] === "OK") {
									for (let i = 0; i < response.data["items"].length; ++i) {
										list.push({id: i + this.offset , url: response.data["items"][i].data});
									}
                                    this.loadedPic = response.data["items"].length;
                                    this.offset += this.loadedPic;
									this.imageList.push.apply(this.imageList, list);
									this.drawImageOnCanvas();
								} else {
									this.$router.push({name: 'Auth'})
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
		requestMeta(){
			if (this.$cookies.get('token') !== null){
				console.log("requested");
				Axios.get('http://localhost:8080/account/get?login=' + this.id)
					.then((response) => {
						console.log(response.data);
						if (response.data['status'] === 'OK') {
							this.accountName = response.data['login'];
							this.accountMeta = response.data;

							for (let i in response.data) {
								if (Object.prototype.hasOwnProperty.call(response.data, i)) {
									this.accountMeta[i] = response.data[i];
									this.newMeta[i] = this.accountMeta[i];
								}
							}
							if (this.accountName === this.$cookies.get('login')){
								this.isSelf = true;
							}
							console.log(this.newMeta);
						} else if (response.data['status'] === 'INVALID_TOKEN') {
							this.$router.push({name: 'Auth'})
						} else if (response.data['status'] === 'INVALID_LOGIN') {
							this.isInvalid = true;
						}
					}).catch((error) => {
						console.log(error);
					})
			} else {
				this.$router.push({name: 'Auth'})
			}
		},
		saveMeta() {
			console.log(this.newMeta);

			Axios.post('http://localhost:8080/account/edit?&field=first_name,second_name,age,vk_profile,country'
					+ "&value=" + this.newMeta["first_name"] + "," + this.newMeta["second_name"] + ","
					+ this.newMeta["age"] + "," + this.newMeta["vk_profile"] + "," + this.newMeta["country"]
					+ "&token=" + this.$cookies.get('token'))
					.then((response) => {
						console.log(response.data);
						if (response.data['status'] === 'INVALID_TOKEN') {
							if (this.$router.currentRoute.name !== 'Auth')
								this.$router.push({name: 'Auth'})
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
		},
		changePass() {
			Axios.post('http://localhost:8080/account/edit?&field=' + 'password' + '&value='
				+ this.newMeta['password'] + '&token=' + this.$cookies.get('token'))
				.then((response) => {
					console.log(response.data);
					if (response.data['status'] === 'FAIL') {
						this.error = "Incorrect pass"
					} else {
						this.error = "";
						if (this.$router.currentRoute.name !== 'Auth')
							this.$router.push({name: 'Auth'})
					}
				}).catch((error) => {
					console.log(error);
				})
		},
		changeEmail() {
			Axios.post('http://localhost:8080/account/edit?&field=' + 'email' + '&value='
					+ this.newMeta['email'] + '&token=' + this.$cookies.get('token'))
					.then((response) => {
						console.log(response.data);
						if (response.data['status'] === 'FAIL') {
							this.error = "Incorrect email"
						} else {
							this.error = "";
							if (this.$router.currentRoute.name !== 'Auth')
								this.$router.push({name: 'Auth'})
						}
					}).catch((error) => {
				console.log(error);
			})
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
		console.log(2);
	}	

}
</script>

<style scoped>
@import '../styles/Main.css';
.title {
  margin-top: 10px;
}

.section {
	background-color: #f7efed;
}

canvas {
	height: 200px; 
	width: 200px;
	border: 10px solid;
 }

.container {
	margin: 5px 5px 5px 5px;
}

.shadow {
	height: 25px;
}
</style>
