<template>
    <div class="post">
        <div class="card">
            <img class="photo" height="340px" width="340" :src="this.url"/>
            <div class="shadow"/>
            <div class="user">
                <div class="min">
                    <a><img class="ava" @click="goToProfile()" src="../assets/test/ava.jpg"/></a>
                    <div>
                        <a><p v-on:click="goToProfile()">Andrey</p></a>
                    </div>
                    <div class="like">
                        <a><img src="../assets/icons/like.png" height="25px" width="25px" v-on:click="clickLike()"/></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios'
    const axios = Axios.create({
        baseURL: 'http://localhost:8080/likes',
        timeout: 1000,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8080/',
            'allow_origins' : 'http://localhost:8080/'
        }
    });

export default {
    name: 'Post',
    props: {
        artId: Number,
        url: String,
        authorName: String,
        likes: Number,
        isLiked: Boolean
    },
    methods: {
        clickLike() {
            if (this.isLiked) {
                axios.post('/remove?art_id=' + this.artId + '&token=' + this.$cookies.get('token'))
                .then((response) => {
                    console.log(response);
                    if (response.data['status'] === 'INVALID_TOKEN') {
                        this.$router.push({ name: 'Auth' });
                    }// else if (response.data['status'] === 'OK') {
                        // this.isLiked = false
                    //}
                })
                .catch((error) => {
                    console.log(error);
                })
            } else {
                axios.post('/add?art_id=' + this.artId + '&token=' + this.$cookies.get('token'))
                .then((response) => {
                    console.log(response);
                    if (response.data['status'] === 'INVALID_TOKEN') {
                        this.$router.push({ name: 'Auth' });
                    }// else if (response.data['status'] === 'OK') {
                        // this.isLiked = true;
                    //}
                })
            }
        },
        goToProfile () {
            this.$router.push('/profile?id=' + this.authorName)
        },
        drawImage () {
            let canvas = document.getElementById("picture").getContext('2d');
            let image = new Image(16, 16);
            image.src = this.url;
            image.onload = function() {
                canvas.drawImage(image, 0, 0)
            }
        }
    },
    mounted() {
        console.log(this);
        // this.drawImage();
    }
}
</script>

<style scoped>
@import '../styles/Post.css';
</style>