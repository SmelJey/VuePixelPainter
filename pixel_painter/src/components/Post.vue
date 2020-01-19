<template>
    <div class="post">
        <div class="card" v-for="card in this.$store.getters.DATA" :key="card.id">
            <img class="photo" height="340px" width="340"/>
            <div class="shadow"/>
            <div class="user">
                <div class="min">
                    <a><img class="ava" @click="goToProfile()" src="../assets/test/ava.jpg"/></a>
                    <div>
                        <a><p @click="goToProfile()">Andrey</p></a>
                    </div>
                    <div class="like">
                        <a><img src="../assets/icons/like.png" height="25px" width="25px"/></a>
                    </div>
                </div>
            </div>
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