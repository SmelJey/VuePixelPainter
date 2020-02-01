<template>
    <div class="post">
        <div class="card">
            <canvas :id="this.artId" v-on:click.self="pictureClick()" class="photo" height="16" width="16"/>
            <div class="user_m">
                <div class="Profile">
                        <a><img class="ava" v-on:@click="goToProfile()" src="../assets/test/ava.jpg"/></a>
                    </div>
                    <div class="authorName">
                        <a><p v-on:click="goToProfile()">{{ this.getName }}</p></a>
                    </div>
                    <div class="like">
                        <a>
                            <img v-if="!isLiked" src="../assets/icons/like.png" height="25px" width="25px" v-on:click="clickLike()"/>
                            <img v-if="isLiked" src="../assets/icons/fill_like.png" height="25px" width="25px" v-on:click="clickLike()"/>
                        </a>
                    </div>
            </div>
            <div class="shadow" v-on:click.self="pictureClick()" />
            <div class="user" v-on:click.self="pictureClick()">
                <div class="min">
                    <div class="Profile">
                        <a><img class="ava" v-on:@click="goToProfile()" src="../assets/test/ava.jpg"/></a>
                    </div>
                    <div class="authorName">
                        <a><p v-on:click="goToProfile()">{{ this.getName }}</p></a>
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
        computed: {
            getName() {
                if (this.authorName.length > 16) {
                    return this.authorName.substr(0, 16) + '...';
                }
                return this.authorName;
            }
        },
        methods: {
            clickLike() {
                let operation = '/likes/add?';
                if (this.isLiked)
                    operation = '/likes/remove?';

                let req = operation + 'art_id=' + this.artId + '&token=' + this.$cookies.get('token');
                Axios.post(req)
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