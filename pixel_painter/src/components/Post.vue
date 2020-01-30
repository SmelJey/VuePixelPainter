<template>
    <div class="post">
        <div class="card">
            <canvas :id="this.artId" v-on:click.self="pictureClick()" class="photo" height="16" width="16"/>
            <div class="shadow" v-on:click.self="pictureClick()" />
            <div class="user" v-on:click.self="pictureClick()">
                <div class="min">
                    <a><img class="ava" v-on:@click="goToProfile()" src="../assets/test/ava.jpg"/></a>
                    <div>
                        <a><p v-on:click="goToProfile()">{{ this.authorName }}</p></a>
                    </div>
                    <div class="like">
                        <a>
                            <img v-if="!isLiked" src="../assets/icons/like.png" height="25px" width="25px" v-on:click="clickLike()"/>
                            <img v-if="isLiked" src="../assets/icons/fill_like.png" height="25px" width="25px" v-on:click="clickLike()"/>
                        </a>
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
            isLiked: Boolean,
            isReq: Boolean
        },
        methods: {
            clickLike() {
                let operation = '/add?';
                if (this.isLiked)
                    operation = '/remove?';

                let req = operation + 'art_id=' + this.artId + '&token=' + this.$cookies.get('token')
                axios.post(req)
                    .then((response) => {
                        if (response.data['status'] === 'INVALID_TOKEN') {
                            this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath);
                        }
                        this.$emit('like');
                    })
            },
            pictureClick() {
                this.$emit('picClick');
            },
            goToProfile () {
                if (this.$router.currentRoute.fullPath !== '/profile?id=' + this.authorName)
                    this.$router.push('/profile?id=' + this.authorName);
            },
            drawImage () {
                let canvas = document.getElementById(this.artId).getContext('2d');
                let image = new Image(16, 16);
                image.src = this.url;
                image.onload = function() {
                    canvas.drawImage(image, 0, 0)
                }
            }
        },
        mounted() {
            this.drawImage();
        }
    }
</script>

<style scoped>
@import '../styles/Post.css';
</style>