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
			</div>
		</section>
		<section class="section">
			<textarea class="textarea is-fullwidth"></textarea>
		</section>
		<section class="section">
			<span class="container is-fluid" v-for="image in getImages" v-bind:key="image.id"> 
				<canvas :id="image.id" width="16" height="16"></canvas>
			</span>
		</section>
	</div>
</template>

<script>
export default {
    name: 'Profile',
    data: function(){
        return {
            accountPic: 'https://bulma.io/images/placeholders/128x128.png',
            accountName: 'John Smith',
            accountMeta: '@ggwp',
            numberOfPic: 4
        }
    },
    created: function() {
		// for (let i = 0; i < this.numberOfPic; ++i) {
		// 	var image = new Image;
		// 	image.src = this.getImages()[i].url
		// 	document.getElementById('canvas').getContext('2d').drawImage(image)
		// }
		return 0;	
    },
    methods: {
		loadPic () {

		},
        goToProfile () {
            this.$router.push({name: 'Profile'})
        },
        goToRedactor () {
            this.$router.push({name: 'Painter'})
        },
        goToHome () {
            this.$router.push({name: 'Home'})
        }
    },
    computed: {
        getImages() {
            //todo backend task
            return [{id: 0, url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAa0lEQVQ4T62TQQ4AIQgD4f+PZsPBsDatxCBHhbFAdRuGD+vtNSDCzAGaZxiVQ5LzchUhLEH7I+I1VrhUtICuOEFtC2w3vC0xgxFgl1gotiFDH6jpq1VGECOxZFRVOQcn/kF6M6+tfP+1xgo+WtAqDbTLNqoAAAAASUVORK5CYII='},
                    {id: 1, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 2, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 3, url: 'https://bulma.io/images/placeholders/96x96.png'}]
        }
    },

}
</script>

<style scoped>
  .title {
  margin-top: 10px;
  }
  canvas {
	height: 100px; 
	width: 100px;
	border: 25px solid;
  }

  @import '../css/Nuvbar.css';
</style>