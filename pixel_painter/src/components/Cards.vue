<template>
    <div class="feed">
        <Post v-for="card in getImages"
              :key="card.innerId"
              :art-id="card.id"
              :author-name="card.owner"
              :url="card.url"
              :likes="card.likes"
              :is-liked="card.isLiked"
              :is-req="isRequired"
              v-on:like="updateImages()">
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
            request: String
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
                isRequired: false,
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
            updateImages() {
                this.$emit('like');
                console.log('updated');
                axios.post(
                    this.request +'&offset=0' + '&count=' + this.numberOfPic)
                    .then((response) => {
                        console.log(response.data);
                        let list = [];
                        if (response.data["status"] === "OK") {
                            for (let i = 0; i < response.data["items"].length; ++i) {
                                list.push({
                                    id: response.data["items"][i].art_id,
                                    url: response.data["items"][i].data,
                                    owner: response.data["items"][i].owner_name,
                                    isLiked: response.data['items'][i].tokenLikedIt,
                                    likes: response.data['items'][i].likes,
                                    innerId: response.data['items'][i].art_id + response.data['items'][i].likes * 10000
                                });
                            }
                            console.log(list);
                            this.loadedPic = response.data["items"].length;
                            this.imageList = list;
                            this.imageList.sort((a, b) => b.id - a.id);
                            console.log(this.imageList);
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
            requestImages() {
                console.log('requested');
                axios.post(
                    this.request + '&offset=' + this.offset + '&count=' + this.numberOfPic)
                    .then((response) => {
                        console.log(response.data);
                        let list = [];
                        if (response.data["status"] === "OK") {
                            for (let i = 0; i < response.data["items"].length; ++i) {
                                list.push({
                                    id: response.data["items"][i].art_id,
                                    url: response.data["items"][i].data,
                                    owner: response.data["items"][i].owner_name,
                                    isLiked: response.data['items'][i].tokenLikedIt,
                                    likes: response.data['items'][i].likes,
                                    innerId: response.data['items'][i].art_id + response.data['items'][i].likes * 10000
                                });
                            }
                            console.log(list);
                            this.loadedPic = response.data["items"].length;
                            this.offset += this.loadedPic;
                            this.imageList.push.apply(this.imageList, list);
                            this.imageList.sort((a, b) => b.id - a.id);
                            console.log(this.imageList);
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