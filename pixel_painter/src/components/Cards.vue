<template>
    <div class="feed">
        <Post v-for="card in getImages"
              :key="card.id"
              :author-name="card.owner"
              :url="card.url">
        </Post>
    </div>
</template>

<script>
import Post from './Post.vue'
import Axios from 'axios'
const axios = Axios.create({
    baseURL: 'http://localhost:8080/gallery',
    timeout: 1000,
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080/',
        'allow_origins' : 'http://localhost:8080/'
    }
});

export default {
    name: 'Cards',
	props: {
			url: String,
			postAuthor: String,
			likes: Number
	},
    components: {
        Post
    },
    data: function () {
        return {
            offset: 0,
            numberOfPic: 50,
            loadedPic: 0,
            imageList: [],
            isRequired: false
        }
    },
    computed: {
        getImages() {
            if (!this.isRequired) {
                this.requestImages();
            }
            console.log(this.imageList);
            return this.imageList
        }
    },
    methods: {
        requestImages() {
            axios.post(
                '/get?'+'offset=' + this.offset + '&count=' + this.numberOfPic)
                .then((response) => {
                    console.log(response.data);
                    let list = [];
                    if (response.data["status"] === "OK") {
                        for (let i = 0; i < response.data["items"].length; ++i) {
                            list.push({
                                id: response.data["items"][i].art_id,
                                url: response.data["items"][i].data,
                                owner: response.data["items"][i].owner_name
                            });
                        }
                        console.log(list);
                        this.loadedPic = response.data["items"].length;
                        this.offset += this.loadedPic;
                        this.imageList.push.apply(this.imageList, list);
                    } else {
                        this.$router.push({name: 'Auth'})
                    }
                })
                .catch((error) => {
                    this.isRequired = false;
                    console.log(error);
                });
            this.isRequired = true;
        }
    },
}
</script>

<style scoped>
@import '../styles/Cards.css';
</style>