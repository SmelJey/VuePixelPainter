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
		<section class="section box has-text-left">
            <p class="title is-1">Profile</p>
            <p class="title is-2">{{ "@" + accountName }}</p>
            <p class="subtitle is-3">{{ [accountMeta['first_name'], accountMeta['second_name']].filter(Boolean).join(" ") }}</p>
		</section>
		<section class="section card has-text-left">
			<p class="title">Personal information: </p>
			<p class="subtitle">{{ accountMeta['age'] ? 'Age: ' + accountMeta['age'] : ''}}</p>
			<p class="subtitle">{{ accountMeta['email'] ? 'Email: ' + accountMeta['email'] : ''}}</p>
			<p class="subtitle">{{ accountMeta['country'] ? 'Country: ' + accountMeta['country'] : ''}}</p>
			<p class="subtitle">{{ accountMeta['vk_profile'] ? 'Vk: ' + accountMeta['vk_profile'] : ''}}</p>
			<button class="button is-success" v-on:click="showModal = true"> Change your personal information </button>
		</section>

		<section class="section" v-if="imageList">
            <p class="title">Personal gallery</p>
			<span class="container" v-for="image in getImages" v-bind:key="image.id">
				<canvas :id="image.id" width="16" height="16"></canvas>
			</span>
		</section>
		<div>
			<button v-if="loadedPic === 50" v-on:click="isRequired = false" class="button">Load More</button>

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
    data: function(){
        return {
            accountPic: 'https://bulma.io/images/placeholders/128x128.png',
            accountName: '',
            accountMeta: '',
            isRequired: false,
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
		requestImages() {
			axios.post(
				'/get?'+'offset=' + this.offset + '&count=' + this.numberOfPic + '&token=' + this.$cookies.get('token'))
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
		changeProfile () {

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
				Axios.get('http://localhost:8080/account/get?token=' + this.$cookies.get('token'))
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
							console.log(this.newMeta);
						} else if (response.data['status'] === 'INVALID_TOKEN') {
							this.$router.push({name: 'Auth'})
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
