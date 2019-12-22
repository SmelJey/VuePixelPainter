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
import Navbar from './Navbar.vue'
export default {
	name: 'Profile',
	components: {
		Navbar
	},
    data: function(){
        return {
            accountPic: 'https://bulma.io/images/placeholders/128x128.png',
            accountName: 'John Smith',
            accountMeta: '@ggwp'
        }
    },
    computed: {
        getImages() {
            //todo backend task
            return [{id: 0, url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAa0lEQVQ4T62TQQ4AIQgD4f+PZsPBsDatxCBHhbFAdRuGD+vtNSDCzAGaZxiVQ5LzchUhLEH7I+I1VrhUtICuOEFtC2w3vC0xgxFgl1gotiFDH6jpq1VGECOxZFRVOQcn/kF6M6+tfP+1xgo+WtAqDbTLNqoAAAAASUVORK5CYII='},
                    {id: 1, url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T61QQQ6AMAhjX/HmW4xvcr7J+Jbd/IqmJJ1siQeGXICVdoV0F7klEAkC+5xVYitZWPc9MWQE5lBXgR7gALMl2Q/dAtZZ4yC0QuCG7w1GROoKI2Ry9IhhgWOZVGM9L2Hd98SQEZhDrQ7YWIBvXxg/cAtYZ42D0Aq/HdErVFfwEu38Awoqt2EXKMQzAAAAAElFTkSuQmCC'},
                    {id: 2, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 3, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 4, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 5, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 6, url: 'https://bulma.io/images/placeholders/96x96.png'}]
        }
    },
    methods: {
        drawImageOnCanvas () {
			for (var i = 0; i < this.getImages.length; ++i) {
				let item = this.getImages[i]
				var canvas = document.getElementById(item.id)
				if (canvas != null) {
					var ctx = canvas.getContext('2d');
					var image = new Image(16, 16)
					image.src = item.url
					ctx.drawImage(image, 0, 0)
					console.log(item)
					console.log(image)
				}
			}
        }
	},
    mounted() {
		this.$nextTick(this.drawImageOnCanvas());
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
.shadow {
	height: 25px;
}
</style>