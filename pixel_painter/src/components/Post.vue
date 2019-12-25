<template>
    <div class="post">
        <div class="user">
            <div class="min">
                <a><img @click="goToProfile()" src="../assets/test/ava.jpg"/></a>
                <div>
                    <a><p @click="goToProfile()">{{postAuthor}}</p></a>
                </div>
            </div>
        </div>
        <canvas id="picture" width="16" height="16"/>
        <div class="title">
            <p>tutu</p>
        </div>
        <div class="deskription">
            <p>{{likes}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Post',
    props: {
            url: String,
            postAuthor: String,
            likes: Number
    },
    methods: {
        goToProfile () {
            this.$router.push({name: 'Profile'})
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
        this.drawImage();
    }
}
</script>

<style scoped>
@import '../styles/Post.css';
</style>