<template>
	<div class="main">
		<Navbar/>
		<div class="shadow"></div>
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
		<section class="section" v-if="imageList">
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
            accountName: this.$store.getters.getUsername,
            accountMeta: '@None',
            imageList: null,
            offset: 0,
            numberOfPic: 50,
			isRequired: false
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
			axios.post('/get?token=' + this.$cookies.get('token'))
							.then((response) => {
								console.log(response.data);
								let list = []
								if (response.data["status"] === "OK") {
									for (let i = 0; i < response.data["items"].length; ++i) {
										list.push({id: i, url: response.data["items"][i].data});
									}
									this.imageList = list;
									this.drawImageOnCanvas()
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
        }
	},
    mounted() {
		this.requestImages();
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
