<template>
	<div>
		<div class="main">
			<nav>
				<div class="content">
					<img src="../assets/main_logo.png">
					<div class="links">
						<a><img @click="goToRedactor()" src="../assets/icons/pen_icon.png"></a>
						<a><img @click="goToProfile()" src="../assets/icons/people_icon.png"></a>
					</div>
				</div>
			</nav>
		</div>
		<section class="section">
			<div class="media">
				<div class="media-left">
					<figure class="image is128x128">
						<img class="is-rounded" :src="accountPic">
					</figure>
				</div>
				<div class="media-content">
					<p class="title is-2">{{ accountName }}</p>
					<p class="subtitle is-3">{{ accountMeta }}</p>
				</div>
				<div class="media-right">
				</div>
			</div>
		</section>
		<section class="section">
			<textarea class="textarea is-fullwidth"></textarea>
		</section>
		<section class="section">
			<span class="container" v-for="image in getImages" v-bind:key="image.id"> 
				<canvas :id="image.id" width="16" height="16"></canvas>
			</span>
		</section>
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
	})

export default {
    name: 'Profile',
    data: function(){
        return {
            accountPic: 'https://bulma.io/images/placeholders/128x128.png',
            accountName: this.$store.getters.getUsername,
            accountMeta: '@None',
            imageList: [],
            offset: 0,
            numberOfPic: 50
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
			axios.post('/get?token=' + this.$store.getters.getToken)
							.then((response) => {
								console.log(response.data);
								if (response.data["status"] === "OK") {
									for (let i = 0; i < response.data["items"].length(); ++i) {
										this.imageList.push({id: i, url: response.data["items"][i].data});
									}
								} else {
									this.goToAuth();
								}
								this.isRequired = true;
							})
							.catch((error) => {
								console.log(error);
							});
		},
		changeProfile () {

		},
		goToAuth () {
			this.$router.push({name: 'Auth'})
		},
        goToProfile () {
            this.$router.push({name: 'Profile'})
        },
        goToRedactor () {
            this.$router.push({name: 'Painter'})
        },
        goToHome () {
            this.$router.push({name: 'Home'})
        },
        drawImageOnCanvas () {
			console.log('test')
			for (var i = 0; i < this.getImages.length; ++i) {
				let item = this.getImages[i]
				var canvas = document.getElementById(item.id).getContext('2d')
				var image = new Image(16, 16)
				image.src = item.url
				console.log(image);
				image.onload = function() {
					canvas.drawImage(image, 0, 0)
				}
			}
        }
    },
    mounted() {
		this.drawImageOnCanvas();
    }

}
</script>

<style scoped>
  .title {
  margin-top: 10px;
  }
  canvas {
	height: 200px; 
	width: 200px;
	border: 10px solid;
  }
  .container {
	margin: 5px 5px 5px 5px;
  }

  @import '../css/Nuvbar.css';
</style>